'use client';

import type React from 'react';

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
import { usePdfUpload } from '@/hooks/use-pdf-upload';
import { cn } from '@/lib/utils';

export function PdfUploadDialog() {
  const {
    open,
    setOpen,
    dragActive,
    files,
    handleDrag,
    handleDrop,
    inputRef,
    handleChange,
    formatFileSize,
    removeFile,
    onButtonClick,
    isPending,
    handleSubmit,
  } = usePdfUpload();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload /> Salvar Faturas
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Fazer upload de arquivos PDF</DialogTitle>
          <DialogDescription>
            Arraste e solte seus arquivos PDF ou clique para navegar pelos
            arquivos locais
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
                Arraste e solte seus arquivos PDF aqui
              </p>
              <p className='text-xs text-gray-500'>
                Apenas arquivos PDF são suportados
              </p>
              <Button
                variant='secondary'
                className='mt-4'
                onClick={onButtonClick}
              >
                Navegar Arquivos
              </Button>
            </>
          )}
        </div>
        <DialogFooter className='flex items-center justify-between sm:justify-between'>
          <p className='text-xs text-gray-500'>
            {files.length > 0
              ? `${files.length} arquivo(s) selecionado(s)`
              : 'Nenhum arquivo selecionado'}
          </p>
          <Button
            type='submit'
            disabled={files.length === 0 || isPending}
            onClick={handleSubmit}
          >
            Fazer upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
