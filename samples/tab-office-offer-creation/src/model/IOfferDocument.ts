export interface IOfferDocument {
  name: string;
  description: string;
  modified: Date;
  author: string;
  id: string;
  fileId?: string;
  url: string;
  reviewer?: string;
  reviewedOn?: Date;
  publisher?: string;
  publishedOn?: Date;
  publishedFileUrl?: string;
}