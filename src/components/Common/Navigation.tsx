import React from 'react';
import { Cloud, TrendingUp, Settings } from 'lucide-react';

interface NavLink {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  currentPage: string;
  onPageChange: (pageId: string) => void;
}

const navLinks: NavLink[] = [
  { id: 'current', label: 'Current Weather', icon: <Cloud className="w-5 h-5" /> },
  { id: 'historical', label: 'Historical Trends', icon: <TrendingUp className="w-5 h-5" /> },
];

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex gap-4">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => onPageChange(link.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPage === link.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.icon}
                <span className="hidden md:inline">{link.label}</span>
              </button>
            ))}
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
