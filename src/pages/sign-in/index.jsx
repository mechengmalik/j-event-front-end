import React from "react";
import SignInFooter from "../../components/signin/Signin-footer";
import SignInImage from "../../components/signin/signin-image";
import "./sign-in.css";
import SignInHeader from "../../components/signin/signin-header";

function SignIn() {
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
     <SignInImage />

     <div className="sign-in-wrapper w-1/2 flex flex-col gap-3 bg-white">
     <SignInHeader />

        <div className="sign-in-form  ml-40 ">
          <h2 className="text-3xl font-bold ">Welcome</h2>
          <p className="text-xs text-gray-500 mt-5 mb-5 text-center">
            Log in and enjoy our unique, exciting, and unforgettable events
          </p>
          <div className="flex flex-row justify-center items-center">
            <form className="w-full max-w-sm">
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
              <label className="flex items-center text-sm mb-4">
                <input type="checkbox" className="mr-2 accent-purple-500" />
                Keep me signed in
              </label>
              <button
                type="submit"
                className="w-full bg-regal-purple text-white py-2 rounded hover:bg-purple-500 "
              >
                Login
              </button>
            </form>
          </div>
          <div className="sign-in-footer">
            <SignInFooter
            signin={true}
            
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
