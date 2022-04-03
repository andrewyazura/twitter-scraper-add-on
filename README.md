[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine)

# Twitter scraper

## Development

### Adding add-on to Firefox

1. In your Firefox browser go to `about:debugging`
2. Click **This Firefox**
3. Press **Load Temporary Add-on** button
4. Select `twitter-scraper/manifest.json` in file explorer

You have to reload the add-on after making changes to it.
To do this press **Reload** on the same page.

### Auto-reload

> This method doesn't work for WSL users

1. Install [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug) extension in VS Code
2. In your Firefox browser go to `about:profiles`
3. Add a profile named `twitter-scraper`
4. Run `Launch WebExtension` config in VS Code

### For WSL users

On WSL you need to export your files from WSL filesystem to Windows filesystem, as you can't select add-on's `manifest.json` from WSL filesystem.

There is a `wslexport.sh` script that hepls with exporting files.
Use `./wslexport /path/to/export`. For example: `/mnt/c/Users/<username>/Documents`.

Alternatively, set `ADDONEXPORTPATH` environment variable to path where you want to export the files to. Then use `./wslexport.sh`.

#### Nodemon

You can use `nodemon` to automatically execute `wslexport.sh` script on file changes:

`npx nodemon --watch . --ext js,json,html --exec ./wslexport.sh`

## Formatting

Use [**Prettier**](https://prettier.io/) for formatting your code.
It is available as a VS Code extension as well.
