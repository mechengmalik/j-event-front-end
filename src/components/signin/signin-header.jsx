import React from 'react'
import langIcon from "../../assets/icons/language.svg";
import Logo from "../../assets/icons/Logo.svg";

const SignInHeader = () => {
  return (
<div className="sign-in-header w-full flex flex-row justify-between items-center">
          <img className="logo-image w-1/6 pt-1" src={Logo} alt="logo" />
          <div className="lang-wrapper flex lang-icon text-sm text-gray-500 cursor-pointer pb-2 ">
            <img src={langIcon}className='w-1/6' alt="lang" />

            <select className="lang-select-input text-sm " name="language" id="">
              <option value="">English</option>
              <option value="dog">Arabic</option>
            </select>
          </div>
        </div>  )
}

export default SignInHeader