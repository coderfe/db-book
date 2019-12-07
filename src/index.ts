import { resolve } from 'path';
import puppeteer from 'puppeteer';

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
    afterPaginationParsed?: (
      interestType: InterestType,
      flagStatus: FlagStatus,
      page: number
    ) => void;
    afterInterestParsed?: (type: InterestType) => void;
  }
}
declare function parseBook(): DoubanInterest.Book;
declare function parseMovie(): DoubanInterest.Movie;

const defaultInterestType: DoubanInterest.InterestType[] = ['book', 'movie'];
const defaultFlagStatus: DoubanInterest.FlagStatus[] = [
  'do',
  'wish',
  'collect'
];

export default async function douban(options: DoubanInterest.Options) {
  const {
    flagStatus,
    interestTypes,
    userId,
    headless,
    afterPaginationParsed,
    afterInterestParsed
  } = {
    interestTypes: defaultInterestType,
    flagStatus: defaultFlagStatus,
    headless: true,
    ...options
  };

  if (!userId) {
    console.error('userId is required');
    process.exit(1);
  }
  const urlFor = (
    type: DoubanInterest.InterestType,
    stat: DoubanInterest.FlagStatus
  ) => `https://${type}.douban.com/people/${userId}/${stat}`;

  const browser = await puppeteer.launch({
    headless: headless
  });
  const page = await browser.newPage();

  const result: {
    movie: DoubanInterest.Movie[];
    book: DoubanInterest.Book[];
  } = { movie: [], book: [] };

  for (const type of interestTypes) {
    for (const status of flagStatus) {
      await page.goto(urlFor(type, status));
      await page.waitForSelector('#content');

      await parsePage(type, status);
    }

    if (typeof afterInterestParsed === 'function') afterInterestParsed(type);
  }
  await browser.close();
  return result;

  /**
   * 解析图书或电影页面
   * @param type 图书或电影
   * @param status 图书或电影的标记状态
   */
  async function parsePage(
    type: DoubanInterest.InterestType,
    status: DoubanInterest.FlagStatus
  ) {
    let hasNext = true;
    while (hasNext) {
      await page.waitForSelector('#content');

      let currentPage = 1;
      if (await page.$('.thispage')) {
        currentPage = await page.$eval('.thispage', el =>
          Number((el as HTMLElement).innerText)
        );
      }

      await parsePagination(type, status);
      if (afterPaginationParsed)
        afterPaginationParsed(type, status, currentPage);

      hasNext = Boolean(await page.$('.paginator .next a'));
      if (hasNext) {
        await page.click('.paginator .next');
      }
    }
  }

  /**
   * 分页解析
   * @param type 图书或电影
   * @param status 图书或电影的标记状态
   */
  async function parsePagination(
    type: DoubanInterest.InterestType,
    status: DoubanInterest.FlagStatus
  ) {
    await page.addScriptTag({
      path: resolve(__dirname, 'parse.js')
    });
    switch (type) {
      case 'book':
        const currentPageBooks = await evalBook();
        result.book.push(...currentPageBooks.map(b => ({ ...b, status })));
        break;
      case 'movie':
        const currentPageMovies = await evalMovie();
        result.movie.push(...currentPageMovies.map(m => ({ ...m, status })));
        break;
    }
  }

  /**
   * 解析图书
   */
  async function evalBook() {
    return await page.$$eval('.subject-item', elements =>
      elements.map(parseBook)
    );
  }

  /**
   * 解析电影
   */
  async function evalMovie() {
    return await page.$$eval('.grid-view .item', elements =>
      elements.map(parseMovie)
    );
  }
}
