# gh-loader
gh-loader is a simple drop-in javascript which can in turn load js and css files from gist(s) & github repos

* Namepace `gh` with `debug` and `log`, helpers.
* Supports multiple gists & files (just add gist id or repo file path to `gh` array)
* Supports multi-file gists (automatically loads all .js and .css files from a gist)
* Support for remote loading (via githack.com) of content when content is truncated or from a repo
* Creates a console group for each gist file or repo file to capture any `console.*` statements
* Provides data attributes for embedded HTML
* Supports debugging with `debug` flag

## Usage

`load()` is the main entry point for gh-loader. The value(s) passed to `load()` can contain either string IDs of gists or paths to files in github repositories.  You do not need to pass the full or raw URLs.

`"https://gist.github.com/<user>/<id>"`

`"https://github.com/<user>/<repo>/blob/<branch>/<path>/<file.ext>"`

```javascript
load("80679d7b3a1c17420e51c97d5f01e302")
```

```javascript
load([
  "93883bb7ad7de7b9bc62",
  "80679d7b3a1c17420e51c97d5f01e302",
  "jquery/jquery-ui/blob/main/ui/scroll-parent.js"
])
```

### ES Module

1. [Download ghl.min.js](https://raw.githubusercontent.com/thedannywahl/gh-loader/refs/heads/main/dist/ghl.min.js)
2. Edit `ghl.min.js` and change the string in `load()` to point to your files.
3. Add `ghl.min.js` to your site.

### UMD

1. [Download ghl.min.umd.cjs](https://raw.githubusercontent.com/thedannywahl/gh-loader/refs/heads/main/dist/ghl.min.umd.cjs)
2. Edit `ghl.min.umd.cjs` and change the string at the end of the IIFE statement to point to your files.
3. Add `ghl.min.umd.cjs` to your site

### Build

1. Edit `/src/main.ts` and change the string in `path()` to point to your files
2. Run the build script in `package.json` (e.g. `pnpm build`)
3. Compiled ESM and UMD files are output in the `/dist` folder

## Output

gh-loader will return four different styles of HTML elements:
* Inline script `<script>alert("Hello world!")</script>`
* Remote script `<script src="#"></script>`
* Inline style `<style>body {}</style>`
* Remote style `<link src="#" />`

Inline vs. remote is a decision made at runtime based on `source` and github API return data, specifically `truncated`.

Each file includes the following data attributes:
* `data-gh-id`: Gist ID || repo owner / repo name
* `data-gh-file`: file name
* `data-gh-type`: inline || remote
* `data-gh-source`: gist || repo


## Troubleshooting

### Debugging 

Setting the `debug` flag to `true` sets all console groups to expanded by default and adds additional logging around file sourcing and processing.
If a remote script adds to the log its contents will be found in the console group for that specific file.

```
debug = true

▼ Loading file 'file1.js' from gist 'efacfd8f'
    Type: Inline script
    Source: Object { ... }
    Object: <DOM_node>
    
    "Hello World"
▼ Loading file 'file2.js' from gist 'efacfd8f'
    Type: Inline script
    Source: Object { ... }
    Object: <DOM_node>
▼ Loading file 'file3.css' from gist 'efacfd8f'
    Type: Inline style
    Source: Object { ... }
    Object: <DOM_node>
```

```
debug = false

▼ Loading file 'file1.js' from gist 'efacfd8f'
    "Hello World"
▶ Loading file 'file2.js' from gist 'efacfd8f'
▶ Loading file 'file3.js' from gist 'efacfd8f'
```

### Using the `gh` namespace

gh-loader provides a `gh` namespace with `debug: boolean` and `log()` helpers.  They can be used in your resource files for better debugging. Instead of having to edit the loader to globally enable debugging, you can assign it at runtime in your scripts.

```javascript
gh.debug = true
gh.log("This is a debug message")

gh.debug = false
gh.log("This message won't be output")
```

### Getting an "Oops!" message in the console

If you're seeing the following message in the console:

> Oops! You haven't configured gh-loader to actually do anything. Please check the README for instructions on how to set up gh-loader.

Congratulations!  You're half way there.  You invoked `load()`, but you forgot to pass it any values, so it's using the default.

## Optimization

### Fastest

The best use of gh-loader is to pass a single gist that contains multiple [untruncated](https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#truncation) files. In this scenario a single `fetch()` command returns all the files and their content which can be embedded inline in a page.

```
gist-id: efacfd8f
├── file1.js (18Kb)
├── file2.js (36Kb)
└── file3.css (5Kb)
```

Total HTTP requests: 1

### Fast

Multiple gists with multiple files

```
gist-id: efacfd8f
├── file1.js (18Kb)
└──file2.js (36Kb)

gist-id: dcba83f5
└── file3.css (5Kb)
```

Total HTTP requests: 2

### Slow

Individual files loaded from repositories do not have any HTTP calls originating from gh-loader, but all files use remote loading and the user's browser will create an HTTP GET for each file.

```
file: usera/repo/blob/master/path/file1.js
└── file1.js (18Kb)

file: usera/repo/blob/master/path/file2.js
└── file2.js (36Kb)

file: userb/repo/blob/main/path/file3.css
└── file3.css (5Kb)
```

Total HTTP requests: 3

### Slowest

A gist (or gists) with truncated files. The Gist API will automatically truncate any files over 1 Mb. This means that Gh-loader has to fetch the files from the gist API (1 per gist), and then use remote loading so the user's browser has to get the remote contents

```
gist-id: 038f3cab
├── file1.js (1.1Mb)
├── file2.js (2.0Mb)
└── file3.css (1.2Mb)
```

Total HTTP requests: 4

This is doubly inefficient, as the first fetch retrieves _most_ of the data, and then the subsequent 3 fetches retrieve all the data.  If you find yourself in this scenario - consider breaking your files apart so they are less that 1Mb, or switching to using a repo so the files are only fetched one time.