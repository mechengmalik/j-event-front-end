import React from "react";
import { useNavigate } from "react-router-dom";
import SignInFooter from "../../components/signin/signin-footer";
import SignInImage from "../../components/signin/signin-image";
import SignInHeader from "../../components/signin/signin-header";
import "./home.css";

function SignIn() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
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
    <div className="sign-in-page flex h-screen">
      <SignInImage signin={true} />

      <div className="sign-in-container w-1/2 flex flex-col justify-between items-center px-10 py-5">
        <SignInHeader />

        <div className="sign-in-wrapper w-ful px-30 ">
          <div className="sign-in-form w-full px-2">
            <div className="sign-in-form-header flex flex-col  ">
              <h2 className="welcome  font-bold text-3xl p-2  ">Welcome</h2>
              <p className="login-text text-sm text-black/70 text-center pb-5">
                Log in and enjoy our unique, exciting, and unforgettable events
              </p>
            </div>
            <div className="flex flex-row">
              <form className="w-full">
                <input
                  type="email"
                  placeholder="Email"
                  className="input w-full text-sm pl-3 py-2 mb-2 text-[#49454F] border border-[#79747E] focus:outline-none  focus:ring-[#79747E]"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="input w-full text-sm pl-3 py-2 mb-3 text-[#49454F] border border-[#79747E] focus:outline-none  focus:ring-[#79747E]"
                />
                <label className=" sign-in-checkbox flex items-center text-xs pb-3 ">
                  <input type="checkbox" className="mr-2 accent-purple-500" />
                  Keep me signed in
                </label>
                <button
                  onClick={handleLogin}
                  type="submit"
                  className="sign-in-btn w-full bg-regal-purple text-sm text-white py-3 hover:bg-purple-500 "
                >
                  Login
                </button>
              </form>
            </div>
          </div>
          <SignInFooter signin={true} />
        </div>
        <div className=" flex justify-center gap-2 text-xs text-black/70 py-5  ">
          <a href="#" className="hover:underline">
            Terms of use
          </a>{" "}
          ·{" "}
          <a href="#" className="hover:underline">
            Privacy policy
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
