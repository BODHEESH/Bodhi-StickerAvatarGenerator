// React types
declare module 'react';
declare module 'react-dom';

// React-dropzone types
declare module 'react-dropzone' {
  import { ComponentType } from 'react';

  export interface Accept {
    [key: string]: string[];
  }

  export interface DropzoneProps {
    accept?: Accept;
    children?: React.ReactNode;
    disabled?: boolean;
    getFilesFromEvent?: (event: any) => Promise<File[]>;
    maxFiles?: number;
    maxSize?: number;
    minSize?: number;
    multiple?: boolean;
    onDragEnter?: (event: React.DragEvent<HTMLElement>) => void;
    onDragLeave?: (event: React.DragEvent<HTMLElement>) => void;
    onDragOver?: (event: React.DragEvent<HTMLElement>) => void;
    onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[], event: React.DragEvent<HTMLElement>) => void;
    onDropAccepted?: (files: File[], event: React.DragEvent<HTMLElement>) => void;
    onDropRejected?: (fileRejections: FileRejection[], event: React.DragEvent<HTMLElement>) => void;
    onFileDialogCancel?: () => void;
    preventDropOnDocument?: boolean;
    validator?: (file: File) => { code: string; message: string } | null;
  }

  export interface FileRejection {
    file: File;
    errors: {
      code: string;
      message: string;
    }[];
  }

  export interface DropzoneState {
    acceptedFiles: File[];
    fileRejections: FileRejection[];
    isDragActive: boolean;
    isDragAccept: boolean;
    isDragReject: boolean;
    isFileDialogActive: boolean;
    isFocused: boolean;
    getRootProps: (props?: any) => any;
    getInputProps: (props?: any) => any;
    open: () => void;
  }

  export function useDropzone(props?: DropzoneProps): DropzoneState;
}
