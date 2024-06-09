"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { CircleLoader } from "react-spinners";
const Header = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const pathname = usePathname();
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const imagebase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileInput = e.target.fileInput.files[0];
    if (fileInput) {
      const image = await imagebase64(fileInput);
      setShowForm(false);
      console.log(e.target.textInput.value);
      console.log(image);

      const res = await fetch("http://localhost:8080/uploadMemory", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ title: e.target.textInput.value, image: image }),
      });
      const data = await res.json();
      console.log(data);
      window.location.reload();
      if (res) {
        window.location.reload();

        res.send({ message: "Memory added successfully!" });
      }
    }
  };

  return (
    <div className="pt-8 ">
      <div className="flex items-center justify-between ">
        <h2 className="text-xl font-semibold">Photos</h2>
        {pathname === "/MainPage" ? (
          <button
            className="border-none border-gray-400 py-2 px-4 w-52 rounded-md"
            onClick={toggleForm}
          >
            Create new memory
          </button>
        ) : (
          ""
        )}
      </div>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <form
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label
                htmlFor="textInput"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Text Input
              </label>
              <input
                type="text"
                id="textInput"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter text"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="fileInput"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                File Input
              </label>
              <input
                type="file"
                id="fileInput"
                name="fileInput"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={toggleForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {pathname === "/" ? (
        <div className="flex items-center gap-4 text-gray-500 pt-2">
          <p className="text-[#31b666] font-semibold">Recent</p>
          <p>1 Month ago</p>
          <p>3 Month ago</p>
        </div>
      ) : (
        <div className="flex pt-2">
          <button
            className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold rounded-full focus:outline-none hover:from-orange-500 hover:to-pink-600 transition-colors duration-200"
            onClick={handleBack}
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
