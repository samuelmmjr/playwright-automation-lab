export interface CreateUserResponse {
  userID: string;
  username: string;
  books: unknown[];
}

export interface GenerateTokenResponse {
  token: string;
  expires: string;
  status: string;
  result: string;
}

export interface Book {
  isbn: string;
  title: string;
  subTitle?: string;
  author?: string;
  publish_date?: string;
  publisher?: string;
  pages?: number;
  description?: string;
  website?: string;
}

export interface BooksResponse {
  books: Book[];
}

export interface AddBooksResponse {
  books: Array<{
    isbn: string;
  }>;
}

export interface UserResponse {
  userId: string;
  username: string;
  books: Book[];
}