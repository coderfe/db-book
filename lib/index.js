"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var puppeteer_1 = __importDefault(require("puppeteer"));
var defaultInterestType = ['book', 'movie'];
var defaultFlagStatus = [
    'do',
    'wish',
    'collect'
];
function douban(options) {
    return __awaiter(this, void 0, void 0, function () {
        /**
         * 解析图书或电影页面
         * @param type 图书或电影
         * @param status 图书或电影的标记状态
         */
        function parsePage(type, status) {
            return __awaiter(this, void 0, void 0, function () {
                var hasNext, currentPage, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            hasNext = true;
                            _b.label = 1;
                        case 1:
                            if (!hasNext) return [3 /*break*/, 10];
                            return [4 /*yield*/, page.waitForSelector('#content')];
                        case 2:
                            _b.sent();
                            currentPage = 1;
                            return [4 /*yield*/, page.$('.thispage')];
                        case 3:
                            if (!_b.sent()) return [3 /*break*/, 5];
                            return [4 /*yield*/, page.$eval('.thispage', function (el) {
                                    return Number(el.innerText);
                                })];
                        case 4:
                            currentPage = _b.sent();
                            _b.label = 5;
                        case 5: return [4 /*yield*/, parsePagination(type, status)];
                        case 6:
                            _b.sent();
                            if (afterPaginationParsed)
                                afterPaginationParsed(type, status, currentPage);
                            _a = Boolean;
                            return [4 /*yield*/, page.$('.paginator .next a')];
                        case 7:
                            hasNext = _a.apply(void 0, [_b.sent()]);
                            if (!hasNext) return [3 /*break*/, 9];
                            return [4 /*yield*/, page.click('.paginator .next')];
                        case 8:
                            _b.sent();
                            _b.label = 9;
                        case 9: return [3 /*break*/, 1];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        }
        /**
         * 分页解析
         * @param type 图书或电影
         * @param status 图书或电影的标记状态
         */
        function parsePagination(type, status) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, currentPageBooks, currentPageMovies;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, page.addScriptTag({
                                path: path_1.resolve(__dirname, 'parse.js')
                            })];
                        case 1:
                            _d.sent();
                            _a = type;
                            switch (_a) {
                                case 'book': return [3 /*break*/, 2];
                                case 'movie': return [3 /*break*/, 4];
                            }
                            return [3 /*break*/, 6];
                        case 2: return [4 /*yield*/, evalBook()];
                        case 3:
                            currentPageBooks = _d.sent();
                            if (!result.book)
                                result.book = [];
                            (_b = result.book).push.apply(_b, currentPageBooks.map(function (b) { return (__assign(__assign({}, b), { status: status })); }));
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, evalMovie()];
                        case 5:
                            currentPageMovies = _d.sent();
                            if (!result.movie)
                                result.movie = [];
                            (_c = result.movie).push.apply(_c, currentPageMovies.map(function (m) { return (__assign(__assign({}, m), { status: status })); }));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
        /**
         * 解析图书
         */
        function evalBook() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.$$eval('.subject-item', function (elements) {
                                return elements.map(parseBook);
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }
        /**
         * 解析电影
         */
        function evalMovie() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.$$eval('.grid-view .item', function (elements) {
                                return elements.map(parseMovie);
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }
        var _a, flagStatus, interestTypes, userId, headless, afterPaginationParsed, afterInterestParsed, urlFor, browser, page, result, _i, interestTypes_1, type, _b, flagStatus_1, status_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = __assign({ interestTypes: defaultInterestType, flagStatus: defaultFlagStatus, headless: true }, options), flagStatus = _a.flagStatus, interestTypes = _a.interestTypes, userId = _a.userId, headless = _a.headless, afterPaginationParsed = _a.afterPaginationParsed, afterInterestParsed = _a.afterInterestParsed;
                    if (!userId) {
                        console.log('userId is required');
                        process.exit(1);
                    }
                    urlFor = function (type, stat) { return "https://" + type + ".douban.com/people/" + userId + "/" + stat; };
                    return [4 /*yield*/, puppeteer_1.default.launch({
                            headless: headless
                        })];
                case 1:
                    browser = _c.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _c.sent();
                    result = {};
                    _i = 0, interestTypes_1 = interestTypes;
                    _c.label = 3;
                case 3:
                    if (!(_i < interestTypes_1.length)) return [3 /*break*/, 11];
                    type = interestTypes_1[_i];
                    _b = 0, flagStatus_1 = flagStatus;
                    _c.label = 4;
                case 4:
                    if (!(_b < flagStatus_1.length)) return [3 /*break*/, 9];
                    status_1 = flagStatus_1[_b];
                    return [4 /*yield*/, page.goto(urlFor(type, status_1))];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, page.waitForSelector('#content')];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, parsePage(type, status_1)];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8:
                    _b++;
                    return [3 /*break*/, 4];
                case 9:
                    if (typeof afterInterestParsed === 'function')
                        afterInterestParsed(type);
                    _c.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 3];
                case 11: return [4 /*yield*/, browser.close()];
                case 12:
                    _c.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.default = douban;
