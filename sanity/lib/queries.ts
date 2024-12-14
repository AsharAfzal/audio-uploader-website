import sanityClient from './client';

export async function getAudioFiles() {
  const query = `*[_type == "audioUploader"]{
    title,
    description,
    "audioUrl": audioFile.asset->url
  }`;

  const audioFiles = await sanityClient.fetch(query);
  return audioFiles;
}
