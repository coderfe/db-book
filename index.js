const fs = require('fs');
const os = require('os');
const puppeteer = require('puppeteer-core');
const ora = require('ora');

const dbBooks = async ({ username, password, headless, executablePath }) => {
  if (!username || !password) {
    console.log('请提供用户名和密码');
    return process.exit(1);
  }

  const spinner = ora('服务正在启动').start();

  executablePath = browserPath(executablePath);
  const browser = await puppeteer.launch({
    headless,
    executablePath
  });
  const page = await browser.newPage();

  await login();

  const wish = await wishBooks();
  const dos = await readingBooks();
  const collect = await collectBooks();

  spinner.succeed('Done');
  await browser.close();
  const books = [...wish, ...dos, ...collect];
  return books;

  async function login() {
    spinner.text = `正在登录：${username}`;
    await page.goto(
      'https://accounts.douban.com/passport/login_popup?login_source=anony'
    );
    await page.click('.account-tab-account');
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('.account-form-field-submit');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    spinner.text = '登录成功...';
  }

  async function wishBooks() {
    spinner.text = '想读的书...';
    await page.goto('https://book.douban.com/mine?status=wish');
    return await resolveBooks('wish');
  }

  async function readingBooks() {
    spinner.text = '在读的书...';
    await page.goto('https://book.douban.com/mine?status=do');
    return await resolveBooks('do');
  }

  async function collectBooks() {
    spinner.text = '读过的书...';
    await page.goto('https://book.douban.com/mine?status=collect');
    return await resolveBooks('collect');
  }

  async function resolveBooks(status) {
    const books = await page.$$eval(
      '.subject-item',
      (els, status) => {
        return els.map(item => {
          return {
            status,
            img: item.getElementsByTagName('img')[0].src,
            title: item
              .getElementsByTagName('h2')[0]
              .textContent.replace(/\s/g, ''),
            author: item
              .getElementsByClassName('pub')[0]
              .textContent.split('/')[0]
              .trim(),
            comment: item
              .getElementsByClassName('comment')[0]
              .textContent.trim(),
            tags: item.getElementsByClassName('tags')[0]
              ? item
                  .getElementsByClassName('tags')[0]
                  .textContent.replace(/\n/g, '')
                  .split(': ')[1]
                  .split(' ')
              : [],
            date: item.getElementsByClassName('date')[0]
              ? item
                  .getElementsByClassName('date')[0]
                  .textContent.match(/\d{4}-\d{2}-\d{2}/)[0]
              : '',
            url: item.getElementsByTagName('a')[0].href
          };
        });
      },
      status
    );
    const nextBtn = await page.evaluate(() => {
      const el = document.querySelector('.paginator .next a');
      if (el) return true;
      return false;
    });
    if (!nextBtn) return books;
    await page.click('.paginator .next a');
    await page.waitForSelector('.subject-item');
    const data = await resolveBooks(status);
    return books.concat(data);
  }
};

module.exports = dbBooks;

function browserPath(executablePath) {
  const platform = os.platform();
  const WIN =
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
  const LINUX = '/opt/google/chrome/google-chrome';
  const MAC = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  if (!executablePath) {
    switch (platform) {
      case 'win32':
        executablePath = WIN;
      case 'linux':
        executablePath = LINUX;
      case 'darwin':
        executablePath = MAC;
    }
  }

  if (fs.existsSync(executablePath)) {
    return executablePath;
  }
  console.log('请安装 Chrome 浏览器');
  process.exit(1);
}
