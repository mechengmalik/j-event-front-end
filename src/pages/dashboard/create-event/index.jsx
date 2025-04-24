import React from "react";
import { useNavigate } from "react-router-dom";
import "./create-event.css";
import CreateEventForm from "../../../components/form";
import backArrow from "../../../assets/icons/back-arrow.svg";
import Breadcrumbs from "../../../components/breadcrumbs";

function CreateEvent() {
  const navigate = useNavigate();


  const handleFormSubmit = async (data) => {
    try {
      // Later: Send `data` to your backend here using fetch or axios
      console.log("Final form data:", data);
      localStorage.setItem("eventFormData", JSON.stringify(data));
  
      // Navigate to events list
      // navigate(`/dashboard/events/${data}`);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };
  // const handleFormSubmit = async (data) => {
  //   try {
  //     // Send data to your backend
  //     const response = await fetch("/api/events", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error("Failed to create event");
  //     }
  
  //     const createdEvent = await response.json();
  
  //     // Example: response = { id: 123, ...otherEventData }
  //     const eventId = createdEvent.id;
  
  //     if (eventId) {
  //       navigate(`/dashboard/events/${eventId}`);
  //     } else {
  //       console.warn("No event ID returned from the backend.");
  //     }
  //   } catch (error) {
  //     console.error("Failed to create event:", error);
  //   }
  // };
  
  

  return (
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
          <Breadcrumbs/>
          </div>
          <hr className="flex-grow border-t border-black/10 pb-8" />

        </div>

        <CreateEventForm onSubmit={handleFormSubmit} />
      </div>
  );
}

export default CreateEvent;
