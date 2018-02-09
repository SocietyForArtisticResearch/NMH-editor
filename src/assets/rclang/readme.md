# Research Catalogue Text-based Exposition Editor

Reponsive and text-based exposition editor for the Research Catalogue

## Structure

* **lib** --  RC Exposition representation
* **editor** -- front-end, editor
* **parser** -- parser for the RCLang representation of expositions
* **server** -- Node.js server parts (file export and conversion)
* **test** -- test application
* **documents** -- description of the system and other docuemtns
* **doc** --  JSDoc documentation

## Generating the documentation

JSDoc 3 is required for generating the documentation

``` shell
npm install -g jsdoc
```

To generate the documentation 
``` shell
jsdoc -d doc/ lib/*.js
```

## Compiling the parser

``` shell
nearleyc rclang.ne -o rclangparser.js 
```
