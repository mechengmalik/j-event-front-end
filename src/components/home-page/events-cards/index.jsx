import React from "react";
import homeBage from "../../../assets/icons/home-page-banner.svg";
import timeIcon from "../../../assets/icons/time.svg";
import calenderIcon from "../../../assets/icons/b-calender.svg";
import ryalIcon from "../../../assets/icons/ryal.svg";

const EventsGrid = ({ events }) => {
  // If no events are provided, use placeholder data
  const eventData = events || [
    {
      id: 1,
      title: "KSA vestival caravan",
      image: "/event-image-1.jpg",
      time: "8:00 pm",
      date: "22/02/2023",
      location: "Jadda",
      price: 9.99,
    },
    {
      id: 2,
      title: "KSA vestival caravan",
      image: "/event-image-2.jpg",
      time: "8:00 pm",
      date: "22/02/2023",
      location: "Jadda",
      price: 9.99,
    },
    {
      id: 3,
      title: "KSA vestival caravan",
      image: "/event-image-3.jpg",
      time: "8:00 pm",
      date: "22/02/2023",
      location: "Jadda",
      price: 9.99,
    },
    {
      id: 4,
      title: "KSA vestival caravan",
      image: "/event-image-4.jpg",
      time: "8:00 pm",
      date: "22/02/2023",
      location: "Jadda",
      price: 9.99,
    },
    {
      id: 5,
      title: "KSA vestival caravan",
      image: "/event-image-5.jpg",
      time: "8:00 pm",
      date: "22/02/2023",
      location: "Jadda",
      price: 9.99,
    },
    {
      id: 6,
      title: "KSA vestival caravan",
      image: "/event-image-6.jpg",
      time: "8:00 pm",
      date: "22/02/2023",
      location: "Jadda",
      price: 9.99,
    },
  ];

  const EventCard = ({ event }) => {
    return (
      <div className="max-w-[270px] p-4 w-full bg-white rounded-lg overflow-hidden shadow-md border border-black/10 justify-between flex flex-col">
        <div className="h-40 overflow-hidden">
          <img
            src={homeBage}
            alt={event.title}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className=" flex-1 flex flex-col bg-white justify-between">
          <h3 className="text-lg font-bold text-left pt-4">{event.title}</h3>
          <div className="flex flex-col justify-between py-4 gap-2">
            <div className="flex justify-start font-normal items-center gap-2 ">
              <span className="text-base">
                Start from : {""}
                {event.price}
              </span>
              <img src={ryalIcon} alt="" />
            </div>
            <div className="flex justify-start items-center gap-2">
              <img src={calenderIcon} alt="" />
              <span className="text-base font-normal">{event.date}</span>
            </div>
            <div className="flex justify-start items-center gap-2">
              <img src={timeIcon} alt="" />
              <span className="text-base font-normal">{event.time}</span>
            </div>
          </div>
        </div>
        {/* <div  className="px-8  py-4 text-[#8354A3] border border-[#8354A3] px-4 py-2 rounded-md text-center text-base font-medium"> */}

        <button  className="px-8  py-4 text-[#8354A3] border border-[#8354A3] px-4 py-2 rounded-md text-center text-base font-medium">
          See Details
        </button>
        </div>
      // </div>
    );
  };

  return (
    <div className="event-card-container">
      <div className="flex flex-wrap gap-6">
        {eventData.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsGrid;
