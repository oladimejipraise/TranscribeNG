import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import LandingPage    from "../components/home/LandingPage";
import Login          from "../components/auth/Login";
import Signup         from "../components/auth/Signup";
import ForgotPassword from "../components/auth/ForgotPassword";
import Dashboard      from "../components/dashboard/Dashboard";
import MyTranscripts  from "../components/dashboard/MyTranscripts";
import Exports        from "../components/dashboard/Exports";
import TeamWorkspace  from "../components/dashboard/TeamWorkspace";
import Settings       from "../components/dashboard/Settings";
import LiveRecording  from "../components/transcription/LiveRecording";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="flex items-center gap-3 text-cream/40 text-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Loading...
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login"           element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup"          element={<GuestRoute><Signup /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

      <Route path="/dashboard"               element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/transcripts"   element={<ProtectedRoute><MyTranscripts /></ProtectedRoute>} />
      <Route path="/dashboard/record"        element={<ProtectedRoute><LiveRecording /></ProtectedRoute>} />
      <Route path="/dashboard/team"          element={<ProtectedRoute><TeamWorkspace /></ProtectedRoute>} />
      <Route path="/dashboard/exports"       element={<ProtectedRoute><Exports /></ProtectedRoute>} />
      <Route path="/dashboard/settings"      element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}