import { type SchemaTypeDefinition } from 'sanity'
import audioUploader from './audio-uploader'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [audioUploader],
}
