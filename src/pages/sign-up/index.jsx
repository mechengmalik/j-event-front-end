import React from "react";
import { useNavigate } from "react-router-dom";
import SignInImage from "../../components/signin/signin-image";
import SignInHeader from "../../components/signin/signin-header";
import SignInFooter from "../../components/signin/signin-footer";
import "./sign-up.css";

function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    navigate("/dashboard");
  };
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   password: '',
  // });

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Form Submitted:', formData);
  //   // Here you'd normally send data to a backend or validate
  // };

  return (
    <div className=" conainer flex w-full h-screen">
      <div className="sign-up-container w-1/2 flex flex-col justify-between items-center px-10 py-1">
        <SignInHeader />

        <div className="sign-up-wrapper w-full px-30 ">
          <div className="sign-up-form w-full px-2">
            <div className="sign-up-form-header flex flex-col pb-2 ">
              <h2 className="register font-bold text-3xl p-3 ">Register</h2>
              <p className="signup-text text-sm text-black/70 text-center">
                Create your account to explore, attend, or organize events{" "}
              </p>
            </div>
            <div className="flex flex-row">
              <form className="w-full">
                <input
                  type="text"
                  placeholder="Full Name"
                  className=" input text-sm w-full pl-3 py-2 mb-1 text-[#49454F] border border-[#79747E] focus:outline-none focus:ring-[#79747E]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="input text-sm w-full pl-3 py-2 mb-1 text-[#49454F] border border-[#79747E] focus:outline-none focus:ring-[#79747E]"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="input text-sm w-full pl-3 py-2 mb-1 text-[#49454F] border border-[#79747E] focus:outline-none focus:ring-[#79747E]"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input text-sm w-full pl-3 py-2 mb-2 text-[#49454F] border border-[#79747E] focus:outline-none focus:ring-[#79747E]"
                />
                <button
                  onClick={handleSignUp}
                  type="submit"
                  className="sign-up-btn w-full bg-regal-purple text-sm text-white py-3 hover:bg-purple-500 "
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>
          <SignInFooter signin={false} />
        </div>

        <div className=" flex justify-center gap-2 text-xs text-black/70 py-4  ">
          <a href="#" className="hover:underline">
            Terms of use
          </a>{" "}
          ·{" "}
          <a href="#" className="hover:underline">
            Privacy policy
          </a>
        </div>
      </div>
      <SignInImage />
    </div>
  );
}

export default SignUp;
