import React from 'react';
import { Link } from 'react-router-dom';
import Button from "../../components/ui/Button.tsx";
import {useAuth} from "../../context/AuthContext.tsx";

const HomePage: React.FC = () => {
    const {isAuthenticated} = useAuth();
    return (
        <div className="relative overflow-hidden bg-white dark:bg-black transition-colors duration-300">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-30 dark:opacity-20 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary rounded-full blur-[140px]"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-brand-accent rounded-full blur-[120px]"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-4 z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-block px-4 py-1.5 mb-8 text-xs font-bold tracking-widest text-brand-primary uppercase bg-brand-primary/10 rounded-full border border-brand-primary/20">
                        Powered by AI
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-black dark:text-white mb-8 leading-[1.1]">
                        Are you tired of stress blocking your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">full potential</span> on job interviews?
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
                        Try <span className="font-bold text-black dark:text-white">JobAcer</span>! Our app uses state-of-the-art artificial intelligence to simulate real job interview vibes and tailored questions, helping you practice and ace your next big opportunity.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                            <Button variant="primary" className="w-full sm:w-auto px-10 py-4 text-lg rounded-2xl shadow-xl shadow-brand-primary/20 transition-all hover:scale-105 active:scale-95">
                                Get Started Now
                            </Button>
                        </Link>
                        <Link to="/demo">
                            <Button variant="outline" className="w-full sm:w-auto px-10 py-4 text-lg rounded-2xl backdrop-blur-sm border-2 border-brand-primary/20 hover:border-brand-primary transition-all">
                                Try Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 items-center justify-center max-w-3xl mx-auto pt-10 border-t border-zinc-100 dark:border-zinc-800">
                        <div>
                            <p className="text-3xl font-black text-black dark:text-white">100%</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Context-Aware</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-black dark:text-white">AI</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Powered Brain</p>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-3xl font-black text-black dark:text-white">Real-time</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Feedback Loop</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="relative py-32 bg-zinc-50/50 dark:bg-white/5 border-y border-zinc-100 dark:border-zinc-900">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-black dark:text-white mb-4 tracking-tight">How JobAcer Works</h2>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl">
                            Master your interview skills in four simple steps powered by state-of-the-art AI.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Upload CV", desc: "Upload your PDF resume. Our AI extracts your skills and experience." },
                            { step: "02", title: "Add Job", desc: "Provide the job description you're aiming for to tailor the questions." },
                            { step: "03", title: "Simulation", desc: "Engage in a realistic chat-based interview with our Gemini-powered AI." },
                            { step: "04", title: "Get Feedback", desc: "Receive a detailed report with scores, strengths, and areas for growth." }
                        ].map((item, idx) => (
                            <div key={idx} className="relative p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-2xl hover:border-brand-primary/50 transition-all group">
                                <span className="text-6xl font-black text-brand-primary/5 group-hover:text-brand-primary/10 transition-colors absolute top-4 right-6">{item.step}</span>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-3 mt-4">{item.title}</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-4 bg-white dark:bg-black">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-black dark:text-white mb-8 leading-tight tracking-tight">
                                Smarter preparation for your <span className="text-brand-accent">next big move.</span>
                            </h2>
                            <div className="space-y-10">
                                {[
                                    { title: "Context-Aware AI", desc: "Questions aren't generic. They are generated based on YOUR specific background and the target job's requirements." },
                                    { title: "Real-time Simulation", desc: "Practice in a pressure-free environment that mimics the flow of a real technical or HR interview." },
                                    { title: "Actionable Insights", desc: "Don't just practice—improve. Our AI evaluates your technical accuracy and communication style." }
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex gap-6">
                                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                                            <svg className="w-7 h-7 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-black dark:text-white mb-2">{feature.title}</h4>
                                            <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed font-medium">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-[4rem] bg-gradient-to-tr from-brand-primary/10 to-brand-accent/10 flex items-center justify-center overflow-hidden border border-brand-primary/5 p-4">
                                <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 w-[90%] transform rotate-2 hover:rotate-0 transition-transform duration-700">
                                     <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-white font-black italic shadow-lg shadow-brand-primary/30">J</div>
                                        <div className="h-2.5 w-32 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                                     </div>
                                     <div className="space-y-5">
                                        <div className="w-2/3 h-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl rounded-tl-none border border-zinc-100 dark:border-zinc-800"></div>
                                        <div className="w-1/2 h-8 bg-brand-primary/10 rounded-2xl rounded-tr-none ml-auto border border-brand-primary/20"></div>
                                        <div className="w-3/4 h-14 bg-zinc-50 dark:bg-zinc-800/50 rounded-[1.5rem] rounded-tl-none border border-zinc-100 dark:border-zinc-800"></div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-32 px-4">
                <div className="max-w-6xl mx-auto rounded-[4rem] bg-brand-primary p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-brand-primary/20">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to Ace Your Interview?</h2>
                        <p className="text-blue-100 mb-12 text-lg md:text-xl opacity-90 font-medium">Join thousands of candidates who improved their skills with JobAcer.</p>
                        <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                            <Button variant="outline" className="bg-white text-brand-primary border-white hover:bg-zinc-50 px-12 py-5 text-xl font-black rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 border-t border-zinc-100 dark:border-zinc-900 text-center bg-white dark:bg-black transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-4">
                    <p className="text-zinc-500 dark:text-zinc-600 text-sm italic">© 2026 JobAcer.</p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
