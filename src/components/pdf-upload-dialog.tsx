'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { FileIcon, Upload, UploadIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/axios';

interface FileWithPreview extends File {
  preview?: string;
}

export function PdfUploadDialog() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const validFiles: FileWithPreview[] = [];

    Array.from(fileList).forEach((file) => {
      if (file.type === 'application/pdf') {
        validFiles.push(file);
      }
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      });

      const response = await axiosInstance.post('/invoices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Files uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setOpen(false);
      setFiles([]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload /> Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Upload PDF Files</DialogTitle>
          <DialogDescription>
            Drag and drop your PDF files or click to browse
          </DialogDescription>
        </DialogHeader>
        <div
          className={cn(
            'relative mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center',
            dragActive ? 'border-primary bg-primary/5' : '',
            files.length > 0 ? 'h-[250px] overflow-y-auto' : ''
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type='file'
            accept='application/pdf'
            multiple
            className='hidden'
            onChange={handleChange}
          />

          {files.length > 0 ? (
            <div className='w-full space-y-4'>
              {files.map((file, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded-md border p-3'
                >
                  <div className='flex items-center space-x-3'>
                    <FileIcon className='h-8 w-8 text-primary' />
                    <div className='text-left'>
                      <p className='text-sm font-medium'>{file.name}</p>
                      <p className='text-xs text-gray-500'>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    onClick={() => removeFile(index)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className='mb-4 rounded-full bg-primary/10 p-4'>
                <UploadIcon className='h-8 w-8 text-primary' />
              </div>
              <p className='mb-2 text-sm font-medium'>
                Drag and drop your PDF files here
              </p>
              <p className='text-xs text-gray-500'>
                Only PDF files are supported
              </p>
              <Button
                variant='secondary'
                className='mt-4'
                onClick={onButtonClick}
              >
                Browse Files
              </Button>
            </>
          )}
        </div>
        <DialogFooter className='flex items-center justify-between sm:justify-between'>
          <p className='text-xs text-gray-500'>
            {files.length > 0
              ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
              : 'No files selected'}
          </p>
          <Button
            type='submit'
            disabled={files.length === 0}
            onClick={handleSubmit}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
