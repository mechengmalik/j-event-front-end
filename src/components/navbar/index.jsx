import React, { useState } from "react";
import { Link } from "react-router-dom";
import language from "../../assets/icons/language.svg";
import whiteLanguage from "../../assets/icons/language-white.svg";
import notification from "../../assets/icons/notification.svg";
import whiteLogo from "../../assets/icons/navbar-logo.svg";
import logo from "../../assets/icons/Logo.svg";

import plus from "../../assets/icons/plus-icon.svg";

function Navbar({ homePage, gradient }) {
  const [showLanguages, setShowLanguages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [lang, setLang] = useState("en");

  const toggleLanguages = () => setShowLanguages(!showLanguages);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  return (
    <nav className="w-full bg-transparent">
      {homePage ? (
        <>
          {/* Top Navbar */}
          <div className="flex justify-between items-center px-6 md:px-20 lg:px-36 py-4 relative ">
            <div
              className={`absolute top-0 left-0 w-full h-full z-0 pointer-events-none ${
                gradient
                  ? "bg-gradient-to-b from-black via-black/70 to-transparent"
                  : "bg-transparent"
              }`}
            ></div>
            {/* Left side: Logo + Desktop Menu */}
            <div className="flex items-center gap-12 z-10">
              {gradient? <img src={whiteLogo } alt="logo" className="mt-3" />: <img src={logo } alt="logo" className="mt-3" /> }

              <div className={`hidden md:flex font-normal gap-8 items-center ${gradient? "text-white":"text-balck" }`}>
                <Link to="/">Home</Link>
                <Link to="/dashboard/events">Events</Link>
                <Link to="/about">About Jevent</Link>
                <div className="p-[1px] bg-gradient-to-l from-[#8354A3] to-[#00C2D1]">
                  <Link
                    className={`flex gap-2 items-center py-4 px-4 ${gradient? "bg-black text-white":"bg-white text-black"}`}
                    to="/dashboard/create-event"
                  >
                    <img className={`${!gradient && "invert"}`} src={plus} alt="plus" /> Create Event
                  </Link>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-6 text-white z-10">
              <div className="flex gap-1 text-xs items-center">
                <img src={whiteLanguage} />
                <select
                  className="bg-transparent text-white outline-none"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="en" className="text-black">
                    English
                  </option>
                  <option value="ar" className="text-black">
                    Arabic
                  </option>
                </select>
              </div>
              <div className="bg-[#8354A3] py-4 px-8 font-bold rounded-lg">
                <Link to="/sign-in">Sign in</Link>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white text-3xl"
              >
                ☰
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {showMobileMenu && (
            <div className="md:hidden flex flex-col gap-4 items-center bg-black text-white py-6">
              <Link to="/">Home</Link>
              <Link to="/dashboard/events">Events</Link>
              <Link to="/about">About Jevent</Link>
              <Link
                to="/dashboard/create-event"
                className="bg-gradient-to-l from-[#8354A3] to-[#00C2D1] px-4 py-2 rounded"
              >
                Create Event
              </Link>
              <Link to="/sign-in">Sign In</Link>
            </div>
          )}
        </>
      ) : (
        // Other pages navbar
        <div className="flex justify-end items-center px-4 pb-8 gap-4">
          {/* Language */}
          <div className="relative">
            <button
              onClick={toggleLanguages}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <img src={language} />
            </button>
            {showLanguages && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                <ul className="text-sm">
                  <li className="py-2 px-4 hover:bg-gray-100">English</li>
                  <li className="py-2 px-4 hover:bg-gray-100">Arabic</li>
                </ul>
              </div>
            )}
          </div>

          {/* Notification */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <img src={notification} />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
                <ul className="p-1 text-sm">
                  <li className="py-1 hover:bg-gray-100 px-2">
                    New user joined
                  </li>
                  <li className="py-1 hover:bg-gray-100 px-2">Event created</li>
                  <li className="py-1 hover:bg-gray-100 px-2">Server update</li>
                </ul>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative pt-1">
            <button
              onClick={toggleProfileMenu}
              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full"
            ></button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50 text-sm">
                <ul>
                  <li className="py-2 px-4 hover:bg-gray-100">Profile</li>
                  <li className="py-2 px-4 hover:bg-gray-100">Settings</li>
                  <li className="py-2 px-4 hover:bg-gray-100">Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
