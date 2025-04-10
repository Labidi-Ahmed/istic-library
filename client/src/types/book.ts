export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  published_date?: string;
  available: boolean;
}
