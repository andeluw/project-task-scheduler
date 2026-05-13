import { lookup } from 'mime-types';

export const convertUrlToFileWithPreview = ({
  url,
  fileName,
}: {
  url: string | undefined;
  fileName: string;
}) =>
  url && [
    {
      preview: url,
      name: fileName,
      type: lookup(url) || 'image/jpeg',
    },
  ];
