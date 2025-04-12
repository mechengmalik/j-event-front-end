import React from "react";
import { useNavigate } from "react-router-dom";
import SignInFooter from "../../components/signin/Signin-footer";
import SignInImage from "../../components/signin/signin-image";
import SignInHeader from "../../components/signin/signin-header";
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
    <div className="flex w-full h-screen p-1">
      <div className="sign-in-wrapper w-1/2 flex flex-col gap-3  bg-white">
        <SignInHeader />

        <div className="sign-in-form  ml-40 ">
          <h2 className="text-3xl font-bold ">Register</h2>
          <p className="text-xs text-gray-500 mt-3 mb-3 text-center">
            Create your account to explore, attend, or organize events{" "}
          </p>
          <div className="flex flex-row justify-center items-center">
            <form className="w-full max-w-sm">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 border border-gray-500 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-500 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-500 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-2 border border-gray-500 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSignUp}
                type="submit"
                className="w-full bg-regal-purple text-white py-2 mt-3 rounded hover:bg-purple-500 "
              >
                Create Account
              </button>
            </form>
          </div>
          <div className="sign-in-footer">
            <SignInFooter signin={false} />
          </div>
        </div>
      </div>
      <SignInImage />
    </div>
  );
}

export default SignUp;
