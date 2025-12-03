import "./App.css";
import Home from "./Home";
import React from "react";
import { UserProvider } from "./contexts/UserContext";
import Results from "./components/Results";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProviderDetails from "./components/ProviderDetails";
import Register from "./components/Register";
import TermsOfUse from "./components/TermsOfUse";
import Login from "./components/Login";
import PrestataireDashboard from "./components/PrestataireDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import PrestatairesList from "./components/PrestatairesList";
import Apropos from "./components/Apropos";
import MentionsLegales from "./components/MentionsLegales";
import Contact from "./components/Contact";
import ClientProfile from "./components/ClientProfile";
import Gallery from "./Gallery";
import Team from "./Team";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

function AppRoutes() {
  const { user } = useContext(UserContext) || {};
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/provider/:id" element={<ProviderDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/apropos" element={<Apropos />} />
          {/* Dashboard prestataire */}
          {user && user.role === "prestataire" && (
            <Route path="/dashboard" element={<PrestataireDashboard />} />
          )}
          {/* Dashboard admin */}
          {user && user.role === "admin" && (
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          )}
          <Route path="/prestataires" element={<PrestatairesList />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          {/* Profil client */}
          {user && user.role === "client" && (
            <Route path="/client-profile" element={<ClientProfile />} />
          )}
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/team" element={<Team />} />
           <Route path="/terms" element={<TermsOfUse />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
