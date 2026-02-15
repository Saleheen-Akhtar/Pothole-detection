"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Download } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/analytics');
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      }
    };
    fetchData();
  }, []);

  const handleExport = (type: 'csv' | 'pdf') => {
    window.open(`http://localhost:8000/api/export/${type}`, '_blank');
  };

  if (!data) return <div className="text-center p-10 text-gray-400">Loading analytics...</div>;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Images Processed" value={data.total_images} />
        <StatCard title="Total Potholes Detected" value={data.total_potholes} />
        <StatCard title="Average Confidence Score" value={`${(data.average_confidence * 100).toFixed(1)}%`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold mb-6 text-gray-200">Daily Detections</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.daily_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#8B5CF6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 flex flex-col justify-center items-center text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-200">Export Reports</h3>
          <p className="text-gray-400 max-w-sm">Download comprehensive reports of all detections in CSV or PDF format.</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4 mr-2 text-green-400" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4 mr-2 text-red-400" />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="glass p-6 rounded-xl border border-white/10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <BarChart className="w-16 h-16 text-white" />
      </div>
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h3>
      <p className="text-4xl font-bold text-white mt-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        {value}
      </p>
    </div>
  );
}
