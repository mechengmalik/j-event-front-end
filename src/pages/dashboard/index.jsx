import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom"; 
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import menuIcon from "../../assets/icons/menu-icon.svg";
import "./dashboard.css";

function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const sidebarRef = useRef(null);
const location = useLocation(); // ⬅️ hook to get the current route


const hideSidebarRoutes = ["/dashboard/events/seating-map"]; // ⬅️ customize these
const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1000;
      setIsMobile(mobile);
      setShowSidebar(!mobile); // Always show on desktop
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide sidebar on outside click for mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isMobile &&
        showSidebar
      ) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, showSidebar]);

  return (
    <>
      <div className="dashboard-wrapper flex w-full h-full py-2 relative">
        {!shouldHideSidebar && isMobile && !showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute w-8 top-5 left-5 z-50 bg-purple-600 text-white p-2 rounded-md shadow-md"
          >
            <img src={menuIcon} alt="" className="parallel-line-icon" />
          </button>
        )}

        {!shouldHideSidebar && (showSidebar || !isMobile) && (
          <div
            ref={sidebarRef}
            className={`sidbar-wrapper ${
              isMobile
                ? "fixed top-0 left-0 w-2/3 sm:w-1/3 md:w-1/4 z-40"
                : "relative w-1/4 max-w-[250px] min-w-[200px]"
            } bg-white shadow-md transition-transform duration-300`}
          >
            <Sidebar
              isMobile={isMobile}
              showSidebar={showSidebar}
              onClose={() => setShowSidebar(false)}
            />
          </div>
        )}

        <div className="dashboard-main-content flex-1 p-1 overflow-y-auto">
          <Navbar />
          <Outlet /> {/* This is where Events, CreateEvent etc will render */}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
