const audioUploader = {
    name: 'audioUploader',
    title: 'Audio Uploader',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        description: 'Title of the audio file',
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        description: 'Short description about the audio',
      },
      {
        name: 'audioFile',
        title: 'Audio File',
        type: 'file',
        description: 'Upload your audio file here',
        options: {
          accept: 'audio/*', // Restrict file uploads to audio files
        },
      },
    ],
  };
  
  export default audioUploader;
  