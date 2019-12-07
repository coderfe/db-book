function parseBook(element: HTMLElement) {
  const author = (element.querySelector('.info .pub') as HTMLElement).innerText
    .trim()
    .split('/')
    .map(t => t.trim())
    .slice(0, 2);

  return {
    title: (element.querySelector('h2') as HTMLElement).innerText.trim(),
    image: parseImage(element),
    url: (element.querySelector('.pic a') as HTMLElement).getAttribute('href'),
    author,
    date: parseDate(element),
    tags: parseTags(element)
  };
}

function parseMovie(element: HTMLElement) {
  const title = (element.querySelector('.pic a') as HTMLElement).getAttribute(
    'title'
  );

  return {
    title,
    date: parseDate(element),
    image: parseImage(element),
    url: (element.querySelector('.title a') as HTMLElement).getAttribute(
      'href'
    ),
    tags: parseTags(element)
  };
}

function parseImage(element: HTMLElement) {
  return (element.querySelector('.pic img') as HTMLImageElement).src || '';
}

function parseTags(element: HTMLElement) {
  const tagsElement = element.querySelector('.info .tags') as HTMLElement;

  if (!tagsElement) {
    return [];
  }
  return tagsElement.innerText.split(' ').slice(1);
}

function parseDate(element: HTMLElement) {
  const dateElement = element.querySelector('.info .date') as HTMLElement;

  if (!dateElement) {
    return '';
  }
  const matched = dateElement.innerText.match(/\d{4}-\d{2}-\d{2}/g);
  return matched ? matched[0] : '';
}
