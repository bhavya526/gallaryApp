"use client"
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import { MdCloudUpload } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";

const Memory = () => {
  const router = useRouter();
 const pathname=usePathname()
 const [selectedFile, setSelectedFile] = useState(null);
 const lastSegment = pathname.split('/').pop();
 console.log(pathname)

 const imagebase64 = async (file:any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
};

const handleFileChange = (event:any) => {
  // Update the selected file state when the file input changes
  setSelectedFile(event.target.files[0]);
};

 const handleSubmit = async (e: any) => {
  e.preventDefault();
  console.log(selectedFile);
  const fileInput = selectedFile;
  const image = await imagebase64(fileInput);
  console.log(image)


  const res = await fetch("http://localhost:8080/uploadImagesToMemory", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ image: image,parentId:lastSegment}),
      });

    
    const data = await res.json();
    console.log(data);
    if (res) {
      router.refresh();
    }
  
};
  return (
    <main className="container">
      <div className="sticky top-0 bg-white pb-4 z-10">
        <Navbar />
        <Header />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 pb-12">
        <div className="imageContainer">
          <form onSubmit={handleSubmit}>
            <label htmlFor="uploadImage">
              <div className="uploadBox">
                <input type="file" id="uploadImage" onChange={handleFileChange} />
                <MdCloudUpload />
              </div>
            </label>
            <button>Upload</button>
          </form>
        </div>

        {/* {memory.map((el) => {
          return (
            <div  key={el._id} href={`/Memory/${el._id}`} className="relative">
             
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
        })} */}
       

       
      </div>
    </main>
  )
}

export default Memory