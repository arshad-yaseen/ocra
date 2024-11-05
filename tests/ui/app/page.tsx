'use client';

import {useState} from 'react';

import FileUpload from '@/components/file-upload';
import {ImageResult, PageResult} from 'ocra';

// Preview component for displaying uploaded file
const Preview = ({url, type}: {url: string; type: 'image' | 'pdf'}) => {
  return type === 'image' ? (
    <img
      src={url}
      alt="Preview"
      className="w-full h-full object-contain rounded-lg"
    />
  ) : (
    <iframe
      src={url}
      className="w-full h-full rounded-lg border-0"
      title="PDF preview"
    />
  );
};

// Content display component
const ContentDisplay = ({
  contents,
  isLoading,
}: {
  contents?: (PageResult | ImageResult)[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-neutral-500 animate-pulse">
          Extracting...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="whitespace-pre-wrap space-y-6">
        {contents?.map((content, i) => (
          <div key={i} className="text-base leading-relaxed">
            {content.content}
          </div>
        ))}
      </div>
    </div>
  );
};

// Landing component
const Landing = ({
  onUpload,
}: {
  onUpload: (url: string, type: 'image' | 'pdf') => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 md:p-12 lg:p-20">
      <div className="max-w-3xl w-full space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
            Ocra
          </h1>
          <p className="text-lg sm:text-xl text-neutral-500 leading-relaxed">
            Fast, ultra-accurate text extraction from any image{' '}
            <br className="hidden sm:block" />
            or PDF, even challenging ones, with structured markdown output.
          </p>
        </div>
        <FileUpload onUpload={onUpload} />
      </div>
    </div>
  );
};

export default function Home() {
  const [contents, setContents] = useState<PageResult[] | ImageResult[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [fileType, setFileType] = useState<'image' | 'pdf'>();

  const handleUpload = async (url: string, type: 'image' | 'pdf') => {
    setIsLoading(true);
    setPreviewUrl(url);
    setFileType(type);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: JSON.stringify({url, type}),
      });

      const {result} = (await response.json()) ?? {};
      setContents(type === 'image' ? [result] : result);
    } finally {
      setIsLoading(false);
    }
  };

  if (previewUrl && fileType) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 gap-6 lg:gap-8">
        <div className="w-full lg:w-1/2 h-[40vh] lg:h-[85vh]">
          <Preview url={previewUrl} type={fileType} />
        </div>
        <div className="w-full lg:w-1/2 h-[40vh] lg:h-[85vh]">
          <ContentDisplay contents={contents} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  return <Landing onUpload={handleUpload} />;
}
