TypeScript-Watcher
==================

A Node.js file-watcher for TypeScript, providing common functionality currently missing in the tsc command, notably the inability to specify output paths for individual files and recursive, multi-file compilations.  

Installation
-------------
- Run `sudo npm install -g typescript-watcher`


Usage
-----

- To simply build all .ts sources and ouput .js files into a location, execute 
 -`tscwatch build <rootPath> <outputPath> [options]`
- To continuously watch for changes, execute 
 -`tscwatch watch <rootPath> <outputPath> [options]

***More options***

```
Usage: tscwatch [command] [options]

Possible commands are:
  tscwatch build: Build TypeScript project (short-cut alias: 'b')
  tscwatch watch: Watch TypeScript project for changes and automatically compile (short-cut alias: 'w')

To get help on individual command, execute 'tscwatch <command> --help' [options]

Options:
  -c, --comments    output comments in the compiled source
  -cat, --concat    compile all source files into a single .js file
  -m, --moduletype  set the compiled source module type (commonjs or AMD).  Default is commonjs
  -s, --sourcemap   output sourcemaps alongside compiled source
  -t, --target      output JavaScript version; options are "ES3" and "ES5".  Default is "ES3"
  -v, --version     display tscwatch version
```

*** Currently a work in progress ***

TODO
----
- Write tests

Thanks
-------
- Core TypeScript compilation code was extracted from Josh Heyse's **typescript-brunch** plugin:  https://github.com/joshheyse/typescript-brunch
- Inspiration and various file-utilities came from Paul Miller's incredible application-assembler, **Brunch**: https://github.com/brunch

## License
The MIT license.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.