import React from "react";
import signInImage from "../../assets/icons/noise-texture.svg";
import "./signin.css";

function SignInImage({ signin }) {
  return (
    <div className="w-1/2 custom-gradient relative h-full text-white overflow-hidden">
      {/* Background Image */}
      <img
        src={signInImage}
        className="relative inset-0 w-full h-full  "
        alt=""
      />

      {/* Text Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 px-17">
        <h1 className="text-3xl font-semibold mb-4 ">
          {signin ? "Good to See You Again!" : "Be Part of the Experience"}
        </h1>
        <p className="text-sm text-gray-300">
          {signin
            ? "Jump back in to find events, track your tickets, manage your activities, or host something amazing!"
            : "Join our community — discover exciting events near you or create unforgettable experiences as an organizer."}
        </p>
      </div>
    </div>
  );
}

export default SignInImage;
