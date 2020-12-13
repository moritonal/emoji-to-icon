#!/usr/bin/env node

import * as fs from "fs"
import * as fontkit from "fontkit"
import * as Canvas from "canvas";
import { join } from "path"

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

async function RenderEmoji(font: fontkit.Font, config: InduvidualEmojiToIconConfig): Promise<void> {

    if (typeof config.size != "number") {
        throw "config.size must be a number";
    }

    const run = font.layout(config.emoji);

    if (run.glyphs.length == 0) {
        console.log("Could not find Emoji");
        return
    }

    const glyph = run.glyphs[0];

    const width = glyph.bbox.maxX - glyph.bbox.minX;
    const height = glyph.bbox.maxY - glyph.bbox.minY;

    const canvas = new Canvas.Canvas(
        width,
        height);

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "White";

    var path = glyph.path.translate(
        -glyph.bbox.minX,
        -glyph.bbox.minY);

    // For some reason they render upside-down
    ctx.translate(0, height);
    ctx.scale(1, -1);

    // Render the Emoji
    const func = path.toFunction();
    ctx.beginPath();
    func(ctx);
    ctx.fill();

    const desiredSize = config.size;
    const padding = parsePadding(config);

    // Re-render it into another canvas with scaling and padding
    const ratio = desiredSize / Math.max(width, height);

    // Make it square
    const outputSize = Math.max(width, height) * ratio;

    const outputWidth = width * ratio;
    const outputHeight = height * ratio;

    const offsetWidth = (outputSize - outputWidth) / 2.0;
    const offsetHeight = (outputSize - outputHeight) / 2.0;

    const outputCanvas = new Canvas.Canvas(
        outputSize + padding,
        outputSize + padding);

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

        var tasks: Promise<void>[] = [];

        for (var key of config.size) {

            tasks.push(RenderEmoji(font, {
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