"use client";

import React, { useState } from "react";
import { CloudUpload } from "lucide-react";
import { Listbox } from "@headlessui/react";
import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";

const languages = [
  { code: "af", label: "Afrikaans" },
  { code: "sq", label: "Albanian" },
  { code: "am", label: "Amharic" },
  { code: "ar", label: "Arabic" },
  { code: "hy", label: "Armenian" },
  { code: "az", label: "Azerbaijani" },
  { code: "eu", label: "Basque" },
  { code: "be", label: "Belarusian" },
  { code: "bn", label: "Bengali" },
  { code: "bs", label: "Bosnian" },
  { code: "bg", label: "Bulgarian" },
  { code: "ca", label: "Catalan" },
  { code: "ceb", label: "Cebuano" },
  { code: "ny", label: "Chichewa" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "zh-TW", label: "Chinese (Traditional)" },
  { code: "co", label: "Corsican" },
  { code: "hr", label: "Croatian" },
  { code: "cs", label: "Czech" },
  { code: "da", label: "Danish" },
  { code: "nl", label: "Dutch" },
  { code: "en", label: "English" },
  { code: "eo", label: "Esperanto" },
  { code: "et", label: "Estonian" },
  { code: "tl", label: "Filipino" },
  { code: "fi", label: "Finnish" },
  { code: "fr", label: "French" },
  { code: "fy", label: "Frisian" },
  { code: "gl", label: "Galician" },
  { code: "ka", label: "Georgian" },
  { code: "de", label: "German" },
  { code: "el", label: "Greek" },
  { code: "gu", label: "Gujarati" },
  { code: "ht", label: "Haitian Creole" },
  { code: "ha", label: "Hausa" },
  { code: "haw", label: "Hawaiian" },
  { code: "he", label: "Hebrew" },
  { code: "hi", label: "Hindi" },
  { code: "hmn", label: "Hmong" },
  { code: "hu", label: "Hungarian" },
  { code: "is", label: "Icelandic" },
  { code: "ig", label: "Igbo" },
  { code: "id", label: "Indonesian" },
  { code: "ga", label: "Irish" },
  { code: "it", label: "Italian" },
  { code: "ja", label: "Japanese" },
  { code: "jw", label: "Javanese" },
  { code: "kn", label: "Kannada" },
  { code: "kk", label: "Kazakh" },
  { code: "km", label: "Khmer" },
  { code: "rw", label: "Kinyarwanda" },
  { code: "ko", label: "Korean" },
  { code: "ku", label: "Kurdish (Kurmanji)" },
  { code: "ky", label: "Kyrgyz" },
  { code: "lo", label: "Lao" },
  { code: "la", label: "Latin" },
  { code: "lv", label: "Latvian" },
  { code: "lt", label: "Lithuanian" },
  { code: "lb", label: "Luxembourgish" },
  { code: "mk", label: "Macedonian" },
  { code: "mg", label: "Malagasy" },
  { code: "ms", label: "Malay" },
  { code: "ml", label: "Malayalam" },
  { code: "mt", label: "Maltese" },
  { code: "mi", label: "Maori" },
  { code: "mr", label: "Marathi" },
  { code: "mn", label: "Mongolian" },
  { code: "my", label: "Myanmar (Burmese)" },
  { code: "ne", label: "Nepali" },
  { code: "no", label: "Norwegian" },
  { code: "or", label: "Odia" },
  { code: "ps", label: "Pashto" },
  { code: "fa", label: "Persian" },
  { code: "pl", label: "Polish" },
  { code: "pt", label: "Portuguese" },
  { code: "pa", label: "Punjabi" },
  { code: "ro", label: "Romanian" },
  { code: "ru", label: "Russian" },
  { code: "sm", label: "Samoan" },
  { code: "gd", label: "Scots Gaelic" },
  { code: "sr", label: "Serbian" },
  { code: "st", label: "Sesotho" },
  { code: "sn", label: "Shona" },
  { code: "sd", label: "Sindhi" },
  { code: "si", label: "Sinhala" },
  { code: "sk", label: "Slovak" },
  { code: "sl", label: "Slovenian" },
  { code: "so", label: "Somali" },
  { code: "es", label: "Spanish" },
  { code: "su", label: "Sundanese" },
  { code: "sw", label: "Swahili" },
  { code: "sv", label: "Swedish" },
  { code: "tg", label: "Tajik" },
  { code: "ta", label: "Tamil" },
  { code: "tt", label: "Tatar" },
  { code: "te", label: "Telugu" },
  { code: "th", label: "Thai" },
  { code: "tr", label: "Turkish" },
  { code: "tk", label: "Turkmen" },
  { code: "uk", label: "Ukrainian" },
  { code: "ur", label: "Urdu" },
  { code: "uz", label: "Uzbek" },
  { code: "vi", label: "Vietnamese" },
  { code: "cy", label: "Welsh" },
  { code: "xh", label: "Xhosa" },
  { code: "yi", label: "Yiddish" },
  { code: "yo", label: "Yoruba" },
  { code: "zu", label: "Zulu" }
];

const communitiesList = [
  { id: "vietnam-war", name: "Vietnam War" },
  { id: "pakistan-partition", name: "Pakistan Partition" },
  { id: "north-korean-escape", name: "North Korean Escape" },
  { id: "holocaust-survivors", name: "Holocaust Survivors" },
  { id: "cuban-revolution", name: "Cuban Revolution" },
  { id: "soviet-afghanistan", name: "Soviet-Afghan War" },
  { id: "cultural-revolution", name: "Cultural Revolution" },
  { id: "fall-of-berlin-wall", name: "Fall of Berlin Wall" },
];

const LanguageSelector = () => {
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  return (
    <Listbox value={selectedLang} onChange={setSelectedLang}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-red-500 text-base">
          <span className="block truncate">{selectedLang.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 7l3 3 3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 z-40 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {languages.map((lang) => (
            <Listbox.Option
              key={lang.code}
              value={lang}
              className={({ active }) =>
                `cursor-default select-none relative py-2 pl-10 pr-4 ${
                  active ? "text-white bg-red-500" : "text-gray-900"
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                    {lang.label}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

const CommunitySelector = () => {
  const [selectedCommunity, setSelectedCommunity] = useState(communitiesList[0]);

  return (
    <Listbox value={selectedCommunity} onChange={setSelectedCommunity}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-red-500 text-base">
          <span className="block truncate">{selectedCommunity.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 7l3 3 3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Listbox.Button>
        {/* Higher z-index here so the community dropdown appears above */}
        <Listbox.Options className="absolute mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {communitiesList.map((community) => (
            <Listbox.Option
              key={community.id}
              value={community}
              className={({ active }) =>
                `cursor-default select-none relative py-2 pl-10 pr-4 ${
                  active ? "text-white bg-red-500" : "text-gray-900"
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                    {community.name}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [gender, setGender] = useState<string>("male");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setAudioPreview(URL.createObjectURL(selectedFile));
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

  const pythonscript = "./backend/test.py"

  const handleUpload = async () => {
    if (!file) return alert("Please select an audio file first.");
  
    const formData = new FormData();
    formData.append("audio", file);
    formData.append(
      "translationLang",
      (document.querySelector('input[name="translationLang"]') as any)?.value || "en"
    );
    formData.append("gender", gender);
  
    try {
      const response = await fetch("http://localhost:5000/api/upload", { // Change this URL to match your backend
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-8 font-sans">
      <h1 className="text-center text-5xl font-bold tracking-wide text-gray-800 max-w-3xl">
        Save And Share A Story
      </h1>
      <div className="mt-12 w-full max-w-lg space-y-8">
        {/* File Upload Area */}
        <label
          className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-xl bg-white cursor-pointer hover:border-red-400 transition duration-300"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <CloudUpload className="w-16 h-16 text-gray-500 mb-3" />
          <p className="text-gray-700 font-medium">Drag & Drop an audio or video file here</p>
          <p className="text-sm text-gray-500">or click to select a file</p>
          <input type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
        </label>

        {/* Community Selection */}
        <div className="flex flex-col">
          <label className="mb-2 text-base font-medium text-gray-700">
            Choose Community:
          </label>
          <CommunitySelector />
        </div>

        {/* Translation Language Selector */}
        <div className="flex flex-col">
          <label className="mb-2 text-base font-medium text-gray-700">
            Choose Language To Translate To:
          </label>
          <LanguageSelector />
        </div>

        {/* Gender Selector */}
        <div className="flex flex-col">
          <label className="mb-2 text-base font-medium text-gray-700">
            Choose Gender:
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {file && (
          <div className="mt-4 text-center space-y-4">
            <p className="text-lg font-medium text-gray-800">{file.name}</p>
            <audio controls className="w-full">
              <source src={audioPreview || ""} type={file.type} />
              Your browser does not support the audio element.
            </audio>
            <button
              onClick={handleUpload}
              className="mt-4 px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition"
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
