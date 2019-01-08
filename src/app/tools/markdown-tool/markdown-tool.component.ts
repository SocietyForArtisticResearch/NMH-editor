import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { RCExpoModel } from '../../shared/RCExpoModel';
import * as Editor from '../../shared/rcmde';
import { Backend } from '../../shared/Backend';

// This is the actual markdown text editor, (so not a media tool in the object list)
@Component({
    selector: 'app-markdown-tool',
    templateUrl: './markdown-tool.component.html',
    styleUrls: ['./markdown-tool.component.css']
})
export class MarkdownToolComponent implements AfterViewInit {
    @ViewChild('simplemde') textarea: ElementRef;

    @Input() text: string;
    @Input() identifier: number;
    @Input() displayMarkdownEditor: boolean = true; // this enables hiding the markdown editor when showing the style

    @Output() openObjectListRequest = new EventEmitter();

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

        this.mde.codemirror.editor.getInputField().spellcheck = true;

        this.mde.value(this.testString());

        this.mde.drawMediaCallback = () => {
            this.openObjectList();
        };

        this.mde.openPreviewCallback = () => {
            //console.log('table of contents (debug):', this.rcExpoModel.exposition.getTOC());
            // if (Backend.useRC) {
            //     this.rcExpoModel.saveToRC();
            // }
        }

        if (Backend.useRC) {
            this.mde.userSaveCallback = (event) => {
                let expoModel = this.rcExpoModel;
                expoModel.saveToRC(false, () => expoModel.mde.displaySaveStatus());
            }
        }


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

    openObjectList() {
        this.openObjectListRequest.emit();
    }

    refocus() {
        this.mde.codemirror.focus();
    }

    testString() {
        return '';/*//`## Import a Word document

You can import a Word (.docx) document (including the illustrations) using the __import/export__ button.

## Write directly in the online editor

The editor is using [Markdown](https://daringfireball.net/projects/markdown/). 
If you are not familiar with Markdown, below is a brief introduction.

## Markdown 

Markdown is a way of writing HTML webpages without using code. 
Markdown is written as plain text (like you would write on a typewriter), 
that is translated into HTML for you. In this editor you see the markdown 
on the left and the resulting HTML on the right. 

There are a few special characters (\`# * __ [^1] \`) 
that allow you to inform the translator to use a certain style 
(for example *italic*, __bold__, __headers__ etc..). Instead of typing these characters, 
you can also select a piece of text and push the desired style button on top of the editor.
This will insert the Markdown characters for you.

## Paragraphs 
Paragraphs can be written like this. 
Markdown recognizes a paragraph by looking for whitelines in your text.

Thus, now that I've skipped a line, this is a second paragraph.
Alternatively, you can leave two spaces at the end of a line.

## Headers \`#\` 
Headers are defined by using \`#\`. There are six levels. 
The first three levels are automatically included in the table of contents. 
If you want smaller headers, use more ##. 

## Lists & bulletpoints

To get bullet points:

* my first point
* another throught
* yet another thought

To get ordered lists, write a number and a point, 1. , 2. , 3. 
1. one
2. two
3. three

## Links
Hyperlinks are written \`[text](http://example.com)\`

## Footnotes
This is a footnote [^1], and another [^2]. To creat one, you can also press the footnote button [x²]

[^1]: this is the footnote text.
[^2]: another footnote.
`;*/
    }

}


