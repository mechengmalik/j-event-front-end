import React from "react";
import decoration from "../../../assets/icons/decoration-logo.svg";
import checkMark from "../../../assets/icons/check-mark.svg";

function CircleCards() {
  const cardsData = [
    {
      title: "Inclusive Services",
      details: "Integrated solutions for all your organizational needs",
      id: 1,
    },
    {
      title: "Dedicated Team",
      details: "A team with extensive experience in organizing events",
      id: 2,
    },
    {
      title: "Technical Innovation",
      details:
        "We create customized technology solutions to create a unique experience for your guests.",
      id: 3,
    },
    {
      title: "High Quality",
      details:
        "Commitment to providing high-quality services that meet your needs",
      id: 4,
    },
    {
      title: "Ease of use",
      details: "User-friendly and uncomplicated interface",
      id: 5,
    },
  ];

  return (
    <div className="w-full flex justify-center items-center px-4">
      <div className="relative w-[90vw] max-w-[673px] aspect-square my-10 flex items-center justify-center">
        {/* Gradient Circle */}
        <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-tr from-[#8354A3] to-[#00C2D1]">
          <div className="w-full h-full rounded-full bg-white"></div>
        </div>

        {/* Center Text + Image */}
        <div className="absolute text-center z-10 w-[65%] px-4">
          <img src={decoration} alt="decoration" className="mx-auto mb-2 w-12 sm:w-16" />
          <h2 className="text-2xl sm:text-4xl font-bold text-black">
            Organize Your Event
          </h2>
        </div>

        {/* Cards Around the Circle */}
        {cardsData.map((card, i) => {
          const angle = (360 / cardsData.length) * i - 90;
          const radiusPercent = 42; // % of container
          const rad = (angle * Math.PI) / 180;
          const x = radiusPercent * Math.cos(rad);
          const y = radiusPercent * Math.sin(rad);

          return (
            <div
              key={card.id}
              className="absolute p-[1px] flex justify-between bg-gradient-to-tr from-[#8354A3] to-[#00C2D1] rounded-md w-[30vw] max-w-[224px]"
              style={{
                left: `calc(50% + ${x}% - 15vw)`,
                top: `calc(50% + ${y}% - 15vw)`,
              }}
            >
              <div className="w-full aspect-square bg-[#F6F6F6] rounded-md flex items-center justify-around text-center px-2 py-2">
                <div className="h-full flex flex-col justify-start gap-2 items-center py-4">
                  <img src={checkMark} alt="check mark" className="w-6 h-6" />
                  <h3 className="text-[#8354A3] font-semibold text-sm sm:text-base">
                    {card.title}
                  </h3>
                  <p className="text-[#8354A3] text-xs sm:text-sm">{card.details}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CircleCards;
