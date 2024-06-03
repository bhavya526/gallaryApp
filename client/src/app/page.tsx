"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import { RiDeleteBin6Fill } from "react-icons/ri";
import "./globals.css";
import { RiEdit2Fill } from "react-icons/ri";
import { MdCloudUpload } from "react-icons/md";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Home() {
  const textInputRef = useRef(null);
  const router = useRouter();
  const [memory, setMemory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fetchMemories = async () => {
    const res = await fetch("http://localhost:8080/getMemory");
    const data = await res.json();
    setMemory(data.data);
  };
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const imagebase64 = async (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const id = editId;
    const fileInput = e.target.fileInput.files[0];
    console.log(e.target.fileInput.files[0]);

    if (fileInput) {
      const image = await imagebase64(fileInput);
      setShowForm(false);
      console.log(e.target.textInput.value);
      console.log(image);

      const res = await fetch(`http://localhost:8080/editMemory/${id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ title: e.target.textInput.value, image: image }),
      });
      const data = await res.json();
      console.log(data);
      if (res) {
        router.refresh();
        setShowForm(false);
      }
    } else {
      const res = await fetch(`http://localhost:8080/editMemory/${id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ title: e.target.textInput.value }),
      });
      const data = await res.json();
      console.log(data);
      if (res) {
        router.refresh();
      }
    }
  };

  const openEditWindow = async (id: any) => {
    setShowForm(!showForm);
    try {
      const res = await fetch(`http://localhost:8080/getMemory/${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch memory! Status: ${res.status}`);
      }

      const memory = await res.json();
      setEditId(id);
      textInputRef.current.value = memory.title;
      setImagePreview(memory.image);
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching memory:", error);
    }
  };

  const editMemory = async (id: any, updatedData: any) => {
    try {
      const res = await fetch(`http://localhost:8080/editMemory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error(`Failed to update memory! Status: ${res.status}`);
      }

      const result = await res.json();
      console.log(result.message);
    } catch (error) {
      console.error("Error updating memory:", error);
    }
  };

  const handleFileChange = (event: any) => {
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

  const deleteMemory = async (id: any) => {
    try {
      const res = await fetch(`http://localhost:8080/deleteMemory/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete memory! Status: ${res.status}`);
      }

      const result = await res.json();
      console.log(result.message);
    } catch (error) {
      console.error("Error deleting memory:", error);
    }
  };
  useEffect(() => {
    fetchMemories();
  });
  return (
    <main className="container">
      <div className="sticky top-0 bg-white pb-4 z-10">
        <Navbar />
        <Header />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 pb-12">
        <div className="imageContainer">
          <form>
            <label htmlFor="uploadImage">
              <div className="uploadBox">
                <input type="file" id="uploadImage" />
                <MdCloudUpload />
              </div>
            </label>
            <button>Upload</button>
          </form>
        </div>
        {memory.map((el) => {
          return (
            <div className="relative ">
              <img
                src={el.image}
                alt="photo"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <h2 className="text-white text-xl font-bold shadow-lg">
                  {el.title}
                </h2>
              </div>
              <button
                onClick={() => deleteMemory(el._id)}
                className="absolute bottom-2 right-2 text-white p-2 rounded-full focus:outline-none"
              >
                <RiDeleteBin6Fill size={20} />
              </button>
              <button
                onClick={() => openEditWindow(el._id)}
                className="absolute bottom-2 left-2 text-white  p-2 rounded-full focus:outline-none"
              >
                <RiEdit2Fill size={20} />
              </button>
            </div>
          );
        })}

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
                  ref={textInputRef}
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
      </div>
    </main>
  );
}
