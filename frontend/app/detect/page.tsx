import Navbar from '@/components/Navbar';
import UploadZone from '@/components/UploadZone';

export default function DetectPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Pothole Detection</h1>
        <UploadZone />
      </main>
    </div>
  );
}
