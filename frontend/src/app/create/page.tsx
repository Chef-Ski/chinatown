"use client";

import React, { useState } from "react";
import { CloudUpload } from "lucide-react";

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setAudioPreview(URL.createObjectURL(selectedFile)); // Create preview URL
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      setFile(droppedFile);
      setAudioPreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an audio file first.");

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <h1 className="text-center text-5xl font-bold uppercase max-w-3xl">
        Upload your story for future generations to hear
      </h1>

      <div className="mt-12 w-full max-w-lg">
        <label
          className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-400 rounded-xl bg-white cursor-pointer hover:border-red-500 transition duration-300"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <CloudUpload className="w-16 h-16 text-gray-600 mb-3" />
          <p className="text-gray-700">Drag & Drop an audio file here</p>
          <p className="text-sm text-gray-500">or click to select a file</p>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {file && (
          <div className="mt-4 text-center">
            <p className="text-lg font-medium text-gray-700">{file.name}</p>
            <audio controls className="w-full mt-2">
              <source src={audioPreview || ""} type={file.type} />
              Your browser does not support the audio element.
            </audio>
            <button
              onClick={handleUpload}
              className="mt-4 px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded-lg hover:bg-red-600 transition"
            >
              Upload Audio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
