import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy } from "react";
import { Toaster } from "react-hot-toast";
import {

  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import AdminLayout from "./layout/AdminLayout";
import { AdminRoutes } from "./routes";

import CoreLoginPage from "./components/Login/CoreLoginPage";


import { useState } from "react";
import VerifyAlumni from './components/VerifyAlumni/VerifyAlumni';

import FloatingReportButton from './components/UI/FloatingReportButton';
const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

const queryClient = new QueryClient();
const token = localStorage.getItem("token");

function App() {
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const openIssueModal = () => setIsIssueModalOpen(true);
  const closeIssueModal = () => setIsIssueModalOpen(false);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            

            <Route path="/" element={<CoreLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              {AdminRoutes.map(({ title, path, component: Component }) => (
                <Route key={title} path={path} element={<Component />} />
              ))}
            </Route>

            
            <Route path="/auth/alumni/verify/:token" element={<VerifyAlumni />} />
          </Routes>
          <Toaster />
        </Router>
      </QueryClientProvider>
      <FloatingReportButton />
      {/* <button
        onClick={openIssueModal}
        className="fixed bottom-4 left-4 z-50 w-40 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg"
      >
        Report an Issue
      </button>

      <IssueModal isOpen={isIssueModalOpen} onClose={closeIssueModal} /> */}
    </>
  );
}

export default App;