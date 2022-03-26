[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine)

# Twitter scraper

## Development

## Adding add-on to Firefox

1. In your Firefox browser go to `about:debugging`
2. Click **This Firefox**
3. Press **Load Temporary Add-on** button
4. Select `twitter-scraper/manifest.json` in file explorer

### Reloading extension

After making changes to the add-on you have to reload it.

1. In your Firefox browser go to `about:debugging`
2. Click **This Firefox**
3. Find add-on in the list
4. Press **Reload**

### For WSL users

On WSL you need to export your files from WSL filesystem to Windows filesystem,
as you can't select add-on's `manifest.json` from WSL filesystem.

There is a `wslexport.sh` script that hepls with exporting files.
Use `./wslexport /path/to/export`. For example: `/mnt/c/Users/<username>/Documents`.

Alternatively, set `ADDONEXPORTPATH` environment variable to path where you want to export the files to. Then use `./wslexport.sh`.

#### Nodemon

You can use `nodemon` to automatically execute `wslexport.sh` script on file changes:

`npx nodemon --watch . --ext js,json,html,css --exec ./wslexport.sh`

### Formatting

Use [**Prettier**](https://prettier.io/) for formatting your code.
It is available as a VS Code extension as well.
