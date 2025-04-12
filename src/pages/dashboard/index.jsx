import { Routes, Route, Outlet, Link } from "react-router-dom";
import React from "react";
import "./dashboard.css";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";


function Dashboard({ children }) {
    return (
      <div className="dashboard-wrapper flex w-full h-screen">
        <div className="sidbar-wrapper w-1/6 pl-4 h-full bg-white shadow-md">
          <Sidebar />
        </div>
        <div className="dashboard-main-content flex-1 p-1 overflow-y-auto">
          <Navbar />
          {children}
        </div>
      </div>
    );
  }
export default Dashboard;
