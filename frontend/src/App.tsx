import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send, FileText, Loader2 } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [answer, setAnswer] = useState('');

  const BACKEND_URL = 'http://127.0.0.1:8000'; // Update if backend is deployed elsewhere

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      setFiles(uploadedFiles);
      uploadFiles(uploadedFiles);
    }
  };

  const uploadFiles = async (uploadedFiles: File[]) => {
    setIsLoading(true);
    setStatus('Uploading files...');

    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${BACKEND_URL}/upload-files/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(data.message || 'Documents uploaded successfully');
      } else {
        setStatus(data.error || 'Failed to upload documents');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setStatus('An error occurred during upload');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setStatus('Processing your question...');
    setAnswer('');

    try {
      const response = await fetch(`${BACKEND_URL}/ask-question/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnswer(data.answer);
        setStatus('Answer generated successfully');
      } else {
        setStatus(data.error || 'Failed to get answer');
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setStatus('An error occurred while asking question');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-center text-accent-teal"
        >
          Document Q&A Assistant
        </motion.h1>

        {/* Upload Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <div className="border-2 border-dashed border-accent-gray rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-accent-teal" />
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept=".pdf,.txt,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="bg-accent-teal text-black px-6 py-2 rounded-full hover:bg-opacity-80 transition-colors">
                Upload Documents
              </span>
            </label>
            <p className="mt-2 text-sm text-gray-400">
              Supports PDF, TXT, and DOCX files
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto bg-accent-gray bg-opacity-20 rounded-lg p-4">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-accent-teal" />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Question Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="flex-1 bg-accent-gray bg-opacity-20 border border-accent-gray rounded-lg px-4 py-2 focus:outline-none focus:border-accent-teal"
            />
            <button
              onClick={handleAskQuestion}
              disabled={isLoading}
              className="bg-accent-teal text-black px-6 py-2 rounded-lg hover:bg-opacity-80 transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Ask
            </button>
          </div>
        </motion.div>

        {/* Answer Display */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-accent-gray bg-opacity-20 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4 text-accent-teal">Answer</h2>
          <p className="text-gray-400 whitespace-pre-line">
            {answer ? answer : 'Your AI-generated answer will appear here...'}
          </p>
        </motion.div>

        {/* Status Message */}
        {status && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-accent-teal">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin inline mr-2" />}
            {status}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
