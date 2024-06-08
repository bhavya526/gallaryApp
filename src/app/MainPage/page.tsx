"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import { RiDeleteBin6Fill } from "react-icons/ri";
import "../../app/globals.css";
import { RiEdit2Fill } from "react-icons/ri";
import { MdCloudUpload } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircleLoader } from "react-spinners";

export default function Home() {
  const textInputRef = useRef(null);
  const router = useRouter();
  const [memory, setMemory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchMemories = async () => {
    const res = await fetch("http://localhost:8080/getMemory");
    const data = await res.json();
    setMemory(data.data);
    setLoading(false);
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

    if (fileInput) {
      const image = await imagebase64(fileInput);
      setShowForm(false);

      const res = await fetch(`http://localhost:8080/editMemory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: e.target.textInput.value, image: image }),
      });

      const data = await res.json();
      if (res.ok) {
        router.refresh();
        setShowForm(false);
      }
    } else {
      const res = await fetch(`http://localhost:8080/editMemory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: e.target.textInput.value }),
      });

      const data = await res.json();
      if (res.ok) {
        router.refresh();
        setShowForm(false);
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

      if (textInputRef && textInputRef.current) {
        textInputRef.current.value = memory.title;
      }
      setImagePreview(memory.image);
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching memory:", error);
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

  const deleteMemory = async (id) => {
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
  }, []);

  return (
    <main className="container">
      <div className="sticky top-0 bg-transparent pb-4 z-10">
        <Navbar />
        <Header />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
          <CircleLoader color="#36d7b7" size={150} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 pb-12">
          {memory.map((el) => (
            <Link
              key={el._id}
              href={`/Memory/${el._id}`}
              className="relative max-h-[400px] block"
            >
              <img
                src={el.image}
                alt="photo"
                className="w-full h-full rounded-lg object-fill"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <h2 className="text-white text-xl font-bold shadow-lg">
                  {el.title}
                </h2>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  deleteMemory(el._id);
                }}
                className="absolute bottom-2 right-2 text-white p-2 rounded-full focus:outline-none bg-red-500 hover:bg-red-700"
              >
                <RiDeleteBin6Fill size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  openEditWindow(el._id);
                }}
                className="absolute bottom-2 left-2 text-white p-2 rounded-full focus:outline-none bg-blue-500 hover:bg-blue-700"
              >
                <RiEdit2Fill size={20} />
              </button>
            </Link>
          ))}

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
      )}
    </main>
  );
}
