import React from "react";
import { useNavigate } from "react-router-dom";
import "./create-ticket.css";
import backArrow from "../../../../assets/icons/back-arrow.svg";
import Breadcrumbs from "../../../../components/breadcrumbs";
import CreateTicketForm from "../../../../components/create-ticket-form";

function CreateTicket() {
  const navigate = useNavigate();
    
  return (
      <div className="flex flex-col overflow-y-hidden justify-start px-6 sm:px-16 lg:px-12 ">
        <div className="flex flex-col justify-between">
          <div className="flex text-3xl font-bold justify-start items-center gap-4 pl-5">
            <button onClick={() => navigate(-1)}>
              <img src={backArrow} alt="Back" />
            </button>
            Create Ticket
          </div>

          {/* Breadcrumb */}
          <div className="text-base flex items-center gap-2 pt-4 pb-8">
          <Breadcrumbs/>
          </div>
          <hr className="flex-grow border-t border-black/10 pb-8" />

        </div>

        <CreateTicketForm />
      </div>
  );
}

export default CreateTicket;
