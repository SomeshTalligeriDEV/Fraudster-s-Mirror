'use client';

import * as React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

interface FileUploaderProps extends DropzoneOptions {
  value?: File[];
  onValueChange?: (value: File[]) => void;
  maxSize?: number;
}

export function FileUploader({
  value = [],
  onValueChange,
  maxFiles = 1,
  maxSize = 1024 * 1024,
  ...props
}: FileUploaderProps) {
  const { toast } = useToast();

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      const newFiles = [...value, ...acceptedFiles];
      onValueChange?.(newFiles.slice(0, maxFiles));

      if (rejectedFiles.length > 0) {
        toast({
          title: 'File rejected',
          description: 'File is too large or type is not supported.',
          variant: 'destructive',
        });
      }
    },
    [value, onValueChange, maxFiles, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    ...props,
  });

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onValueChange?.(newFiles);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors',
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-input hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mb-2 h-10 w-10 text-muted-foreground" />
        <p className="font-semibold text-foreground">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-sm text-muted-foreground">
          Supports PDF, JPG, PNG up to {maxSize / 1024 / 1024}MB. Max {maxFiles} files.
        </p>
      </div>
      {value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map((file, index) => (
            <div
              key={file.name + index}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex items-center gap-2">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
