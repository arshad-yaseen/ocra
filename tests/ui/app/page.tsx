'use client';

import {useState} from 'react';

import FileUpload from '@/components/file-upload';
import {Button} from '@/components/ui/button';
import {ImageResult, PageResult} from 'ocra';

// Preview component for displaying uploaded file
const Preview = ({url, type}: {url: string; type: 'image' | 'pdf'}) => {
  return type === 'image' ? (
    <img
      src={url}
      alt="Preview"
      className="w-full h-full object-contain rounded-lg shadow-sm"
    />
  ) : (
    <object
      data={url}
      className="w-full h-full rounded-lg border-0 shadow-sm"
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
    <div className="h-full overflow-y-auto px-4">
      <div className="whitespace-pre-wrap space-y-6 py-4">
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
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4 py-8 sm:px-8 md:px-12 lg:px-20">
      <div className="max-w-3xl w-full space-y-10">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter">
            Ocra
          </h1>
          <p className="text-lg sm:text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto">
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

  const handleReset = () => {
    setContents(undefined);
    setPreviewUrl(undefined);
    setFileType(undefined);
    setIsLoading(false);
  };

  if (previewUrl && fileType) {
    return (
      <div className="flex flex-col lg:flex-row min-h-[100dvh] p-4 sm:p-6 md:p-8 lg:p-12 gap-6 lg:gap-12">
        <div className="w-full lg:w-1/2 h-[45vh] lg:h-[90vh] bg-neutral-50 rounded-xl p-4">
          <div className="relative h-full">
            <Preview url={previewUrl} type={fileType} />
            <Button onClick={handleReset} className="absolute top-2 right-2">
              Upload New File
            </Button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 h-[45vh] lg:h-[90vh] bg-neutral-50 rounded-xl">
          <ContentDisplay contents={contents} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  return <Landing onUpload={handleUpload} />;
}
