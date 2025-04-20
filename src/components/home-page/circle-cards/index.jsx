import React from "react";
import decoration from "../../../assets/icons/decoration.svg";
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
    <div>
      <div className="relative w-[673px] h-[673px] mx-auto my-10 flex items-center justify-center">
        {/* Gradient Circle */}
        <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-tr from-[#8354A3] to-[#00C2D1]">
          <div className="w-full h-full rounded-full bg-white"></div>
        </div>

        {/* Center Text + Image */}
        <div className="absolute text-center z-10 w-[22.5rem]">
          <img src={decoration} alt="decoration" className="mx-auto mb-2" />
          <h2 className="text-5xl font-bold text-black px-10">
            Organize Your Event
          </h2>
        </div>

        {/* Cards Around the Circle */}
        {cardsData.map((card, i) => {
          const angle = (360 / cardsData.length) * i - 90;
          const radius = 336.5;
          const rad = (angle * Math.PI) / 180;
          const x = radius * Math.cos(rad);
          const y = radius * Math.sin(rad);

          return (
            <div
              key={card.id}
              className="absolute p-[1px] flex justify-between bg-gradient-to-tr from-[#8354A3] to-[#00C2D1] rounded-md"
              style={{
                left: `calc(50% + ${x}px - 112px)`,
                top: `calc(50% + ${y}px - 112px)`,
              }}
            >
              <div className="w-[224px] h-[224px] bg-[#F6F6F6] rounded-md flex items-center justify-around text-center px-4 py-2">
                <div className="h-full flex flex-col justify-start gap-4 items-center py-8">
                  <div className="">
                    <img src={checkMark} alt="check mark" />
                  </div>
                  <h3 className="text-[#8354A3] font-semibold text-base text-bold">
                    {card.title}
                  </h3>
                  <p className="text-[#8354A3] text-sm text-normal">{card.details}</p>
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
