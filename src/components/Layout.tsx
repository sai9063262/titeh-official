
import { ReactNode, useState } from "react";
import FloatingTHelper from "./t-helper/FloatingTHelper";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Car, 
  School, 
  Shield, 
  User, 
  Settings, 
  BarChart3,
  HelpCircle, 
  Mail, 
  Menu,
  X, 
  FileText,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-titeh-primary text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="text-white p-2 md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white w-64">
              <div className="py-6 h-full flex flex-col">
                <h2 className="text-xl font-bold mb-6 text-titeh-primary px-4">TITEH</h2>
                <nav className="space-y-1 flex-1">
                  <Link 
                    to="/" 
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/') ? 'bg-blue-50 text-titeh-primary' : 'text-gray-700'}`}
                  >
                    <Home className="h-5 w-5 mr-3" />
                    Home
                  </Link>
                  <Link 
                    to="/vehicle" 
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/vehicle') ? 'bg-blue-50 text-titeh-primary' : 'text-gray-700'}`}
                  >
                    <Car className="h-5 w-5 mr-3" />
                    Vehicle Management
                  </Link>
                  <Link 
                    to="/rto-exam" 
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/rto-exam') ? 'bg-blue-50 text-titeh-primary' : 'text-gray-700'}`}
                  >
                    <School className="h-5 w-5 mr-3" />
                    RTO Exam & Learning
                  </Link>
                  <Link 
                    to="/traffic-safety" 
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/traffic-safety') ? 'bg-blue-50 text-titeh-primary' : 'text-gray-700'}`}
                  >
                    <Shield className="h-5 w-5 mr-3" />
                    Traffic Enforcement
                  </Link>
                  <Link 
                    to="/attendance" 
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/attendance') ? 'bg-blue-50 text-titeh-primary' : 'text-gray-700'}`}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Attendance
                  </Link>
                  <Link 
                    to="/parivahan-services" 
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/parivahan-services') ? 'bg-blue-50 text-titeh-primary' : 'text-gray-700'}`}
                  >
                    <CreditCard className="h-5 w-5 mr-3" />
                    Parivahan Services
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/dashboard') ? 'bg-blue-50 text-titeh-primary' : 'text-gray-700'}`}
                  >
                    <BarChart3 className="h-5 w-5 mr-3" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/faq" 
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/faq') ? 'bg-blue-50 text-titeh-primary' : 'text-gray-700'}`}
                  >
                    <HelpCircle className="h-5 w-5 mr-3" />
                    FAQ
                  </Link>
                  <Link 
                    to="/newsletter" 
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/newsletter') ? 'bg-blue-50 text-titeh-primary' : 'text-gray-700'}`}
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    Newsletter
                  </Link>
                  <Link 
                    to="/settings" 
                    className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/settings') ? 'bg-blue-50 text-titeh-primary' : 'text-gray-700'}`}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="text-xl font-bold ml-2">TITEH</Link>
        </div>
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

      {/* Floating T-Helper, visible on all screens */}
      <FloatingTHelper />

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
        <Link to="/parivahan-services" className={`flex flex-col items-center p-2 ${isActive('/parivahan-services') ? 'text-titeh-primary' : 'text-gray-600'}`}>
          <FileText className="nav-icon" size={20} />
          <span className="text-xs mt-1">Parivahan</span>
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
