# Usage

Tool for generating a PNG of an emoji at various sizes. Mostly designed to generate favicons for websites and WebManifests.

```
emoji-to-icon <options>

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --emoji    Emoji to render                                 [string] [required]
  --size     Size to render in pixels                         [array] [required]
  --padding  Padding to add in pixels                                   [string]
  --outDir   Directory to output to                          [string] [required]

Examples:
  emoji-to-icon --emoji "🐳" --size 90      Renders two whale emojis at 90px and
  --size 120 --padding "12%" --outDir       120px with 12% of padding into the
  "./test"                                  ./test dir
  ```

# FAQ

## Why can you not find an emoji but can render it in the console!

This tool uses the `NotoEmoji-Regular` font which is open-source from Google. Sometimes this is out of sync with the licensed fonts installed in your console.

## Whats Twitter got to do with this?

If the tool cannot find an emoji witihn it's font (which is five years old now) then it uses twemoji to download a png of the emoji from a CDN.

## Why not use the latest `NotoColorEmoji.tff`?

Be my guest friend, but note you'll first have to add CBLC/CBDT support to `fontkit`. You might find it tricky given the format was used by Google in Noto, but the only docs I found were by Microsoft [here](https://docs.microsoft.com/en-us/typography/opentype/spec/cbdt).

# Development

Standard `Node` project with `Typscript`. It was developed inside a VSCode `.devcontainer` so you should be able to just use `Remote-Containers` to open it and all the tools will be installed. VSCode tasks and launches used for debugging.

PR's welcome.
