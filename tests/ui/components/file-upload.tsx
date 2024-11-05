'use client';

import {ChangeEvent, FormEvent, useRef, useState} from 'react';

import {UploadIcon} from 'lucide-react';

import {Button} from './ui/button';
import {Input} from './ui/input';

type FileUploadProps = {
  onUpload: (url: string, type: 'image' | 'pdf') => void;
};

const FileUpload = ({onUpload}: FileUploadProps) => {
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url) {
      const type = url.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image';
      onUpload(url, type);
      setUrl(''); // Clear input after submission
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const type = file.type === 'application/pdf' ? 'pdf' : 'image';
      onUpload(base64, type);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input after upload
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 mt-10">
      <div className="flex w-full max-w-lg gap-2">
        <Input
          placeholder="Enter image or PDF URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <Button type="submit" disabled={!url}>
          Submit
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-neutral-500">or</div>
        <Input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}>
          <UploadIcon className="size-4" />
          Upload File
        </Button>
      </div>
    </form>
  );
};

export default FileUpload;
