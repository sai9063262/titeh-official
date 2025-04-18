
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
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
import Auth from "./pages/Auth";
import "./App.css";
import DriverDetails from "./pages/DriverDetails";
import THelper from "./pages/THelper";
import DeviceSettings from "./pages/DeviceSettings";
import Profile from "./pages/Profile";

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
import Practice from "./pages/rto-exam/Practice";
import MockTest from "./pages/rto-exam/MockTest";
import RoadSigns from "./pages/rto-exam/RoadSigns";
import DrivingTips from "./pages/rto-exam/DrivingTips";
import Schools from "./pages/rto-exam/Schools";
import ExamSchedule from "./pages/rto-exam/ExamSchedule";
import LearnersLogbook from "./pages/rto-exam/LearnersLogbook";
import TrafficQuiz from "./pages/rto-exam/TrafficQuiz";
import VirtualSimulator from "./pages/rto-exam/VirtualSimulator";
import PenaltyTracker from "./pages/rto-exam/PenaltyTracker";
import SafetyVideos from "./pages/rto-exam/SafetyVideos";
import RenewalGuide from "./pages/rto-exam/RenewalGuide";
import CommunityForum from "./pages/rto-exam/CommunityForum";
import AdaptiveLearning from "./pages/rto-exam/AdaptiveLearning";
import ViolationAlerts from "./pages/rto-exam/ViolationAlerts";
import ExpertQA from "./pages/rto-exam/ExpertQA";
import HazardPerception from "./pages/rto-exam/HazardPerception";
import FitnessAssessment from "./pages/rto-exam/FitnessAssessment";

// Traffic Safety pages
import BlackSpotMap from "./pages/traffic-safety/BlackSpotMap";
import DriverVerification from "./pages/traffic-safety/DriverVerification";
import IncidentReporting from "./pages/traffic-safety/IncidentReporting";
import PayChallan from "./pages/traffic-safety/PayChallan";
import TrafficCameraFeed from "./pages/traffic-safety/TrafficCameraFeed";
import VoiceComplaint from "./pages/traffic-safety/VoiceComplaint";
import NoParkingZones from "./pages/traffic-safety/NoParkingZones";
import SpeedAlerts from "./pages/traffic-safety/SpeedAlerts";
import FingerprintVerification from "./pages/traffic-safety/FingerprintVerification";
import EmergencyEvacuation from "./pages/traffic-safety/EmergencyEvacuation";
import SafetyScore from "./pages/traffic-safety/SafetyScore";
import VehicleRecalls from "./pages/traffic-safety/VehicleRecalls";
import DistractedDriving from "./pages/traffic-safety/DistractedDriving";
import RoadCondition from "./pages/traffic-safety/RoadCondition";
import ChildSafety from "./pages/traffic-safety/ChildSafety";
import FatigueManagement from "./pages/traffic-safety/FatigueManagement";
import TrafficSignalTiming from "./pages/traffic-safety/TrafficSignalTiming";
import WeatherDrivingTips from "./pages/traffic-safety/WeatherDrivingTips";
import AirQualityMonitor from "./pages/traffic-safety/AirQualityMonitor";
import EmergencyBeacon from "./pages/traffic-safety/EmergencyBeacon";
import DriverHealthCheck from "./pages/traffic-safety/DriverHealthCheck";
import SafetyRegulations from "./pages/traffic-safety/SafetyRegulations";
import SafetyPledge from "./pages/traffic-safety/SafetyPledge";

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
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/traffic-signs" element={<TrafficSigns />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/rto-exam" element={<RtoExam />} />
        <Route path="/faq" element={<FAQ />} />
        
        {/* Auth protected routes */}
        <Route element={<AuthGuard />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/vehicle" element={<Vehicle />} />
          <Route path="/parivahan-services" element={<ParivhanServices />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/traffic-safety" element={<TrafficSafety />} />
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
          <Route path="/rto-exam/laws" element={<DrivingLaws />} />
          <Route path="/rto-exam/license-procedure" element={<LicenseProcedure />} />
          <Route path="/rto-exam/license-procedure-enhanced" element={<LicenseProcedureEnhanced />} />
          <Route path="/rto-exam/practice-exam" element={<PracticeExam />} />
          <Route path="/rto-exam/questions" element={<QuestionBank />} />
          <Route path="/rto-exam/offices" element={<RtoOffices />} />
          <Route path="/rto-exam/practice" element={<Practice />} />
          <Route path="/rto-exam/mock-test" element={<MockTest />} />
          <Route path="/rto-exam/road-signs" element={<RoadSigns />} />
          <Route path="/rto-exam/driving-tips" element={<DrivingTips />} />
          <Route path="/rto-exam/schools" element={<Schools />} />
          <Route path="/rto-exam/exam-schedule" element={<ExamSchedule />} />
          <Route path="/rto-exam/learners-logbook" element={<LearnersLogbook />} />
          <Route path="/rto-exam/traffic-quiz" element={<TrafficQuiz />} />
          <Route path="/rto-exam/simulator" element={<VirtualSimulator />} />
          <Route path="/rto-exam/penalty-tracker" element={<PenaltyTracker />} />
          <Route path="/rto-exam/safety-videos" element={<SafetyVideos />} />
          <Route path="/rto-exam/renewal-guide" element={<RenewalGuide />} />
          <Route path="/rto-exam/forum" element={<CommunityForum />} />
          <Route path="/rto-exam/adaptive-learning" element={<AdaptiveLearning />} />
          <Route path="/rto-exam/violation-alerts" element={<ViolationAlerts />} />
          <Route path="/rto-exam/expert-qa" element={<ExpertQA />} />
          <Route path="/rto-exam/hazard-perception" element={<HazardPerception />} />
          <Route path="/rto-exam/fitness-assessment" element={<FitnessAssessment />} />

          {/* Traffic Safety routes */}
          <Route path="/traffic-safety/black-spot-map" element={<BlackSpotMap />} />
          <Route path="/traffic-safety/driver-verification" element={<DriverVerification />} />
          <Route path="/traffic-safety/incident-reporting" element={<IncidentReporting />} />
          <Route path="/traffic-safety/pay-challan" element={<PayChallan />} />
          <Route path="/traffic-safety/traffic-camera-feed" element={<TrafficCameraFeed />} />
          <Route path="/traffic-safety/voice-complaint" element={<VoiceComplaint />} />
          <Route path="/traffic-safety/no-parking-zones" element={<NoParkingZones />} />
          <Route path="/traffic-safety/speed-alerts" element={<SpeedAlerts />} />
          <Route path="/traffic-safety/fingerprint-verification" element={<FingerprintVerification />} />
          <Route path="/traffic-safety/emergency-evacuation" element={<EmergencyEvacuation />} />
          
          {/* New Traffic Safety Routes */}
          <Route path="/traffic-safety/safety-score" element={<SafetyScore />} />
          <Route path="/traffic-safety/vehicle-recalls" element={<VehicleRecalls />} />
          <Route path="/traffic-safety/distracted-driving" element={<DistractedDriving />} />
          <Route path="/traffic-safety/road-condition" element={<RoadCondition />} />
          <Route path="/traffic-safety/child-safety" element={<ChildSafety />} />
          <Route path="/traffic-safety/fatigue-management" element={<FatigueManagement />} />
          <Route path="/traffic-safety/signal-timing" element={<TrafficSignalTiming />} />
          <Route path="/traffic-safety/weather-tips" element={<WeatherDrivingTips />} />
          <Route path="/traffic-safety/air-quality" element={<AirQualityMonitor />} />
          <Route path="/traffic-safety/beacon-locator" element={<EmergencyBeacon />} />
          <Route path="/traffic-safety/health-check" element={<DriverHealthCheck />} />
          <Route path="/traffic-safety/regulations" element={<SafetyRegulations />} />
          <Route path="/traffic-safety/safety-pledge" element={<SafetyPledge />} />

          {/* Vehicle Calculator routes */}
          <Route path="/vehicle/calculators/gst" element={<GstCalculator />} />
          <Route path="/vehicle/calculators/loan" element={<LoanCalculator />} />
          <Route path="/vehicle/calculators/mileage" element={<MileageCalculator />} />
          <Route path="/vehicle/calculators/age" element={<VehicleAgeCalculator />} />

          {/* Admin routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-driver-details" element={<AdminDriverDetails />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/content" element={<EditContent />} />
          <Route path="/admin/features" element={<UpdateFeatures />} />
          <Route path="/admin/news" element={<BreakingNews />} />
          <Route path="/admin/alerts" element={<AlertManagement />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
    </AuthProvider>
  );
}

export default App;
