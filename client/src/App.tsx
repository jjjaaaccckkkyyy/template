import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MotionConfig, AnimatePresence, motion } from "motion/react";
import { DashboardLayout, ProtectedRoute, VerificationBanner } from "./components/layout";
import { LoginPage, OAuthCallback, VerifyEmailPage, ForgotPasswordPage, ResetPasswordPage } from "./pages/auth";
import { SessionsPage } from "./pages/settings";
import { useAuth } from "./lib/hooks";

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" as const } },
};

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit">
      {children}
    </motion.div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-8">
      <VerificationBanner />
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight text-[#e0e0e0] text-balance">Dashboard</h1>
        <p className="mt-1 font-mono text-[10px] text-[rgba(255,255,255,0.35)] uppercase tracking-[0.28em]">Your application starts here</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {["Feature One", "Feature Two", "Feature Three"].map((label) => (
          <div key={label} className="rounded-sm border border-[rgba(255,255,255,0.07)] bg-[#0e0e0e] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[rgba(255,255,255,0.35)]">{label}</p>
            <p className="mt-2 font-mono text-sm text-[rgba(255,255,255,0.5)]">Add your content here.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/settings/sessions" element={
          <ProtectedRoute><DashboardLayout><PageTransition><SessionsPage /></PageTransition></DashboardLayout></ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function LoginRedirect() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
  if (isAuthenticated) return <Navigate to={from} replace />;
  return <LoginPage />;
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </MotionConfig>
  );
}
