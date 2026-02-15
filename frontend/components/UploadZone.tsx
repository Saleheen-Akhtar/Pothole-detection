"use client";
import { useState, useCallback } from 'react';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadZone() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setErrorMessage(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Assuming backend is running on port 8000
      const response = await axios.post('http://localhost:8000/api/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.detail ?? "Failed to process image.");
      } else {
        setErrorMessage("Failed to process image.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Side: Upload */}
      <div className="space-y-6">
        <div
          className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center bg-gray-900/50 hover:bg-gray-900/80 transition-colors cursor-pointer relative overflow-hidden"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <AnimatePresence>
            {!preview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64"
              >
                <div className="p-4 rounded-full bg-blue-500/10 mb-4">
                  <UploadCloud className="w-10 h-10 text-blue-400" />
                </div>
                <p className="text-xl font-medium text-gray-300">Drag & drop or click to upload</p>
                <p className="text-sm text-gray-500 mt-2">Support JPG, PNG (Max 10MB)</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-64 flex flex-col items-center justify-center"
              >
                <img src={preview} alt="Preview" className="max-h-full rounded-lg shadow-lg" />
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null); }}
                  className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            'Detect Potholes'
          )}
        </button>

        {errorMessage && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Right Side: Result */}
      <div className="glass rounded-xl p-6 min-h-[400px] flex flex-col">
        <h3 className="text-xl font-semibold mb-4 text-gray-200 border-b border-white/10 pb-2">Detection Results</h3>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-xs space-y-2">
              <div className="h-2bg-gray-700 rounded overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <p className="text-center text-sm text-gray-400">Analyzing road surface...</p>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative rounded-lg overflow-hidden border border-white/10 group">
              <img src={result.annotated_image} alt="Result" className="w-full h-auto" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-center text-white">Analyzed Image</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-white/5">
                <p className="text-sm text-gray-400">Potholes Detected</p>
                <p className="text-2xl font-bold text-white">{result.pothole_count}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-white/5">
                <p className="text-sm text-gray-400">Avg Confidence</p>
                <p className="text-2xl font-bold text-green-400">{(result.avg_confidence * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4 border border-white/5">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Detailed Findings</h4>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {result.detections.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No potholes detected.</p>
                ) : (
                  result.detections.map((det: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded">
                      <span className="text-gray-400">Pothole #{idx + 1}</span>
                      <span className="text-blue-400 font-mono">{(det.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 italic">
            Upload an image to see analysis results.
          </div>
        )}
      </div>
    </div>
  );
}
