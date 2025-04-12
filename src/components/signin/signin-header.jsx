import React from 'react'
import langIcon from "../../../public/assets/icons/language.svg";
import Logo from "../../../public/assets/icons/Logo.svg";

const SignInHeader = () => {
  return (
<div className="logo-icon flex flex-row justify-between items-center pr-3 pl-2">
          <img className="logo" src={Logo} alt="logo" />
          <div className="flex lang-icon text-sm text-gray-500 cursor-pointer ">
            <img src={langIcon} alt="lang" />

            <select className="border-none" name="language" id="">
              <option value="">English</option>
              <option value="dog">Arabic</option>
            </select>
          </div>
        </div>  )
}

export default SignInHeader