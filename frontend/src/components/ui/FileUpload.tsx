import React, { useRef, useState } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept = ".pdf", label }) => {
    const [fileName, setFileNamed] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileNamed(file.name);
            onFileSelect(file);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-brand-primary dark:hover:border-brand-primary transition-all bg-gray-50 dark:bg-gray-900/50"
            >
                <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    accept={accept}
                    onChange={handleFileChange}
                />
                <div className="p-3 bg-brand-primary/10 rounded-full text-brand-primary">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-black dark:text-white">
                        {fileName ? fileName : "Click to upload your CV (PDF)"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
