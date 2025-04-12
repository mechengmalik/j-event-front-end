import { Routes, Route, Outlet, Link } from "react-router-dom";
import React from "react";
import Home from "../../pages/home/index";
import About from "../../pages/about/index";
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

function Sidebar() {
  return (
    <div className="sidebar-container pt-5">
      <div className="sidebar mb-7">
        <img src={Logo} />
      </div>
      <div>
        <h3 className="dashboad-text text-left pl-3 pt-7 font-bold text-regal-black text-xs">
          DASHBORED
        </h3>
      </div>
      <nav className="sidebar-nav flex flex-col w-full">
        <ul>
          {sideMenuContent.map((item) => (
            <>
              <Link
                key={item.id}
                to={item.link}
                className=" side-menu-link flex gap-4 m-2 ml-5 p-2 pl-3 hover:bg-gray-200 text-regal-black "
              >
                <img className="sidebar-icon w-1/11" src={item.icon} />
                <div className="menu-name text-sm">{item.name}</div>
              </Link>
            </>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
