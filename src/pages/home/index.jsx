import React from "react";
import Navbar from "../../components/navbar/index";
import "./home.css";
import HomePageSlider from "../../components/home-page/home-page-slider";
import LocationEvents from "../../components/home-page/user-location-event-slider";
import Footer from "../../components/home-page/footer";
import CircleCards from "../../components/home-page/circle-cards";
import EventsCards from "../../components/home-page/events-cards";
import HomeBanner from "../../components/home-page/home-banner";

function Home() {
  return (
    <div className="home-container relative flex flex-col justify-center">
      <div className="home-navbar bg-transparent w-full h-[800px] bg-cover bg-top bg-[url('src/assets/icons/home-page-banner.svg')]">
        <Navbar homePage={true} />
        <HomeBanner />
      </div>

      <div className="h-[41rem]"></div>

      <div className="home-page-slider absolute top-[710px] md:top-[708px] lg:top-[710px] xl:top-[710px] 2xl:top-[710px] h-[600px] md:h-[650px] lg:h-[700px] xl:h-[700px] 2xl:h-[700px] left-0 w-full px-6 sm:px-12 md:px-24 lg:px-36 z-10">
        <HomePageSlider />
      </div>

      <div className="event-slider w-full px-4 sm:px-10 md:px-16 lg:px-28 xl:px-44 h-auto min-h-[872px] mt-[6rem]">
        <LocationEvents />
      </div>

      <div className="h-[6rem] sm:h-[10rem] md:h-[13rem]"></div>

      <CircleCards />

      <div className="h-[6rem] sm:h-[10rem] md:h-[13rem]"></div>

      <EventsCards />

      <div className="h-[5rem] sm:h-[6rem] md:h-[8rem]"></div>

      <Footer />
    </div>
  );
}

export default Home;
