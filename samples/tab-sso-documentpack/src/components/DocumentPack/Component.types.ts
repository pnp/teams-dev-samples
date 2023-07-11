export interface IUploadableFile {
  id: number;
  file: File;  
  name: string;
  size: number;
  type: string;
  errors?: any[];
  
}

