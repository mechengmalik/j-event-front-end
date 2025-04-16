import { Link, useLocation } from "react-router-dom";
import React from "react";
import Logo from "../../assets/icons/Logo.svg";
import OverviewdIcon from "../../assets/icons/overview.svg";
import settingsIcon from "../../assets/icons/settings.svg";
import eventsIcon from "../../assets/icons/events-dashboard.svg";
import "./sidebar.css";

const sideMenuContent = [
  {
    id: 1,
    name: "Overview",
    icon: OverviewdIcon,
    link: "/sign-up",
  },
  {
    id: 2,
    name: "Events",
    icon: eventsIcon,
    link: "/events",
  },
  {
    id: 3,
    name: "Settings",
    icon: settingsIcon,
    link: "/settings",
  },
];

function Sidebar({onClose}) {
  const location = useLocation();

  return (
    <div className="sidebar-container ">
      <div className="flex items-center justify-between items-start px-4 py-3">
        <img className="logo w-26 " src={Logo} />
        {window.innerWidth < 1000 && (
      <button
        onClick={onClose}
        className="text-purple-600 hover:text-purple-800 font-bold text-xl"
      >
        X
      </button>
    )}
      </div>
      <div className="dashboard-menu p-6">
        <h3 className="dashboad-text text-left pb-1 font-bold text-regal-black text-xs">
          DASHBOARD
        </h3>

      <nav className="sidebar-nav flex flex-col w-full">
        <ul>
          {sideMenuContent.map((item) => {
            const isActive = location.pathname === item.link;

            return (
              <Link
                key={item.id}
                to={item.link}
                className={`side-menu-link flex gap-4 px-2 py-3 transition-colors duration-200 ${
                  isActive
                    ? "bg-regal-purple text-white"
                    : "text-regal-black hover:bg-black/10"
                }`}
              >
                <img
                  className={`sidebar-icon w-1/11 ${
                    isActive ? "filter-white" : ""
                  }`}
                  src={item.icon}
                />{" "}
                <div className="menu-name text-sm">{item.name}</div>
              </Link>
            );
          })}
        </ul>
      </nav>

      </div>

    </div>
  );
}

export default Sidebar;
