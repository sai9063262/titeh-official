
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Vehicle from "./pages/Vehicle";
import RtoExam from "./pages/RtoExam";
import TrafficSafety from "./pages/TrafficSafety";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";
import DriverDetails from "./pages/DriverDetails";
import TrafficSigns from "./pages/TrafficSigns";
import Language from "./pages/settings/Language";
import PaymentMethods from "./pages/settings/PaymentMethods";
import Location from "./pages/settings/Location";
import AlertPreferences from "./pages/settings/AlertPreferences";
import DataSync from "./pages/settings/DataSync";
import BackupOptions from "./pages/settings/BackupOptions";
import UserRoles from "./pages/settings/UserRoles";
import HistoryManagement from "./pages/settings/HistoryManagement";
import VehicleManagement from "./pages/settings/VehicleManagement";
import LicenseProcedure from "./pages/rto-exam/LicenseProcedure";
import PracticeExam from "./pages/rto-exam/PracticeExam";
import QuestionBank from "./pages/rto-exam/QuestionBank";
import LicenseProcedureEnhanced from "./pages/rto-exam/LicenseProcedureEnhanced";
import RtoOffices from "./pages/rto-exam/RtoOffices";
import DrivingLaws from "./pages/rto-exam/DrivingLaws";
import Documents from "./pages/rto-exam/Documents";
import PayChallan from "./pages/traffic-safety/PayChallan";
import IncidentReporting from "./pages/traffic-safety/IncidentReporting";
import DriverVerification from "./pages/traffic-safety/DriverVerification";
import TrafficCameraFeed from "./pages/traffic-safety/TrafficCameraFeed";
import VoiceComplaint from "./pages/traffic-safety/VoiceComplaint";
import BlackSpotMap from "./pages/traffic-safety/BlackSpotMap";
import NotFound from "./pages/NotFound";
import ParivhanServices from "./pages/ParivhanServices";
import Dashboard from "./pages/Dashboard";
import FAQ from "./pages/FAQ";
import Newsletter from "./pages/Newsletter";
import DeviceSettings from "./pages/DeviceSettings";
import AdminDriverDetails from "./pages/AdminDriverDetails";
import THelper from "./pages/THelper";

// New admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Calculator pages
import MileageCalculator from "./pages/vehicle/calculators/MileageCalculator";
import LoanCalculator from "./pages/vehicle/calculators/LoanCalculator";
import GstCalculator from "./pages/vehicle/calculators/GstCalculator";
import VehicleAgeCalculator from "./pages/vehicle/calculators/VehicleAgeCalculator";

// Create a new instance of QueryClient
const queryClient = new QueryClient();

// Make sure App is declared as a function component explicitly
const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vehicle" element={<Vehicle />} />
              <Route path="/rto-exam" element={<RtoExam />} />
              <Route path="/traffic-safety" element={<TrafficSafety />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/driver-details" element={<DriverDetails />} />
              <Route path="/traffic-signs" element={<TrafficSigns />} />
              <Route path="/parivahan-services" element={<ParivhanServices />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/device-settings" element={<DeviceSettings />} />
              <Route path="/admin-driver-details" element={<AdminDriverDetails />} />
              <Route path="/t-helper" element={<THelper />} />
              
              {/* Admin routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              
              {/* Settings sub-pages */}
              <Route path="/settings/language" element={<Language />} />
              <Route path="/settings/location" element={<Location />} />
              <Route path="/settings/payment" element={<PaymentMethods />} />
              <Route path="/settings/alerts" element={<AlertPreferences />} />
              <Route path="/settings/sync" element={<DataSync />} />
              <Route path="/settings/backup" element={<BackupOptions />} />
              <Route path="/settings/roles" element={<UserRoles />} />
              <Route path="/settings/history" element={<HistoryManagement />} />
              <Route path="/settings/vehicle" element={<VehicleManagement />} />
              
              {/* RTO Exam sub-pages */}
              <Route path="/rto-exam/license-procedure" element={<LicenseProcedureEnhanced />} />
              <Route path="/rto-exam/practice" element={<PracticeExam />} />
              <Route path="/rto-exam/questions" element={<QuestionBank />} />
              <Route path="/rto-exam/offices" element={<RtoOffices />} />
              <Route path="/rto-exam/documents" element={<Documents />} />
              <Route path="/rto-exam/laws" element={<DrivingLaws />} />
              
              {/* Traffic Safety sub-pages */}
              <Route path="/traffic-safety/pay-challan" element={<PayChallan />} />
              <Route path="/traffic-safety/incident-reporting" element={<IncidentReporting />} />
              <Route path="/traffic-safety/driver-verification" element={<DriverVerification />} />
              <Route path="/traffic-safety/camera-feed" element={<TrafficCameraFeed />} />
              <Route path="/traffic-safety/voice-complaint" element={<VoiceComplaint />} />
              <Route path="/traffic-safety/black-spot-map" element={<BlackSpotMap />} />
              <Route path="/traffic-safety/t-safe-monitoring" element={<BlackSpotMap />} />
              <Route path="/traffic-safety/document-display" element={<BlackSpotMap />} />
              <Route path="/traffic-safety/speed-alerts" element={<BlackSpotMap />} />
              <Route path="/traffic-safety/no-parking-zones" element={<BlackSpotMap />} />
              
              {/* Vehicle Calculator sub-pages */}
              <Route path="/vehicle/calculators/mileage" element={<MileageCalculator />} />
              <Route path="/vehicle/calculators/loan" element={<LoanCalculator />} />
              <Route path="/vehicle/calculators/gst" element={<GstCalculator />} />
              <Route path="/vehicle/calculators/vehicle-age" element={<VehicleAgeCalculator />} />
              
              {/* 404 page for undefined routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
