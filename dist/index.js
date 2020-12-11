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
function RenderEmoji(font, config) {
    return __awaiter(this, void 0, void 0, function () {
        var run, glyph, width, height, canvas, ctx, path, func, desiredSize, padding, ratio, outputSize, outputWidth, outputHeight, offsetWidth, offsetHeight, outputCanvas, outputCtx, outFile, out, stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof config.size != "number") {
                        throw "config.size must be a number";
                    }
                    run = font.layout(config.emoji);
                    if (run.glyphs.length == 0) {
                        console.log("Could not find Emoji");
                        return [2 /*return*/];
                    }
                    glyph = run.glyphs[0];
                    width = glyph.bbox.maxX - glyph.bbox.minX;
                    height = glyph.bbox.maxY - glyph.bbox.minY;
                    canvas = new Canvas.Canvas(width, height);
                    ctx = canvas.getContext("2d");
                    ctx.fillStyle = "White";
                    path = glyph.path.translate(-glyph.bbox.minX, -glyph.bbox.minY);
                    // For some reason they render upside-down
                    ctx.translate(0, height);
                    ctx.scale(1, -1);
                    func = path.toFunction();
                    ctx.beginPath();
                    func(ctx);
                    ctx.fill();
                    desiredSize = config.size;
                    padding = parsePadding(config);
                    ratio = desiredSize / Math.max(width, height);
                    outputSize = Math.max(width, height) * ratio;
                    outputWidth = width * ratio;
                    outputHeight = height * ratio;
                    offsetWidth = (outputSize - outputWidth) / 2.0;
                    offsetHeight = (outputSize - outputHeight) / 2.0;
                    outputCanvas = new Canvas.Canvas(outputSize + padding, outputSize + padding);
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
        var font, tasks, _i, _a, key, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, new Promise(function (res, rej) {
                            fontkit.open('./fonts/NotoEmoji-Regular.ttf', null, function (e, font) {
                                if (e == null) {
                                    res(font);
                                }
                                else {
                                    rej(e);
                                }
                            });
                        })];
                case 1:
                    font = _b.sent();
                    tasks = [];
                    for (_i = 0, _a = config.size; _i < _a.length; _i++) {
                        key = _a[_i];
                        tasks.push(RenderEmoji(font, __assign(__assign({}, config), { size: key })));
                    }
                    return [4 /*yield*/, Promise.all(tasks)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    console.warn(e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
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