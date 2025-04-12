import React from "react";
import EventCard from "./event-card";

const events = [
  {
    image: "https://source.unsplash.com/featured/?concert",
    name: "Summer Beats Festival",
    date: "Apr 20",
    tables: 120,
    description: "Experience electrifying music by the beach with top DJs and local artists under the stars."
  },
  {
    image: "https://source.unsplash.com/featured/?conference",
    name: "Tech Innovators Summit",
    date: "May 5",
    tables: 80,
    description: "Join industry leaders and explore the future of AI, web3, and next-gen software."
  },
  {
    image: "https://source.unsplash.com/featured/?art,exhibition",
    name: "Modern Art Expo With Summer Beats Festival",
    date: "May 12",
    tables: 60,
    description: "A collection of contemporary artworks from rising talents across the region."
  },
  {
    image: "https://source.unsplash.com/featured/?food,festival",
    name: "Gourmet Bites Fair",
    date: "May 25",
    tables: 150,
    description: "Taste signature dishes from award-winning chefs and explore international cuisines."
  },
  {
    image: "https://source.unsplash.com/featured/?startup,event",
    name: "Startup Pitch Night",
    date: "Jun 1",
    tables: 30,
    description: "Watch promising startups pitch to investors and get inspired by breakthrough ideas."
  },
  {
    image: "https://source.unsplash.com/featured/?fashion,show",
    name: "Urban Fashion Walk",
    date: "Jun 10",
    tables: 90,
    description: "Catch the latest streetwear and designer trends live on the runway."
  },
  {
    image: "https://source.unsplash.com/featured/?gaming,event",
    name: "E-Sports Championship",
    date: "Jun 18",
    tables: 200,
    description: "Compete or watch thrilling matches of top-tier gamers battling it out."
  },
  {
    image: "https://source.unsplash.com/featured/?charity,ball",
    name: "Charity Gala Night",
    date: "Jun 30",
    tables: 75,
    description: "A glamorous evening supporting a great cause with music, auctions, and dinner."
  }
];


function EventList() {
  return (
    <div className="py-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  </div>

  );
}

export default EventList;
