
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Vehicle from "./pages/Vehicle";
import NotFound from "./pages/NotFound";
import TrafficSigns from "./pages/TrafficSigns";
import ParivhanServices from "./pages/ParivhanServices";
import Dashboard from "./pages/Dashboard";
import TrafficSafety from "./pages/TrafficSafety";
import RtoExam from "./pages/RtoExam";
import FAQ from "./pages/FAQ";
import Newsletter from "./pages/Newsletter";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";
import "./App.css";
import DriverDetails from "./pages/DriverDetails";
import THelper from "./pages/THelper";
import DeviceSettings from "./pages/DeviceSettings";

// Settings pages
import Language from "./pages/settings/Language";
import Location from "./pages/settings/Location";
import PaymentMethods from "./pages/settings/PaymentMethods";
import AlertPreferences from "./pages/settings/AlertPreferences";
import DataSync from "./pages/settings/DataSync";
import BackupOptions from "./pages/settings/BackupOptions";
import UserRoles from "./pages/settings/UserRoles";
import HistoryManagement from "./pages/settings/HistoryManagement";
import VehicleManagement from "./pages/settings/VehicleManagement";

// RTO Exam pages
import Documents from "./pages/rto-exam/Documents";
import DrivingLaws from "./pages/rto-exam/DrivingLaws";
import LicenseProcedure from "./pages/rto-exam/LicenseProcedure";
import LicenseProcedureEnhanced from "./pages/rto-exam/LicenseProcedureEnhanced";
import PracticeExam from "./pages/rto-exam/PracticeExam";
import QuestionBank from "./pages/rto-exam/QuestionBank";
import RtoOffices from "./pages/rto-exam/RtoOffices";

// Traffic Safety pages
import BlackSpotMap from "./pages/traffic-safety/BlackSpotMap";
import DriverVerification from "./pages/traffic-safety/DriverVerification";
import IncidentReporting from "./pages/traffic-safety/IncidentReporting";
import PayChallan from "./pages/traffic-safety/PayChallan";
import TrafficCameraFeed from "./pages/traffic-safety/TrafficCameraFeed";
import VoiceComplaint from "./pages/traffic-safety/VoiceComplaint";

// Vehicle calculators
import GstCalculator from "./pages/vehicle/calculators/GstCalculator";
import LoanCalculator from "./pages/vehicle/calculators/LoanCalculator";
import MileageCalculator from "./pages/vehicle/calculators/MileageCalculator";
import VehicleAgeCalculator from "./pages/vehicle/calculators/VehicleAgeCalculator";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDriverDetails from "./pages/AdminDriverDetails";
import AdminDashboardPage from "./pages/admin/Dashboard";
import EditContent from "./pages/admin/EditContent";
import UpdateFeatures from "./pages/admin/UpdateFeatures";
import BreakingNews from "./pages/admin/BreakingNews";
import AlertManagement from "./pages/admin/AlertManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/vehicle" element={<Vehicle />} />
      <Route path="/traffic-signs" element={<TrafficSigns />} />
      <Route path="/parivahan-services" element={<ParivhanServices />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/traffic-safety" element={<TrafficSafety />} />
      <Route path="/rto-exam" element={<RtoExam />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/newsletter" element={<Newsletter />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/driver-details" element={<DriverDetails />} />
      <Route path="/t-helper" element={<THelper />} />
      <Route path="/device-settings" element={<DeviceSettings />} />

      {/* Settings routes */}
      <Route path="/settings/language" element={<Language />} />
      <Route path="/settings/location" element={<Location />} />
      <Route path="/settings/payment" element={<PaymentMethods />} />
      <Route path="/settings/alerts" element={<AlertPreferences />} />
      <Route path="/settings/sync" element={<DataSync />} />
      <Route path="/settings/backup" element={<BackupOptions />} />
      <Route path="/settings/roles" element={<UserRoles />} />
      <Route path="/settings/history" element={<HistoryManagement />} />
      <Route path="/settings/vehicle" element={<VehicleManagement />} />

      {/* RTO Exam routes */}
      <Route path="/rto-exam/documents" element={<Documents />} />
      <Route path="/rto-exam/driving-laws" element={<DrivingLaws />} />
      <Route path="/rto-exam/license-procedure" element={<LicenseProcedure />} />
      <Route path="/rto-exam/license-procedure-enhanced" element={<LicenseProcedureEnhanced />} />
      <Route path="/rto-exam/practice-exam" element={<PracticeExam />} />
      <Route path="/rto-exam/question-bank" element={<QuestionBank />} />
      <Route path="/rto-exam/rto-offices" element={<RtoOffices />} />

      {/* Traffic Safety routes */}
      <Route path="/traffic-safety/black-spot-map" element={<BlackSpotMap />} />
      <Route path="/traffic-safety/driver-verification" element={<DriverVerification />} />
      <Route path="/traffic-safety/incident-reporting" element={<IncidentReporting />} />
      <Route path="/traffic-safety/pay-challan" element={<PayChallan />} />
      <Route path="/traffic-safety/traffic-camera-feed" element={<TrafficCameraFeed />} />
      <Route path="/traffic-safety/voice-complaint" element={<VoiceComplaint />} />

      {/* Vehicle Calculator routes */}
      <Route path="/vehicle/calculators/gst" element={<GstCalculator />} />
      <Route path="/vehicle/calculators/loan" element={<LoanCalculator />} />
      <Route path="/vehicle/calculators/mileage" element={<MileageCalculator />} />
      <Route path="/vehicle/calculators/age" element={<VehicleAgeCalculator />} />

      {/* Admin routes */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-driver-details" element={<AdminDriverDetails />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/content" element={<EditContent />} />
      <Route path="/admin/features" element={<UpdateFeatures />} />
      <Route path="/admin/news" element={<BreakingNews />} />
      <Route path="/admin/alerts" element={<AlertManagement />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
