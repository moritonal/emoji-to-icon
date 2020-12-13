#!/usr/bin/env node

import * as fs from "fs"
import * as fontkit from "fontkit"
import * as Canvas from "canvas";
import { join } from "path"
import { parse } from "twemoji";
import { parseString } from "xml2js"

class BaseEmojiToIconConfig {
    emoji: string
    padding: number | string
    outDir: string
}

class GroupEmojiToIconConfig extends BaseEmojiToIconConfig {
    size: number[]
}

class InduvidualEmojiToIconConfig extends BaseEmojiToIconConfig {
    size: number
}


function parsePadding(config: InduvidualEmojiToIconConfig) {
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

class Emoji {

    Render(ctx: Canvas.CanvasRenderingContext2D) {

    }

    get Width() {

        return -1;
    }

    get Height() {

        return -1;
    }
}

class FontKitEmoji extends Emoji {

    glyph: fontkit.Glyph;

    constructor(glyph: fontkit.Glyph) {
        super();

        this.glyph = glyph;
    }

    Render(ctx: Canvas.CanvasRenderingContext2D) {

        ctx.fillStyle = "White";
        var path = this.glyph.path.translate(
            -this.glyph.bbox.minX,
            -this.glyph.bbox.minY);

        // For some reason they render upside-down
        ctx.translate(0, this.Height);
        ctx.scale(1, -1);

        // Render the Emoji
        const func = path.toFunction();
        ctx.beginPath();
        func(ctx);
        ctx.fill();
    }

    get Width() {

        return this.glyph.bbox.maxX - this.glyph.bbox.minX;
    }

    get Height() {

        return this.glyph.bbox.maxX - this.glyph.bbox.minX;
    }
}

class TwitterEmoji extends Emoji {

    image: Canvas.Image;

    constructor(image: Canvas.Image) {
        super();
        this.image = image;
    }

    Render(ctx: Canvas.CanvasRenderingContext2D) {
        ctx.drawImage(this.image, 0, 0);
    }

    get Width() {

        return this.image.width;
    }

    get Height() {

        return this.image.height;
    }
}
async function GetTwitterEmoji(emoji: string): Promise<Emoji> {

    console.log(`Using twemoji (Twitter) to find "${emoji}" graphic`);

    var twitterHtml = parse(emoji);

    var xmlAsJs: any = await new Promise((res, rej) => {
        parseString(twitterHtml, (e, result) => {
            if (e) {
                console.error(`Twemoji could not parse the emoji correctly!`);
                rej(e);
            }
            else {
                res(result);
            }
        });
    });

    const emojiSrc = xmlAsJs.img.$.src;

    return await new Promise((res, rej) => {

        const img = new Canvas.Image();

        img.onload = () => res(new TwitterEmoji(img));

        img.onerror = err => {
            console.error(`Could not download emoji from twitter CDN!`, err);
            rej(err);
        }

        img.src = emojiSrc
    });
}

async function GetEmoji(font: fontkit.Font, emoji: string): Promise<Emoji> {

    const run = font.layout(emoji);

    if (run.glyphs.length == 0) {

        console.warn("Could not find Emoji");

        return null;
    }

    var validGlyphs = run.glyphs.filter(glyph => {
        return [
            glyph.codePoints.every(codepoint => codepoint > 32),
            glyph.id !== 0
        ].every(i => i)
    });

    if (validGlyphs.length == 0) {

        console.warn(`Could not find "${emoji}" emoji within the tools font library`);

        return null;
    }

    const glyph = validGlyphs[0];

    return new FontKitEmoji(glyph);
}

async function RenderEmoji(emoji: Emoji, config: InduvidualEmojiToIconConfig): Promise<void> {

    if (typeof config.size != "number") {
        throw "config.size must be a number";
    }

    const width = emoji.Width;
    const height = emoji.Height;

    const canvas = new Canvas.Canvas(
        width,
        height);

    // Render the emoji onto our canvas
    emoji.Render(canvas.getContext("2d"));

    const desiredSize = config.size;
    const padding = parsePadding(config);

    // Re-render it into another canvas with scaling and padding
    const ratio = desiredSize / Math.max(width, height);

    // Make it square
    const outputSize = Math.max(width, height) * ratio;

    const outputWidth = width * ratio;
    const outputHeight = height * ratio;

    const outputCanvas = new Canvas.Canvas(
        outputSize + padding,
        outputSize + padding);

    const offsetWidth = (outputSize - outputWidth) / 2.0;
    const offsetHeight = (outputSize - outputHeight) / 2.0;

    const outputCtx = outputCanvas.getContext("2d");
    outputCtx.drawImage(canvas,
        0, 0, width, height,
        offsetWidth + (padding / 2), offsetHeight + (padding / 2), outputWidth, outputHeight);

    const outFile = join(config.outDir, `${outputSize}x${outputSize}.png`);

    if (fs.existsSync(config.outDir) == false) {
        await fs.promises.mkdir(config.outDir);
    }

    // Output to a file
    const out = fs.createWriteStream(outFile);
    const stream = outputCanvas.createPNGStream();

    stream.pipe(out);

    return new Promise<void>((res, rej) => {

        out.on("error", (e) => {
            console.error(`Fail to render "${config.emoji}" into "${outFile}" with "${Math.round(padding)}px" of padding`);
            rej(e);
        });

        out.on("finish", () => {
            res();
            console.log(`Rendered "${config.emoji}" into "${outFile}" with "${Math.round(padding)}px" of padding`);
        });
    });
}

async function Main(config: GroupEmojiToIconConfig) {
    try {

        const font: fontkit.Font = await new Promise((res, rej) => {

            (fontkit as any).open(join(__dirname, '../fonts/NotoEmoji-Regular.ttf'), null, (e: Error, font: fontkit.Font) => {

                if (e == null) {
                    res(font);
                }
                else {
                    rej(e);
                }
            });
        });

        const emoji = await GetEmoji(font, config.emoji) || await GetTwitterEmoji(config.emoji)

        var tasks: Promise<void>[] = [];

        for (var key of config.size) {

            tasks.push(RenderEmoji(emoji, {
                ...config,
                size: key
            }));
        }

        await Promise.all(tasks);
    }
    catch (e) {
        console.warn(e);
    }
}

import * as yargs from "yargs"

const argv = yargs
    .usage(`emoji-to-icon <options>`)
    .example(`emoji-to-icon --emoji "🐳" --size 90 --size 120 --padding "12%" --outDir "./test"`, "Renders two whale emojis at 90px and 120px with 12% of padding into the ./test dir")
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
    .argv

Main({
    emoji: argv.emoji,
    padding: argv.padding.endsWith("%") ? argv.padding : Number.parseFloat(argv.padding),
    size: argv.size.map(i => typeof i == "number" ? i : Number.parseInt(i)),
    outDir: argv.outDir
});