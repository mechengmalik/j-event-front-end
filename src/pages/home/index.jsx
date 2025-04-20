import React from "react";
import banner from "../../assets/icons/home-page-banner.svg"
import Navbar from "../../components/navbar/index";
import HomePageSlider from "../../components/home-page/home-page-slider";
import LocationEvents from "../../components/home-page/user-location-event-slider";
import Footer from "../../components/home-page/footer";
import CircleCards from "../../components/home-page/circle-cards";
import EventsCards from "../../components/home-page/events-cards";
import HomeBanner from "../../components/home-page/home-banner";
import "./home.css";

function Home() {
  return (
    <div className="home-container relative flex flex-col justify-center">
      <div className="home-navbar bg-transparent w-full h-[800px] bg-cover bg-top " style={{ backgroundImage: `url(${banner})` }}>
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

      <div className="h-[6rem]"></div>

      <EventsCards />
      <Footer />
    </div>
  );
}

export default Home;
