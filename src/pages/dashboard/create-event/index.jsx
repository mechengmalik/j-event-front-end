import React from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Dashboard from "..";
import "./create-event.css";
import CreateEventForm from "../../../components/form";
import backArrow from "../../../assets/icons/back-arrow.svg";
import navArrow from "../../../assets/icons/navigation-indecator.svg";

function CreateEvent() {
  const navigate = useNavigate();

  const handleFormSubmit = (data) => {
    console.log("Final form data:", data);
    localStorage.setItem("eventFormData", JSON.stringify(data));
  };
  
  

  return (
    <Dashboard>
      <div className="flex flex-col overflow-y-hidden justify-start px-6 sm:px-16 lg:px-12 ">
        <div className="flex flex-col justify-between">
          <div className="flex text-3xl font-bold justify-start items-center gap-4 p-4 pl-5">
            <button onClick={() => navigate(-1)}>
              <img src={backArrow} alt="Back" />
            </button>
            Create Event
          </div>

          {/* Breadcrumb */}
          <div className="text-base flex items-center gap-2 pt-4 pb-8">
            <span className="text-[#333333] hover:text-black cursor-pointer" onClick={() => navigate("/dashboard")}>
              Dashboard
            </span>
            <span className="text-[#8354A3] font-light"><img src={navArrow} alt="nav arrow" /></span>
            <span className="text-[#717171] font-light">Create Event</span>
          </div>
          <hr className="flex-grow border-t border-black/10 pb-8" />

        </div>

        <CreateEventForm onSubmit={handleFormSubmit} />
      </div>
    </Dashboard>
  );
}

export default CreateEvent;
