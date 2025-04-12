import React from "react";
import "./signin.css";
function SignInImage({ signin }) {
  return (
    <div className="w-1/2 custom-gradient text-white flex flex-col justify-end pl-15 pr-15 ">
      {signin ? (
        <div className="mb-12">
          <h1 className="text-3xl font-semibold mb-4">
            Good to See You Again!
          </h1>
          <p className="text-sm text-gray-500">
            Jump back in to find events, track your tickets, manage your
            activities, or host something amazing!
          </p>
        </div>
      ) : (
        <div className="mb-12">
          <h1 className="text-3xl font-semibold mb-4">
            Be Part of the Experience
          </h1>
          <p className="text-sm text-gray-500">
            Join our community — discover exciting events near you or create
            unforgettable experiences as an organizer.{" "}
          </p>
        </div>
      )}
    </div>
  );
}

export default SignInImage;
