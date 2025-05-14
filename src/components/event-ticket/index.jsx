import React from "react";
import { useNavigate } from "react-router-dom";
import TicketCard from "./ticket-card";

const tickets = [
  {
    id: 1,
    name: "vip ticket",
    seats: 120,
    availableSeat: 5,
    price: 19.99,
    currency: "$",
    benefits:["popcorn","soft drink","souvenir"]

  },
  {
    id: 2,
    name: "normal ticket",
    seats: 80,
    availableSeat: 5,
    price: 9.99,
    currency: "$",
    benefits:[]


  },
  {
    id: 3,
    name: "class a ticket",
    seats: 60,
    availableSeat: 0,
    price: 14.99,
    currency: "$",
    benefits:["popcorn"]
  },
   {
    id: 4,
    name: "normal ticket",
    seats: 80,
    availableSeat: 5,
    price: 9.99,
    currency: "$",
    benefits:[]


  },
];

function TicketList() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tickets.map((ticket) => (
        <TicketCard
          ticket={ticket}
          onManage={(id) => navigate(`/dashboard/events/${id}/tickets/edit`)}
          onDelete={(id) => console.log("Deleting", id)}
        />
      ))}
    </div>
  );
}

export default TicketList;
