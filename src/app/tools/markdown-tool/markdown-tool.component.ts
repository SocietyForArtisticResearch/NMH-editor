import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { RCExpoModel } from '../../shared/RCExpoModel';
import * as Editor from '../../shared/rcmde';
//declare var SimpleMDE : any;

@Component({
    selector: 'app-markdown-tool',
    templateUrl: './markdown-tool.component.html',
    styleUrls: ['./markdown-tool.component.css']
})
export class MarkdownToolComponent implements AfterViewInit {
    @ViewChild('simplemde') textarea: ElementRef;

    @Input() text: string;
    @Input() identifier: number;

    content: string;
    mde: any;

    constructor(private rcExpoModel: RCExpoModel) { }


    ngAfterViewInit() {
        let expoModel = this.rcExpoModel;
        this.mde = new Editor.RCMDE(expoModel.exposition, {
            element: this.textarea.nativeElement,
            showIcons: ["code"],
            spellChecker: false
        });

        Editor.toggleSideBySide(this.mde);
        expoModel.mde = this.mde;

        
        this.mde.value(this.testString());

        //        this.mde.toggleSideBySide();

        // this.mde.markdown = function (text) {
        //     // preprocess and convert via rcexposition
        //     return expoModel.processMarkdown(text);
        // }
        // this.mde.togglePreview = function (ed) {
        //     console.log("toggled preview");
        // }
        // console.log(this.mde.togglePreview);
        //        this.mde.codemirror.on("keyHandled", () => { console.log('hallo') });
    };

    testString( ) {
        return `# An exhibit of Markdown

This note demonstrates some of what [Markdown][^1] is capable of doing.

## Basic formatting

Paragraphs can be written like so. A paragraph is the basic block of Markdown. A paragraph is what text will turn into when there is no reason it should become anything else.

Paragraphs must be separated by a blank line. Basic formatting of *italics* and **bold** is supported. This *can be **nested** like* so.

## Lists

### Ordered list

1. Item 1
2. A second item
3. Number 3
4. Ⅳ

*Note: the fourth item uses the Unicode character for [Roman numeral four][2].*

### Unordered list

* An item
* Another item
* Yet another item
* And there's more...

### Quote

> Here is a quote. What this is should be self explanatory. Quotes are automatically indented when they are used.

## Headings

There are six levels of headings. They correspond with the six levels of HTML headings. You've probably noticed them already in the page. Each level down uses one more hash character.

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

### Headings *can* also contain **formatting**

Of course, demonstrating what headings look like messes up the structure of the page.
I don't recommend using more than three or four levels of headings here, because, when you're smallest heading isn't too small, and you're largest heading isn't too big, and you want each size up to look noticeably larger and more important, there there are only so many sizes that you can use.

## URLs

URLs can be made in a handful of ways:

* A named link to [MarkItDown][^3]. The easiest way to do these is to select what you want to make a link and hit 'Ctrl+L'.
* Another named link to [MarkItDown](http://www.markitdown.net/)
* Sometimes you just want a URL like <http://www.markitdown.net/>.

## Horizontal rule

A horizontal rule is a line that goes across the middle of the page.

---

It's sometimes handy for breaking things up.


## Finally

There's actually a lot more to Markdown than this. See the official [introduction][4] and [syntax][5] for more information. However, be aware that this is not using the official implementation, and this might work subtly differently in some of the little things.


  [^1]: http://daringfireball.net/projects/markdown/
  [^2]: http://www.fileformat.info/info/unicode/char/2163/index.htm
  [^3]: http://www.markitdown.net/
  [^4]: http://daringfireball.net/projects/markdown/basics
  [^5]: http://daringfireball.net/projects/markdown/syntax
`;
    }

}


