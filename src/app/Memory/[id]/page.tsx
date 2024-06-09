"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import { MdCloudUpload } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { FaDownload } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { CircleLoader } from "react-spinners";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// Define the types for the memory image object
interface MemoryImage {
  _id: string;
  image: string;
}

const Memory = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [memoryImage, setMemoryImage] = useState<MemoryImage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const lastSegment = pathname.split("/").pop();
  console.log(pathname);

  const fetchMemoriesImages = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/getMemoryImage/${lastSegment}`
      );
      const data = await res.json();
      if (res.ok) {
        setMemoryImage(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching memory images:", error);
    }
  };

  const handleOpenModal = (image: string) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const imagebase64 = async (
    file: File
  ): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update the selected file state when the file input changes
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const downloadImage = (imageUrl: string) => {
    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "image.jpg"; // You can customize the downloaded file name here
    document.body.appendChild(link);

    // Trigger the click event to start the download
    link.click();

    // Clean up
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;
    const image = await imagebase64(selectedFile);
    console.log(image);

    const res = await fetch("http://localhost:8080/uploadImagesToMemory", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ image, parentId: lastSegment }),
    });

    const data = await res.json();
    console.log(data);
    window.location.reload();
    if (res.ok) {
      window.location.reload();
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8080/deleteMemoryImage/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete memory Image! Status: ${res.status}`);
      }

      const result = await res.json();
      console.log(result.message);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting memory:", error);
    }
  };

  useEffect(() => {
    fetchMemoriesImages();
  }, []);

  return (
    <main className="container">
      <div className="sticky top-0 bg-transparent pb-4 z-10">
        <Navbar />
        <Header />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 pb-12">
        <div className="imageContainer">
          <form onSubmit={handleSubmit}>
            <label htmlFor="uploadImage">
              <div className="uploadBox">
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleFileChange}
                />
                <MdCloudUpload />
              </div>
            </label>
            <button disabled={!selectedFile} className="upload-button">
              Upload
            </button>
          </form>
        </div>

        {memoryImage.map((el) => (
          <div
            key={el._id}
            className="relative"
            onClick={() => handleOpenModal(el.image)}
          >
            <img
              src={el.image}
              alt="photo"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the modal open
                deleteMemory(el._id);
              }}
              className="absolute bottom-2 right-2 text-white p-2 rounded-full focus:outline-none bg-red-500 hover:bg-red-700"
            >
              <RiDeleteBin6Fill size={20} />
            </button>
          </div>
        ))}

        {isModalOpen && modalImage && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header d-flex justify-between">
                  <button
                    type="button"
                    className="text-2xl px-4 py-2"
                    onClick={() => downloadImage(modalImage)}
                  >
                    <FaDownload />
                  </button>
                  <button
                    type="button"
                    className="close text-2xl px-4 py-2"
                    aria-label="Close"
                    onClick={handleCloseModal}
                  >
                    <AiOutlineClose className="font-bold" />
                  </button>
                </div>
                <div className="modal-body">
                  <img src={modalImage} alt="photo" className="w-100 h-auto" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Memory;
