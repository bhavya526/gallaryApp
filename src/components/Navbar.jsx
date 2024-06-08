import React, { useEffect, useRef, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GoChevronDown } from "react-icons/go";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState("");
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fetchUser = async () => {
    const res = await fetch("http://localhost:8080/loginMemory");
    const data = await res.json();
    setUser(data.data[0].username);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing tokens, session storage, etc.)
    console.log("User logged out");
    router.push("/"); // Redirect to login page after logout
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    fetchUser();
  });
  return (
    <div className="flex items-center justify-between py-4">
      <h2 className="text-2xl font-semibold">Gallary App</h2>
      <div className="flex items-center gap-2">
        <div className="size-[40px] rounded-full border border-gray-400 text-2xl grid place-items-center text-gray-600">
          <AiOutlineUser />
        </div>
        <p>{user}</p>
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            onClick={handleDropdownToggle}
            className="flex items-center focus:outline-none"
          >
            <GoChevronDown className="text-gray-600" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-5 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 origin-top-right">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
