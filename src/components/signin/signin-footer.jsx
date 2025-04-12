import React from "react";
import { Link } from "react-router-dom";
import googleIcon from "../../../public/assets/icons/google.svg";
import oulookIcon from "../../../public/assets/icons/outlook.svg";
import "./signin.css";

function SignInFooter({ signin }) {
  return (
    <div className="social-btn-container">
      <div className="divider w-full max-w-md mx-auto">
        <div className="flex items-center gap-2 my-6">
          <hr className="flex-grow border-t border-black/60" />
          {signin? <span className="text-sm font-semibold text-black uppercase">
            Or login with
          </span>: <span className="text-sm font-semibold text-black uppercase">
          OR SIGN UP WITH
          </span>}
          <hr className="flex-grow border-t border-black/60" />
        </div>

        <div className=" social-login-buttons grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center border border-black/70 rounded-md py-2 px-4 gap-2 hover:bg-gray-100 transition">
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
            <span className="text-black text-sm">Google</span>
          </button>
          <button className="flex items-center justify-center border border-black/70 rounded-md py-2 px-4 gap-2 hover:bg-gray-100 transition">
            <img src={oulookIcon} alt="Outlook" className="w-5 h-5" />
            <span className="text-black text-sm">Outlook</span>
          </button>
        </div>

        {signin ? (
          <div className="flex justify-center items-center pt-5">
            <p className="text-sm text-gray-500">Don’t have an account?</p>
            <span>
              {" "}
              <Link
                className="text-sm font-semibold text-regal-purple pl-2"
                to={"/sign-up"}
              >
                {" "}
                Register{" "}
              </Link>
            </span>
          </div>
        ) : (
          <div className="flex justify-center items-center pt-5">
            <p className="text-sm text-gray-500">Don’t have an account?</p>
            <span>
              {" "}
              <Link
                className="text-sm font-semibold text-regal-purple pl-2"
                to={"/sign-in"}
              >
                {" "}
                Login{" "}
              </Link>
            </span>
          </div>
        )}
      </div>
      <div className=" flex justify-center gap-2 text-xs text-gray-500 mt-5  ">
        <a href="#" className="hover:underline">
          Terms of use
        </a>{" "}
        ·{" "}
        <a href="#" className="hover:underline">
          Privacy policy
        </a>
      </div>
    </div>
  );
}

export default SignInFooter;
