declare namespace DoubanInterest {
    type InterestType = 'book' | 'movie';
    type FlagStatus = 'do' | 'wish' | 'collect';
    interface Book {
        title: string;
        image: string;
        url: string;
        author: string[];
        date: string;
        tags: string[];
        status: FlagStatus;
    }
    interface Movie {
        title: string;
        date: string;
        image: string;
        url: string;
        tags: string[];
        status: FlagStatus;
    }
    interface Options {
        userId: string;
        interestTypes?: InterestType[];
        flagStatus?: FlagStatus[];
        headless?: boolean;
        afterPaginationParsed?: (interestType: InterestType, flagStatus: FlagStatus, page: number) => void;
        afterInterestParsed?: (type: InterestType) => void;
    }
}
export default function douban(options: DoubanInterest.Options): Promise<{
    movie?: DoubanInterest.Movie[] | undefined;
    book?: DoubanInterest.Book[] | undefined;
}>;
export {};
