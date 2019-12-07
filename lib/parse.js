"use strict";
function parseBook(element) {
    var author = element.querySelector('.info .pub').innerText
        .trim()
        .split('/')
        .map(function (t) { return t.trim(); })
        .slice(0, 2);
    return {
        title: element.querySelector('h2').innerText.trim(),
        image: parseImage(element),
        url: element.querySelector('.pic a').getAttribute('href'),
        author: author,
        date: parseDate(element),
        tags: parseTags(element)
    };
}
function parseMovie(element) {
    var title = element.querySelector('.pic a').getAttribute('title');
    return {
        title: title,
        date: parseDate(element),
        image: parseImage(element),
        url: element.querySelector('.title a').getAttribute('href'),
        tags: parseTags(element)
    };
}
function parseImage(element) {
    return element.querySelector('.pic img').src || '';
}
function parseTags(element) {
    var tagsElement = element.querySelector('.info .tags');
    if (!tagsElement) {
        return [];
    }
    return tagsElement.innerText.split(' ').slice(1);
}
function parseDate(element) {
    var dateElement = element.querySelector('.info .date');
    if (!dateElement) {
        return '';
    }
    var matched = dateElement.innerText.match(/\d{4}-\d{2}-\d{2}/g);
    return matched ? matched[0] : '';
}
