import React from "react";
import { Link } from "react-router-dom";
import googleIcon from "../../assets/icons/google.svg";
import oulookIcon from "../../assets/icons/outlook.svg";
import "./signin.css";

function SignInFooter({ signin }) {
  return (
    <div className="social-btn-container px-2">
      <div className="divider w-full">
        <div className="divider-line flex items-center gap-2 my-4">
          <hr className="flex-grow border-t border-black/60" />
          {signin? <span className="log-or-sign-text text-xs font-semibold text-black uppercase">
            Or login with
          </span>: <span className="text-xs font-semibold text-black uppercase">
          OR SIGN UP WITH
          </span>}
          <hr className="flex-grow border-t border-black/60" />
        </div>

        <div className=" social-login-buttons grid grid-cols-2 gap-10 pb-5">
          <button className=" google-btn-wrapperr flex items-center justify-center border border-black/70 py-3  gap-2 hover:bg-gray-100 transition">
            <img src={googleIcon} alt="Google" className="google-btn w-1/6" />
            <span className="text-black text-sm">Google</span>
          </button>
          <button className="outlook-btn-wrapper flex items-center justify-center border border-black/70 py-3 gap-2 hover:bg-gray-100 transition">
            <img src={oulookIcon}  alt="Outlook" className="outlook-btn w-1/6" />
            <span className="text-black text-sm">Outlook</span>
          </button>
        </div>

        {signin ? (
          <div className="reg-login-text-wrapper text-sm flex justify-center items-center">
            <p className=" reg-login-text text-black/70">Don’t have an account?</p>
            <span>
              {" "}
              <Link
                className=" font-semibold text-regal-purple pl-2"
                to={"/sign-up"}
              >
                {" "}
                Register{" "}
              </Link>
            </span>
          </div>
        ) : (
          <div className="reg-login-text-wrapper flex justify-center items-center pt-2">
            <p className="text-sm text-black/70">Don’t have an account?</p>
            <span>
              {" "}
              <Link
                className="signin-signup-link text-sm font-semibold text-regal-purple pl-2"
                to={"/sign-in"}
              >
                {" "}
                Login{" "}
              </Link>
            </span>
          </div>
        )}
      </div>
      
      
    </div>
  );
}

export default SignInFooter;
