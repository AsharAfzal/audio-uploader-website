'use client';

import { useEffect, useState } from 'react';
import sanityClient from '@/app/sanity/lib/client';
import { getAudioFiles } from '@/app/sanity/lib/queries';

type AudioFile = {
  title: string;
  description: string;
  audioUrl: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]); // Updated type

  useEffect(() => {
    async function fetchData() {
      const data = await getAudioFiles();
      setAudioFiles(data);
    }
    fetchData();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      const fileAsset = await sanityClient.assets.upload("file", file, {
        filename: file.name,
      });

      const audioDoc = {
        _type: "audioUploader",
        title: file.name.split(".")[0],
        description: "Uploaded via frontend",
        audioFile: {
          _type: "file",
          asset: {
            _ref: fileAsset._id,
            _type: "reference",
          },
        },
      };

      await sanityClient.create(audioDoc);

      const updatedAudioFiles = await getAudioFiles();
      setAudioFiles(updatedAudioFiles);

      setFile(null);
    } catch (error) {
      console.error("Error uploading file to Sanity:", error);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Upload and Manage Audio Files</h1>

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
