import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GoChevronDown } from "react-icons/go";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between py-4">
      <h2 className="text-2xl font-semibold">Gallary App</h2>
      <div className="flex items-center gap-2">
        <div className="size-[40px] rounded-full border border-gray-400 text-2xl grid place-items-center text-gray-600">
          <AiOutlineUser />
        </div>
        <p>Bhavya</p>
        <GoChevronDown className="text-gray-600" />
      </div>
    </div>
  );
};

export default Navbar;
