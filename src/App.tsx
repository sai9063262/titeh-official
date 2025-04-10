
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
import LicenseProcedure from "./pages/rto-exam/LicenseProcedure";
import PracticeExam from "./pages/rto-exam/PracticeExam";
import QuestionBank from "./pages/rto-exam/QuestionBank";
import LicenseProcedureEnhanced from "./pages/rto-exam/LicenseProcedureEnhanced";
import RtoOffices from "./pages/rto-exam/RtoOffices";
import DrivingLaws from "./pages/rto-exam/DrivingLaws";
import Documents from "./pages/rto-exam/Documents";
import PayChallan from "./pages/traffic-safety/PayChallan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
          
          {/* Settings sub-pages */}
          <Route path="/settings/language" element={<Language />} />
          <Route path="/settings/payment" element={<PaymentMethods />} />
          
          {/* RTO Exam sub-pages */}
          <Route path="/rto-exam/license-procedure" element={<LicenseProcedureEnhanced />} />
          <Route path="/rto-exam/practice" element={<PracticeExam />} />
          <Route path="/rto-exam/questions" element={<QuestionBank />} />
          <Route path="/rto-exam/offices" element={<RtoOffices />} />
          <Route path="/rto-exam/documents" element={<Documents />} />
          <Route path="/rto-exam/laws" element={<DrivingLaws />} />
          
          {/* Traffic Safety sub-pages */}
          <Route path="/traffic-safety/pay-challan" element={<PayChallan />} />
          
          {/* 404 page for undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
