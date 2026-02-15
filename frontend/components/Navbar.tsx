import Link from 'next/link';
import { Home, Upload, BarChart2 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              RoadGuard AI
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/" icon={<Home className="w-4 h-4 mr-2" />}>Home</NavLink>
              <NavLink href="/detect" icon={<Upload className="w-4 h-4 mr-2" />}>Detect</NavLink>
              <NavLink href="/analytics" icon={<BarChart2 className="w-4 h-4 mr-2" />}>Analytics</NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
      {icon}
      {children}
    </Link>
  );
}
