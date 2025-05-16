import React, { useState } from "react";
import search from "../../../assets/icons/search-frame.svg";
import { useNavigate } from "react-router-dom";

function HomeBanner() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/events"); // Optional: still navigate even if search is empty
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="home-page-banner w-full flex items-center justify-center text-center">
      <div className="text-white max-w-3xl">
        {/* Heading */}
        <div className="py-16">
          <h2 className="text-3xl pt-5 md:text-4xl lg:text-[4rem] font-normal leading-snug">
            Discover Events
          </h2>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold mt-2 mb-6">
            Live The Moment
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center items-center bg-white text-right rounded-full shadow-lg overflow-hidden lg:w-[47.5rem] md:w-[30rem]">
          <button className="search-btn" onClick={handleSearch}>
            <img src={search} alt="search" className="px-2 py-2" />
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Discover events tailored to your interests ..."
            className="w-full px-1 py-4 focus:outline-none text-[#8354A3] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;
