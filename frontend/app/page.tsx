import Navbar from '@/components/Navbar';
import UploadZone from '@/components/UploadZone';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white selection:bg-purple-500/30">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-4">
            AI-Powered Infrastructure Monitoring
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Intelligent Road <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Damage Detection
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-400">
            Upload images to instantly detect potholes and assess road quality using our advanced YOLOv8 computer vision model.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/detect" className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center">
              Start Detecting <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/analytics" className="px-8 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/10">
              View Analytics
            </Link>
          </div>
        </div>

        {/* Feature Grid (Simplified for MVP) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { title: "High Precision", desc: "Powered by YOLOv8 for accurate bounding box detection." },
            { title: "Instant Analysis", desc: "Get results in seconds with confidence scores." },
            { title: "Data Insights", desc: "Track road conditions over time with our dashboard." }
          ].map((feature, idx) => (
            <div key={idx} className="glass p-8 rounded-2xl hover:border-purple-500/30 transition-colors">
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Area */}
        <div className="glass rounded-3xl p-12 text-center border border-white/10 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to improve road safety?</h2>
            <p className="text-gray-400 mb-8">Join thousands of municipalities using RoadGuard AI.</p>
            <UploadZone />
          </div>

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        </div>
      </main>
    </div>
  );
}
