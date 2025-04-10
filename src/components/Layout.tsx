
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Car, School, Shield, User, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-titeh-primary text-white p-4 flex justify-between items-center shadow-md">
        <Link to="/" className="text-xl font-bold">TITEH</Link>
        <button className="px-3 py-1 bg-white text-titeh-primary rounded-md hover:bg-gray-100 transition-colors">
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 container mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        <p>© 2025 Telangana Government</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Contact Us</a>
          <a href="#" className="hover:underline">Feedback</a>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 flex justify-around py-2 md:px-8 shadow-lg z-10">
        <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-titeh-primary' : 'text-gray-600'}`}>
          <Home className="nav-icon" size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/vehicle" className={`flex flex-col items-center p-2 ${isActive('/vehicle') ? 'text-titeh-primary' : 'text-gray-600'}`}>
          <Car className="nav-icon" size={20} />
          <span className="text-xs mt-1">Vehicle</span>
        </Link>
        <Link to="/rto-exam" className={`flex flex-col items-center p-2 ${isActive('/rto-exam') ? 'text-titeh-primary' : 'text-gray-600'}`}>
          <School className="nav-icon" size={20} />
          <span className="text-xs mt-1">RTO Exam</span>
        </Link>
        <Link to="/traffic-safety" className={`flex flex-col items-center p-2 ${isActive('/traffic-safety') ? 'text-titeh-primary' : 'text-gray-600'}`}>
          <Shield className="nav-icon" size={20} />
          <span className="text-xs mt-1">Safety</span>
        </Link>
        <Link to="/attendance" className={`flex flex-col items-center p-2 ${isActive('/attendance') ? 'text-titeh-primary' : 'text-gray-600'}`}>
          <User className="nav-icon" size={20} />
          <span className="text-xs mt-1">Attendance</span>
        </Link>
        <Link to="/settings" className={`flex flex-col items-center p-2 ${isActive('/settings') ? 'text-titeh-primary' : 'text-gray-600'}`}>
          <Settings className="nav-icon" size={20} />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </nav>
      
      {/* Spacer for bottom navigation */}
      <div className="h-16"></div>
    </div>
  );
};

export default Layout;
