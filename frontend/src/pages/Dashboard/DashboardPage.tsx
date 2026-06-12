import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';
import { llmApi } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const DashboardPage: React.FC = () => {
    const [jobName, setJobName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { user } = useAuth();

    const handleStartInterview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !jobName || !jobDescription) {
            setError('Please complete all fields and upload your CV.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Upload CV
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('userId', user?.id?.toString() || '0');

            await llmApi.post('/llm/v1/upload-cv', formData);

            // Upload job description
            const jobResponse = await llmApi.post('/llm/v1/upload-job', null, {
                params: {
                    jobName,
                    description: jobDescription,
                    userId: user?.id?.toString() || '0'
                }
            });
            const realJobId = jobResponse.data;

            // Create interview and get first question
            const response = await llmApi.post('/llm/v1/interviews', null, {
                params: {
                    userId: user?.id?.toString() || '0',
                    jobId: realJobId.toString(),
                    name: `Interview for ${jobName}`,
                    interviewerJob: 'Senior Technical Interviewer'
                }
            });

            // Redirect to actual interview chat
            const { interviewId, firstQuestion } = response.data;
            navigate(`/interview/${interviewId}`, { state: { initialQuestion: firstQuestion } });

        } catch (err: any) {
            console.error(err);
            setError('Failed to setup interview. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 transition-colors duration-300">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-black dark:text-white mb-2">
                    Welcome, <span className="text-brand-primary">{user?.username}</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Let's set up your personalized interview session.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column: Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="p-8 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-none">
                        <form onSubmit={handleStartInterview} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            <Input
                                label="Job Title"
                                placeholder="e.g. Software Engineer, Marketing Manager"
                                value={jobName}
                                onChange={(e) => setJobName(e.target.value)}
                                required
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Job Description
                                </label>
                                <textarea
                                    className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 
                                    bg-white dark:bg-gray-900 text-black dark:text-white 
                                    focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all min-h-32"
                                    placeholder="Paste the job description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <FileUpload
                                label="Your CV"
                                onFileSelect={(file) => setSelectedFile(file)}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-4 text-lg rounded-2xl"
                                disabled={isLoading}
                            >
                                {isLoading ? "Preparing Interview..." : "Start Interview Simulation"}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Info */}
                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-brand-primary/5 border border-brand-primary/10">
                        <h3 className="font-bold text-black dark:text-white mb-3">How it works?</h3>
                        <ul className="text-sm space-y-3 text-gray-600 dark:text-gray-400">
                            <li className="flex gap-2">
                                <span className="text-brand-primary font-bold">1.</span>
                                <span>Upload your CV to let AI understand your background.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-primary font-bold">2.</span>
                                <span>Add the job description to tailor the questions.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-brand-primary font-bold">3.</span>
                                <span>Our Gemini AI generates a custom interview path.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-black dark:text-white mb-2">Tip</h3>
                        <p className="text-sm text-gray-500">
                            The more detailed the job description, the better the AI can simulate the actual interview vibe.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
