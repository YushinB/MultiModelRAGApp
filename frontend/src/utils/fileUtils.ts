import { UploadedFile } from '../types';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const processFiles = async (files: FileList | null): Promise<UploadedFile[]> => {
  if (!files) return [];

  const processedFiles: UploadedFile[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const base64Data = await fileToBase64(file);
      processedFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        mimeType: file.type,
        data: base64Data,
        size: file.size,
        status: 'pending'
      });
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
    }
  }

  return processedFiles;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIconType = (mimeType: string) => {
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('image')) return 'image';
  if (mimeType.includes('text')) return 'text';
  return 'file';
};