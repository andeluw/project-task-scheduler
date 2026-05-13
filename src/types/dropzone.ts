import type { FileWithPath } from 'react-dropzone';

export type FileWithPreview = FileWithPath & { preview: string };

// Used for react hook form field type
export type File = string | { preview: string; name: string; type: string }[];
