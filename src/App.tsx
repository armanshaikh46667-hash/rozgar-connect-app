import { useState, useCallback, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import TopHeader from "./components/TopHeader";
import SplashScreen from "./components/SplashScreen";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import RegisterPage from "./pages/RegisterPage";
import MapPage from "./pages/MapPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import LocalBusinessPage from "./pages/LocalBusinessPage";
import BusinessRegistrationPage from "./pages/BusinessRegistrationPage";
import ShopRegistrationPage from "./pages/ShopRegistrationPage";
import DigitalServiceRegistrationPage from "./pages/DigitalServiceRegistrationPage";
import CoachingRegistrationPage from "./pages/CoachingRegistrationPage";
import ConstructionRegistrationPage from "./pages/ConstructionRegistrationPage";
import AgricultureRegistrationPage from "./pages/AgricultureRegistrationPage";
import VehicleRegistrationPage from "./pages/VehicleRegistrationPage";
import HomeServiceRegistrationPage from "./pages/HomeServiceRegistrationPage";
import EarningsPage from "./pages/EarningsPage";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import WorkerProfilePage from "./pages/WorkerProfilePage";
import NotFound from "./pages/NotFound";
import UpdatesPage from "./pages/UpdatesPage";
import LoginPage from "./pages/LoginPage";
import { useWorkerStore } from "./store/workerStore";
import LanguageToggle from "./components/LanguageToggle";
import AIChatbot from "./components/AIChatbot";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-fade-in">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/bookings" element={<BookingHistoryPage />} />
        <Route path="/businesses" element={<LocalBusinessPage />} />
        <Route path="/business-register" element={<BusinessRegistrationPage />} />
        <Route path="/register-shop" element={<ShopRegistrationPage />} />
        <Route path="/register-digital" element={<DigitalServiceRegistrationPage />} />
        <Route path="/register-coaching" element={<CoachingRegistrationPage />} />
        <Route path="/register-construction" element={<ConstructionRegistrationPage />} />
        <Route path="/register-agriculture" element={<AgricultureRegistrationPage />} />
        <Route path="/register-vehicle" element={<VehicleRegistrationPage />} />
        <Route path="/register-home-service" element={<HomeServiceRegistrationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/earnings" element={<EarningsPage />} />
        <Route path="/worker/:id" element={<WorkerProfilePage />} />
        <Route path="/updates" element={<UpdatesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const AppInit = () => {
  const fetchWorkers = useWorkerStore((s) => s.fetchWorkers);
  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);
  return null;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppInit />
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <BrowserRouter>
          <TopHeader />
          <AnimatedRoutes />
          <LanguageToggle />
          <AIChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
