declare function parseBook(element: HTMLElement): {
    title: string;
    image: string;
    url: string | null;
    author: string[];
    date: string;
    tags: string[];
};
declare function parseMovie(element: HTMLElement): {
    title: string | null;
    date: string;
    image: string;
    url: string | null;
    tags: string[];
};
declare function parseImage(element: HTMLElement): string;
declare function parseTags(element: HTMLElement): string[];
declare function parseDate(element: HTMLElement): string;
