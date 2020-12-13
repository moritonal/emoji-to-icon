#!/usr/bin/env node
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var fontkit = require("fontkit");
var Canvas = require("canvas");
var path_1 = require("path");
var twemoji_1 = require("twemoji");
var xml2js_1 = require("xml2js");
var BaseEmojiToIconConfig = /** @class */ (function () {
    function BaseEmojiToIconConfig() {
    }
    return BaseEmojiToIconConfig;
}());
var GroupEmojiToIconConfig = /** @class */ (function (_super) {
    __extends(GroupEmojiToIconConfig, _super);
    function GroupEmojiToIconConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GroupEmojiToIconConfig;
}(BaseEmojiToIconConfig));
var InduvidualEmojiToIconConfig = /** @class */ (function (_super) {
    __extends(InduvidualEmojiToIconConfig, _super);
    function InduvidualEmojiToIconConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InduvidualEmojiToIconConfig;
}(BaseEmojiToIconConfig));
function parsePadding(config) {
    if (typeof config.padding == "number") {
        return config.padding;
    }
    else if (typeof config.padding == "string") {
        if (config.padding.endsWith("%")) {
            var percentage = Number.parseFloat(config.padding.replace("%", ""));
            return config.size * (percentage / 100.0);
        }
        else {
            throw "config.padding does not end with a %";
        }
    }
    else {
        throw "config.padding is not a number or string";
    }
}
var Emoji = /** @class */ (function () {
    function Emoji() {
    }
    Emoji.prototype.Render = function (ctx) {
    };
    Object.defineProperty(Emoji.prototype, "Width", {
        get: function () {
            return -1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Emoji.prototype, "Height", {
        get: function () {
            return -1;
        },
        enumerable: false,
        configurable: true
    });
    return Emoji;
}());
var FontKitEmoji = /** @class */ (function (_super) {
    __extends(FontKitEmoji, _super);
    function FontKitEmoji(glyph) {
        var _this = _super.call(this) || this;
        _this.glyph = glyph;
        return _this;
    }
    FontKitEmoji.prototype.Render = function (ctx) {
        ctx.fillStyle = "White";
        var path = this.glyph.path.translate(-this.glyph.bbox.minX, -this.glyph.bbox.minY);
        // For some reason they render upside-down
        ctx.translate(0, this.Height);
        ctx.scale(1, -1);
        // Render the Emoji
        var func = path.toFunction();
        ctx.beginPath();
        func(ctx);
        ctx.fill();
    };
    Object.defineProperty(FontKitEmoji.prototype, "Width", {
        get: function () {
            return this.glyph.bbox.maxX - this.glyph.bbox.minX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FontKitEmoji.prototype, "Height", {
        get: function () {
            return this.glyph.bbox.maxX - this.glyph.bbox.minX;
        },
        enumerable: false,
        configurable: true
    });
    return FontKitEmoji;
}(Emoji));
var TwitterEmoji = /** @class */ (function (_super) {
    __extends(TwitterEmoji, _super);
    function TwitterEmoji(image) {
        var _this = _super.call(this) || this;
        _this.image = image;
        return _this;
    }
    TwitterEmoji.prototype.Render = function (ctx) {
        ctx.drawImage(this.image, 0, 0);
    };
    Object.defineProperty(TwitterEmoji.prototype, "Width", {
        get: function () {
            return this.image.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TwitterEmoji.prototype, "Height", {
        get: function () {
            return this.image.height;
        },
        enumerable: false,
        configurable: true
    });
    return TwitterEmoji;
}(Emoji));
function GetTwitterEmoji(emoji) {
    return __awaiter(this, void 0, void 0, function () {
        var twitterHtml, xmlAsJs, emojiSrc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Using twemoji (Twitter) to find \"" + emoji + "\" graphic");
                    twitterHtml = twemoji_1.parse(emoji);
                    return [4 /*yield*/, new Promise(function (res, rej) {
                            xml2js_1.parseString(twitterHtml, function (e, result) {
                                if (e) {
                                    console.error("Twemoji could not parse the emoji correctly!");
                                    rej(e);
                                }
                                else {
                                    res(result);
                                }
                            });
                        })];
                case 1:
                    xmlAsJs = _a.sent();
                    emojiSrc = xmlAsJs.img.$.src;
                    return [4 /*yield*/, new Promise(function (res, rej) {
                            var img = new Canvas.Image();
                            img.onload = function () { return res(new TwitterEmoji(img)); };
                            img.onerror = function (err) {
                                console.error("Could not download emoji from twitter CDN!", err);
                                rej(err);
                            };
                            img.src = emojiSrc;
                        })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function GetEmoji(font, emoji) {
    return __awaiter(this, void 0, void 0, function () {
        var run, validGlyphs, glyph;
        return __generator(this, function (_a) {
            run = font.layout(emoji);
            if (run.glyphs.length == 0) {
                console.warn("Could not find Emoji");
                return [2 /*return*/, null];
            }
            validGlyphs = run.glyphs.filter(function (glyph) {
                return [
                    glyph.codePoints.every(function (codepoint) { return codepoint > 32; }),
                    glyph.id !== 0
                ].every(function (i) { return i; });
            });
            if (validGlyphs.length == 0) {
                console.warn("Could not find \"" + emoji + "\" emoji within the tools font library");
                return [2 /*return*/, null];
            }
            glyph = validGlyphs[0];
            return [2 /*return*/, new FontKitEmoji(glyph)];
        });
    });
}
function RenderEmoji(emoji, config) {
    return __awaiter(this, void 0, void 0, function () {
        var width, height, canvas, desiredSize, padding, ratio, outputSize, outputWidth, outputHeight, outputCanvas, offsetWidth, offsetHeight, outputCtx, outFile, out, stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof config.size != "number") {
                        throw "config.size must be a number";
                    }
                    width = emoji.Width;
                    height = emoji.Height;
                    canvas = new Canvas.Canvas(width, height);
                    // Render the emoji onto our canvas
                    emoji.Render(canvas.getContext("2d"));
                    desiredSize = config.size;
                    padding = parsePadding(config);
                    ratio = desiredSize / Math.max(width, height);
                    outputSize = Math.max(width, height) * ratio;
                    outputWidth = width * ratio;
                    outputHeight = height * ratio;
                    outputCanvas = new Canvas.Canvas(outputSize + padding, outputSize + padding);
                    offsetWidth = (outputSize - outputWidth) / 2.0;
                    offsetHeight = (outputSize - outputHeight) / 2.0;
                    outputCtx = outputCanvas.getContext("2d");
                    outputCtx.drawImage(canvas, 0, 0, width, height, offsetWidth + (padding / 2), offsetHeight + (padding / 2), outputWidth, outputHeight);
                    outFile = path_1.join(config.outDir, outputSize + "x" + outputSize + ".png");
                    if (!(fs.existsSync(config.outDir) == false)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fs.promises.mkdir(config.outDir)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    out = fs.createWriteStream(outFile);
                    stream = outputCanvas.createPNGStream();
                    stream.pipe(out);
                    return [2 /*return*/, new Promise(function (res, rej) {
                            out.on("error", function (e) {
                                console.error("Fail to render \"" + config.emoji + "\" into \"" + outFile + "\" with \"" + Math.round(padding) + "px\" of padding");
                                rej(e);
                            });
                            out.on("finish", function () {
                                res();
                                console.log("Rendered \"" + config.emoji + "\" into \"" + outFile + "\" with \"" + Math.round(padding) + "px\" of padding");
                            });
                        })];
            }
        });
    });
}
function Main(config) {
    return __awaiter(this, void 0, void 0, function () {
        var font, emoji, _a, tasks, _i, _b, key, e_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, new Promise(function (res, rej) {
                            fontkit.open(path_1.join(__dirname, '../fonts/NotoEmoji-Regular.ttf'), null, function (e, font) {
                                if (e == null) {
                                    res(font);
                                }
                                else {
                                    rej(e);
                                }
                            });
                        })];
                case 1:
                    font = _c.sent();
                    return [4 /*yield*/, GetEmoji(font, config.emoji)];
                case 2:
                    _a = (_c.sent());
                    if (_a) return [3 /*break*/, 4];
                    return [4 /*yield*/, GetTwitterEmoji(config.emoji)];
                case 3:
                    _a = (_c.sent());
                    _c.label = 4;
                case 4:
                    emoji = _a;
                    tasks = [];
                    for (_i = 0, _b = config.size; _i < _b.length; _i++) {
                        key = _b[_i];
                        tasks.push(RenderEmoji(emoji, __assign(__assign({}, config), { size: key })));
                    }
                    return [4 /*yield*/, Promise.all(tasks)];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _c.sent();
                    console.warn(e_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
var yargs = require("yargs");
var argv = yargs
    .usage("emoji-to-icon <options>")
    .example("emoji-to-icon --emoji \"\uD83D\uDC33\" --size 90 --size 120 --padding \"12%\" --outDir \"./test\"", "Renders two whale emojis at 90px and 120px with 12% of padding into the ./test dir")
    .option("emoji", {
    demandOption: true,
    type: "string",
    description: "Emoji to render"
})
    .option("size", {
    demandOption: true,
    type: "array",
    description: "Size to render in pixels"
})
    .option("padding", {
    type: "string",
    description: "Padding to add in pixels",
})
    .option("outDir", {
    demandOption: true,
    type: "string",
    description: "Directory to output to"
})
    .argv;
Main({
    emoji: argv.emoji,
    padding: argv.padding.endsWith("%") ? argv.padding : Number.parseFloat(argv.padding),
    size: argv.size.map(function (i) { return typeof i == "number" ? i : Number.parseInt(i); }),
    outDir: argv.outDir
});
//# sourceMappingURL=index.js.map