import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./event-ticket.css";
import backArrow from "../../../assets/icons/back-arrow.svg";
import Breadcrumbs from "../../../components/breadcrumbs";
import TicketList from "../../../components/event-ticket";
import plusIcon from "../../../assets/icons/plus-icon.svg";

function EventTickets() {
  const navigate = useNavigate();
  const { eventId } = useParams();

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
        <div className="tickets-heading w-full flex justify-between items-center ">
          <div className="flex text-3xl font-bold justify-start items-center gap-4 pl-5">
            <button onClick={() => navigate(-1)}>
              <img src={backArrow} alt="Back" />
            </button>
            Tickets
          </div>
          <div className="create-tickets-wrapper">
            <button className="create-tickets-btn flex gap-2 bg-regal-purple hover:bg-purple-500 text-white py-4 px-8">
              <img src={plusIcon} alt="plus icon" />
              <Link to={`/dashboard/events/${eventId}/tickets/create`}>
                Create
              </Link>
            </button>
          </div>
        </div>

        <div className="text-base flex items-center gap-2 pt-4 pb-4">
          <Breadcrumbs />
        </div>
        <hr className="flex-grow border-t border-black/10 pb-8" />
      </div>

      <TicketList />
    </div>
  );
}

export default EventTickets;
