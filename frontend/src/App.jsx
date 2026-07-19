/**
 * StadiumPilot AI — App Root Component
 */

import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import ErrorBoundary from "./components/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";
import { ThemeProvider } from "./context/ThemeContext";
import { HelmetProvider } from "react-helmet-async";
import SkeletonLoader from "./components/SkeletonLoader"; // I will create this

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Assistant = lazy(() => import("./pages/Assistant"));
const Operations = lazy(() => import("./pages/Operations"));
const Transport = lazy(() => import("./pages/Transport"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <ChatProvider>
            <Router>
              <Suspense fallback={<SkeletonLoader />}>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/chat" element={<Assistant />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/assistant" element={<Assistant />} />
                    <Route path="/operations" element={<Operations />} />
                    <Route path="/transport" element={<Transport />} />
                    <Route path="/accessibility" element={<Accessibility />} />

                    {/* New routes mapped to existing components for demo purposes */}
                    <Route path="/crowd-management" element={<Dashboard />} />
                    <Route path="/sustainability" element={<Dashboard />} />
                    <Route path="/multilingual" element={<Assistant />} />
                    <Route path="/decision-support" element={<Operations />} />

                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </ChatProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
