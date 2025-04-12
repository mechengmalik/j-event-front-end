import React, { useState } from "react";
import language from "../../assets/icons/language.svg";
import notification from "../../assets/icons/notification.svg";
// import eventsIcon from "../../assets/icons/events-dashboard.svg";
function Navbar() {

  const [showLanguages, setShowLanguages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleLanguages = () => setShowLanguages(!showLanguages);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  return (
    <div className="w-full flex justify-end items-center px-4 py-1 bg-white gap-5">
      <div className="relative">
        <button
          onClick={toggleLanguages}
          className="relative p-1 hover:bg-gray-100 rounded-full"
        >
          <img src={language} />
          {/* <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span> */}
        </button>

        {showLanguages && (
          <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
            <ul className="p-1 text-sm">
              <li className="py-1 hover:bg-gray-100 px-2">English</li>
              <li className="py-1 hover:bg-gray-100 px-2">Arabic</li>
            </ul>
          </div>
        )}
      </div>

      {/* Notification */}
      <div className="relative">
        <button
          onClick={toggleNotifications}
          className="relative p-1 hover:bg-gray-100 rounded-full"
        >
          <img src={notification} />
          {/* <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span> */}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
            <ul className="p-1 text-sm">
              <li className="py-1 hover:bg-gray-100 px-2">New user joined</li>
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
          className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <img src="" />
        </button>

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
  );
}

export default Navbar;
