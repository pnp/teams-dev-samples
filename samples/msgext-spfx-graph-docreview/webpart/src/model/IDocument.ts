export interface IDocument {
  name: string;
  description: string;
  modified: Date;
  nextReview: Date;
  author: string;
  key: string;
  url: string;
  urgent: boolean;
}