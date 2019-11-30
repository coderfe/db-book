interface Option {
  username: string;
  password: string;
  executablePath: string;
  headless: boolean;
}

interface Book {
  status: 'wish' | 'do' | 'collect';
  img: string;
  title: string;
  author: string;
  comment: string;
  tags: string[];
  date: string;
  url: string;
}

declare function dbBooks(option: Option): Promise<Book[]>;

export = dbBooks;
