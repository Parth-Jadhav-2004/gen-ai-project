import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send, FileText, Loader2, Trash2, List } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [answer, setAnswer] = useState('');
  const [pageNumber, setPageNumber] = useState<number | null>(null);
  const [summaryPoints, setSummaryPoints] = useState<string[]>([]);

  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: string; time: string; pageNumber?: number }[]
  >(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const BACKEND_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

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
    setSummaryPoints([]);

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
    setPageNumber(null);

    try {
      const response = await fetch(`${BACKEND_URL}/ask-question/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (response.ok) {
        const newEntry = {
          question,
          answer: data.answer,
          time: new Date().toLocaleString(),
          pageNumber: data.page_number,
        };
        setChatHistory([...chatHistory, newEntry]);
        setAnswer(data.answer);
        setPageNumber(data.page_number);
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

  const handleClearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
  };

  const handleSummarize = async () => {
    setIsLoading(true);
    setStatus('Summarizing document...');
    setSummaryPoints([]);

    try {
      const response = await fetch(`${BACKEND_URL}/summarize/`);
      const data = await response.json();

      if (response.ok && Array.isArray(data.summary)) {
        setSummaryPoints(data.summary);
        setStatus('Summary generated');
      } else {
        setStatus(data.error || 'Failed to summarize document');
      }
    } catch (err) {
      console.error('Error summarizing:', err);
      setStatus('An error occurred while summarizing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* LEFT PANEL: Chat History */}
        <div className="w-full md:w-1/4 bg-[#E0F7FA] p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Chat History</h3>
            <button
              onClick={handleClearHistory}
              className="text-sm flex items-center text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </button>
          </div>
          <div className="space-y-3 max-h-[75vh] overflow-y-auto">
            {chatHistory.map((entry, idx) => (
              <div key={idx} className="bg-white border p-3 rounded shadow-sm">
                <p className="text-sm font-semibold">Q: {entry.question}</p>
                <p className="text-sm">A: {entry.answer}</p>
                <p className="text-xs text-gray-500">{entry.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER PANEL: Upload + QnA */}
        <div className="w-full md:w-2/4 flex flex-col gap-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center"
          >
            Document Q&A Assistant
          </motion.h1>

          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center bg-[#E0F7FA]">
            <Upload className="w-8 h-8 mx-auto mb-3 text-black" />
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept=".pdf,.txt,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="bg-[#4CAF50] text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors">
                Upload Documents
              </span>
            </label>
            <p className="mt-2 text-sm text-gray-600">
              Supports PDF, TXT, and DOCX
            </p>
          </div>

          {files.length > 0 && (
            <div className="bg-[#E0F7FA] rounded p-4 max-h-32 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Question Area */}
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border border-gray-400 rounded px-4 py-2 focus:outline-none"
            />
            <button
              onClick={handleAskQuestion}
              disabled={isLoading}
              className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Ask
            </button>
          </div>

          {/* Answer Display */}
          <div className="border rounded p-4 bg-[#E0F7FA]">
            <h2 className="text-lg font-semibold mb-2">Answer</h2>
            <p className="text-sm whitespace-pre-line">
              {answer ? answer : 'Your AI-generated answer will appear here...'}
            </p>
            {pageNumber !== null && (
              <p className="text-sm mt-2 text-gray-600">
                📄 Found on page: <strong>{pageNumber}</strong>
              </p>
            )}
          </div>

          {/* Status Message */}
          {status && (
            <div className="text-center text-sm text-gray-600">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin inline mr-2" />}
              {status}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Summary with Staggered Reveal */}
        <div className="w-full md:w-1/4 bg-[#E0F7FA] p-4 rounded-lg shadow flex flex-col">
          <button
            onClick={handleSummarize}
            disabled={isLoading}
            className="bg-[#4CAF50] text-white py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center gap-2 mb-2"
          >
            <List className="w-4 h-4" />
            Summarize
          </button>

          <div className="overflow-y-auto max-h-[100vh]">
            {summaryPoints.length > 0 && (
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.2,
                    },
                  },
                }}
                className="list-disc pl-5 space-y-1 text-sm"
              >
                {summaryPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    {point}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
