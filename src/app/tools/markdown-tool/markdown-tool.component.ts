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

    onKeyup() {
        this.rcExpoModel.exposition.updateRCTextWithIdAndContent(
            this.identifier,
            this.mde.value()
        );
    }

    ngAfterViewInit() {
        let expoModel = this.rcExpoModel;
        this.mde = new Editor.RCMDE({
            element: this.textarea.nativeElement,
            showIcons: ["code", "table"],
            spellChecker: false
        });
        Editor.toggleSideBySide(this.mde);
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
}
