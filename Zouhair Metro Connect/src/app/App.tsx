import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { HomeScreen, type SearchData } from "./components/HomeScreen";
import {
  ResultsScreen,
  type TripOption,
} from "./components/ResultsScreen";
import { PaymentScreen } from "./components/PaymentScreen";
import { AdminDashboard } from "./components/AdminDashboard";
import { TravelersManagement } from "./components/TravelersManagement";
import { TripsManagement } from "./components/TripsManagement";

type AppScreen =
  | "login"
  | "home"
  | "results"
  | "payment"
  | "admin-dashboard"
  | "admin-travelers"
  | "admin-trips";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("login");
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<TripOption | null>(null);

  const handleLogin = () => {
    setCurrentScreen("home");
  };

  const handleAdminLogin = () => {
    setCurrentScreen("admin-dashboard");
  };

  const handleSearch = (data: SearchData) => {
    setSearchData(data);
    setCurrentScreen("results");
  };

  const handleSelectTrip = (trip: TripOption) => {
    setSelectedTrip(trip);
    setCurrentScreen("payment");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setSearchData(null);
    setSelectedTrip(null);
  };

  const handleBackToResults = () => {
    setCurrentScreen("results");
    setSelectedTrip(null);
  };

  const handleAdminNavigate = (section: "travelers" | "trips") => {
    if (section === "travelers") {
      setCurrentScreen("admin-travelers");
    } else {
      setCurrentScreen("admin-trips");
    }
  };

  const handleBackToAdminDashboard = () => {
    setCurrentScreen("admin-dashboard");
  };

  const handleAdminLogout = () => {
    setCurrentScreen("login");
  };

  return (
    <div className="size-full">
      {currentScreen === "login" && (
        <LoginScreen onLogin={handleLogin} onAdminLogin={handleAdminLogin} />
      )}

      {currentScreen === "home" && <HomeScreen onSearch={handleSearch} />}

      {currentScreen === "results" && searchData && (
        <ResultsScreen
          searchData={searchData}
          onBack={handleBackToHome}
          onSelectTrip={handleSelectTrip}
        />
      )}

      {currentScreen === "payment" && searchData && selectedTrip && (
        <PaymentScreen
          searchData={searchData}
          selectedTrip={selectedTrip}
          onBack={handleBackToResults}
        />
      )}

      {currentScreen === "admin-dashboard" && (
        <AdminDashboard
          onNavigate={handleAdminNavigate}
          onLogout={handleAdminLogout}
        />
      )}

      {currentScreen === "admin-travelers" && (
        <TravelersManagement onBack={handleBackToAdminDashboard} />
      )}

      {currentScreen === "admin-trips" && (
        <TripsManagement onBack={handleBackToAdminDashboard} />
      )}
    </div>
  );
}