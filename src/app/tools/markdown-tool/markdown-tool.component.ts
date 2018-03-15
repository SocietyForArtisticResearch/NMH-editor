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

This note demonstrates some of what [Markdown](http://daringfireball.net/projects/markdown/) is capable of doing.

*Note: Feel free to play with this page. Unlike regular notes, this doesn't automatically save itself.*

## Basic formatting

Paragraphs can be written like so. A paragraph is the basic block of Markdown. A paragraph is what text will turn into when there is no reason it should become anything else.

Paragraphs must be separated by a blank line. Basic formatting of *italics* and **bold** is supported. This *can be **nested** like* so.

## Lists

### Ordered list

1. Item 1
2. A second item
3. Number 3
4. Ⅳ

*Note: the fourth item uses the Unicode character for [Roman numeral four](http://www.fileformat.info/info/unicode/char/2163/index.htm).*

### Unordered list

* An item
* Another item
* Yet another item
* And there's more...

# Footnotes
This is a footnote [^1]

## Paragraph modifiers

### Code block

    Code blocks are very useful for developers and other people who look at code or other things that are written in plain text. As you can see, it uses a fixed-width font.

You can also make \`inline code\` to add code into other things.

### Quote

> Here is a quote. What this is should be self explanatory. Quotes are automatically indented when they are used.

## Headings

There are six levels of headings. They correspond with the six levels of HTML headings. You've probably noticed them already in the page. Each level down uses one more hash character.

### Headings *can* also contain **formatting**

### They can even contain \`inline code\`

Of course, demonstrating what headings look like messes up the structure of the page.

I don't recommend using more than three or four levels of headings here, because, when you're smallest heading isn't too small, and you're largest heading isn't too big, and you want each size up to look noticeably larger and more important, there there are only so many sizes that you can use.

## URLs

URLs can be made in a handful of ways:

* A named link to [MarkItDown](http://www.markitdown.net/). The easiest way to do these is to select what you want to make a link and hit 'ctrl+K' & 'cmd+K'
* Another named link to [MarkItDown](http://www.markitdown.net/)
* Sometimes you just want a URL like <http://www.markitdown.net/>.

## Horizontal rule

A horizontal rule is a line that goes across the middle of the page.

---

It's sometimes handy for breaking things up.

## Images

Markdown can also contain images. I'll need to add something here sometime.

## Finally

There's actually a lot more to Markdown than this. See the official [introduction](http://daringfireball.net/projects/markdown/basics) and [syntax](http://daringfireball.net/projects/markdown/syntax) for more information. However, be aware that this is not using the official implementation, and this might work subtly differently in some of the little things.


[^1]: The footnote text
`;
    }

}


