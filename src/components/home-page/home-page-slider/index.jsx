import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import homePage from "../../../assets/icons/home-page-banner.svg";
import dateIcon from "../../../assets/icons/date.svg";
import timeIcon from "../../../assets/icons/time.svg";
import rightArrow from "../../../assets/icons/right-arrow.svg";
import leftArrow from "../../../assets/icons/left-arrow.svg";
import locationPinIcon from "../../../assets/icons/location-pin.svg";
import "./home-page-slider.css";


function HomePageSlider() {
  const eventSlides = [
    {
      title: "Riyadh Food Festival",
      price: "15.00",
      date: "2025-03-10",
      time: "18:30",
      location: "Riyadh",
      image: "event-image.png",
      id: 1,
    },
    {
      title: "Jeddah Music Nights",
      price: "30.00",
      date: "2025-04-05",
      time: "20:00",
      location: "Jeddah",
      image: "event-image.png",
      id: 2,
    },
    {
      title: "Desert Arts Expo",
      price: "12.50",
      date: "2025-04-22",
      time: "17:00",
      location: "AlUla",
      image: "event-image.png",
      id: 3,
    },
    {
      title: "Khobar Comedy Show",
      price: "25.00",
      date: "2025-05-01",
      time: "21:00",
      location: "Khobar",
      image: "event-image.png",
      id: 4,
    },
    {
      title: "National Heritage Day",
      price: "0.00",
      date: "2025-05-15",
      time: "09:00",
      location: "Diriyah",
      image: "event-image.png",
      id: 5,
    },
    {
      title: "Future Tech Summit - NEOM",
      price: "99.00",
      date: "2025-06-03",
      time: "10:00",
      location: "NEOM",
      image: "event-image.png",
      id: 6,
    },
    {
      title: "Madinah Poetry Evening",
      price: "10.00",
      date: "2025-06-14",
      time: "19:00",
      location: "Madinah",
      image: "event-image.png",
      id: 7,
    },
    {
      title: "Dammam Startup Pitch Night",
      price: "20.00",
      date: "2025-07-02",
      time: "16:00",
      location: "Dammam",
      image: "event-image.png",
      id: 8,
    },
    {
      title: "Taif Summer Carnival",
      price: "5.00",
      date: "2025-07-20",
      time: "18:00",
      location: "Taif",
      image: "event-image.png",
      id: 9,
    },
  ];
  
    

  const NextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 text-purple-700 p-2 rounded-full w cursor-pointer"
    >
      <img src={leftArrow} alt="left arrow" />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2  text-purple-700 p-2 rounded-full shadow cursor-pointer"
    >
     <img src={rightArrow} alt="right arrow" />
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          padding: "2rem",
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };

  return (
    <div className=" relative slider-container h-160  border border-32 border-white rounded-4xl ">
      <section className="slider-section text-white">
        <div className="slider-comp">
          <Slider {...settings}>
            {eventSlides.map((event, idx) => (
              <div key={idx} className="slider-wrapper">
                <div className=" slider-banner relative flex  bg-white rounded-xl overflow-hidden text-black shadow-md">
                  <img
                    src={homePage}
                    alt={event.title}
                    className="slider-img w-full h-150 object-cover"
                  />
                  <div className=" slider-event-info flex flex-col justify- between w-full text-start absolute bottom-0 left-0 text-white px-16 pb-20 space-y-2">
                    <div>
                      <h3 className="slider-event-tilte text-3xl font-bold">{event.title}</h3>
                    </div>
                    <div>
                      <h3 className="slider-event-desc text-base">{event.title}</h3>
                    </div>
                    <div className="event-details flex gap-6 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                      <div className="event-loc flex flex-row gap-2 items-center">
                        <img src={locationPinIcon} alt="icon" />
                        {event.location}
                      </div>
                      <div className="event-date flex flex-row gap-2 items-center text-sm">
                        <img src={dateIcon} alt="icon" />
                        {event.date}
                      </div>
                      <div className="event-time flex flex-row gap-2 items-center text-sm">
                        <img src={timeIcon} alt="icon" />
                        {event.time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
}

export default HomePageSlider;
