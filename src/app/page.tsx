'use client';

import { useEffect, useState } from 'react';
import sanityClient from '../sanity/lib/client';
import { getAudioFiles } from '@/sanity/lib/queries';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string>("");
  const [audioFiles, setAudioFiles] = useState<any[]>([]); // To store fetched audio files

  // Fetch all existing audio files on mount
  useEffect(() => {
    async function fetchData() {
      const data = await getAudioFiles();
      setAudioFiles(data);
    }
    fetchData();
  }, []);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  // Handle file upload to Sanity
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      // Step 1: Upload the file to Sanity
      const fileAsset = await sanityClient.assets.upload("file", file, {
        filename: file.name,
      });

      // Step 2: Create a new document in the `audioUploader` schema
      const audioDoc = {
        _type: "audioUploader",
        title: file.name.split(".")[0], // Use the file name as the title
        description: "Uploaded via frontend", // Add a default description
        audioFile: {
          _type: "file",
          asset: {
            _ref: fileAsset._id,
            _type: "reference",
          },
        },
      };

      await sanityClient.create(audioDoc);

      // Step 3: Set the uploaded file's URL and refresh the audio list
      setUploadedFilePath(fileAsset.url);

      // Fetch the updated audio files
      const updatedAudioFiles = await getAudioFiles();
      setAudioFiles(updatedAudioFiles);

      // Reset the file input
      setFile(null);
    } catch (error) {
      console.error("Error uploading file to Sanity:", error);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Upload and Manage Audio Files</h1>

      {/* Form to upload a new file */}
      <form
        className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md mb-6"
        onSubmit={handleUpload}
      >
        <input
          type="file"
          accept="audio/*"
          className="mb-4"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </form>

      {/* Show uploaded audio files */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Uploaded Audio Files</h2>
        {audioFiles.length > 0 ? (
          audioFiles.map((audio, index) => (
            <div key={index} className="mb-4 p-4 bg-white shadow rounded">
              <h2 className="text-xl font-semibold">{audio.title}</h2>
              <p className="text-gray-600">{audio.description}</p>
              <audio controls className="w-full mt-2">
                <source src={audio.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No audio files uploaded yet.</p>
        )}
      </div>
    </main>
  );
}
