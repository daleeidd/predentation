# predentation
[![Build Status][ci-status]][ci]

A node.js stream that removes indentation from the `pre` tag.

Before:
```html
<html>
  <body>
    <pre>
      function something() {
          return 'Hello, World!';
      }
    </pre>
  </body>
</html>
```

After:
```html
<html>
  <body>
    <pre>
function something() {
    return 'Hello, World!';
}
    </pre>
  </body>
</html>
```


## Installation

Install globally or locally with NPM, or clone this repository with Git.

## Usage

### Shell

Process a single file
```bash
predentation index.html > output/index.html
```

Use your shell to glob and output files with the same name to a directory
```bash
predentation *.html -o output
```

Supports globbing internally so pass globs as a string to be platform agnostic
```bash
predentation '**/*.html' -o output
```

Pipe in and pipe out
```bash
cat index.html | predentation | minify > output.html
```

#### Options

`-o --output`: Output directory

### Build Tools

Please do **not** create a plugin for this unless it is **absolutely** necessary!

#### Gulp

Use `vinyl-transform` to wrap `predentation`, and use like any other plugin.

```js
var gulp         = require('gulp');
var transform    = require('vinyl-transform');
var predentation = require('predentation');

var pre = transform(function (options) {
  return predentation(options);
});

gulp.task('default', function () {
  gulp
  .src('input.html')
  .pipe(pre)
  .pipe(gulp.dest('output'));
});
```

#### Others

If the only way to include this as part of your build is to make a plugin, then by all means make one and list it here.

[ci-status]: https://travis-ci.org/daleeidd/predentation.svg
[ci]:        https://travis-ci.org/daleeidd/predentation