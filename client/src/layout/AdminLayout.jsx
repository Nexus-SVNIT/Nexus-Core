import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";
import axios from "axios";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [isValidToken, setIsValidToken] = useState(null); // null = checking, true = valid, false = invalid

  // Expiry check
  if (
    localStorage.getItem("core-token-exp") &&
    localStorage.getItem("core-token-exp") < Date.now()
  ) {
    localStorage.removeItem("core-token");
    localStorage.removeItem("core-token-exp");
  }

  const token = localStorage.getItem("core-token");

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BACKEND_BASE_URL + "/auth/verify",
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        console.log("[AdminLayout] Verify response:", res.data);
        if (res.data.success) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
      } catch (error) {
        console.log("[AdminLayout] Verify error:", error);
        setIsValidToken(false);
      }
    };

    if (token) {
      verifyAdmin();
    } else {
      setIsValidToken(false);
    }
  }, [token]);

  if (isValidToken === null) {
    return <div className="text-center p-10">Checking authentication...</div>;
  }

  if (!isValidToken) {
  const currentPath = encodeURIComponent(location.pathname + location.search);
  // Only attach redirect if it’s NOT already the login page
  if (location.pathname !== "/") {
    return <Navigate to={`/?redirect_to=${currentPath}`} replace />;
  }
  return <Navigate to="/" replace />;
}


  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
