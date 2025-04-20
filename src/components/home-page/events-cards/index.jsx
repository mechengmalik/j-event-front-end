import React from "react";
import decoration from "../../../assets/icons/decoration.svg";
import homePage from "../../../assets/icons/home-page-banner.svg"; // Replace with real image source
import dateIcon from "../../../assets/icons/date.svg"; // Replace with real icon

const eventsData = [
  { id: 1, title: "Art Festival 2025", date: "March 27", image: homePage },
  { id: 2, title: "Tech Conference Amman", date: "April 10", image: homePage },
  { id: 3, title: "Music Night", date: "April 15", image: homePage },
  { id: 4, title: "Food Carnival", date: "May 2", image: homePage },
  { id: 5, title: "Startup Expo", date: "May 10", image: homePage },
  { id: 6, title: "Film Screening Night", date: "May 18", image: homePage },
  { id: 7, title: "Photography Meetup", date: "May 25", image: homePage },
  { id: 8, title: "Cultural Parade", date: "June 1", image: homePage },
];

function EventsCards() {
  return (
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-12">
      {/* Heading */}
      <div className="flex flex-col text-left gap-4 pb-10">
        <div>
          <img src={decoration} alt="decoration" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-black">
          Events in <span className="text-[#8354A3]">Amman</span>
        </h3>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {eventsData.map((event) => (
          <div
            key={event.id}
            className="bg-[#F8F8F8] border border-gray-200 shadow-sm rounded-md overflow-hidden flex flex-col transition hover:shadow-md"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 flex flex-col justify-between h-full">
              <h4 className="text-base font-semibold text-black mb-2 text-left line-clamp-2">
                {event.title}
              </h4>
              <div className="flex items-center text-sm text-gray-600 gap-2 mb-4">
                <img src={dateIcon} alt="calendar" className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              <button className="mt-auto border border-[#8354A3] text-[#8354A3] rounded-md py-2 text-sm font-semibold hover:bg-[#f9f1fc] transition">
                Show Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <div className="flex justify-center mt-10">
        <button className="text-[#8354A3] font-semibold hover:opacity-80 transition text-sm sm:text-base">
          Show More
        </button>
      </div>
    </div>
  );
}

export default EventsCards;
