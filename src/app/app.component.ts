import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { RCExpoModel } from './shared/RCExpoModel';
import { RCMDE, insertMediaToken, insertMedia } from './shared/rcmde';
import { RCImage, RCAudio, RCSvg, RCPdf, RCVideo } from './shared/rcexposition';
import { ObjectListComponent } from './object-list/object-list.component';
import { MarkdownToolComponent } from './tools/markdown-tool/markdown-tool.component';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [RCExpoModel]
})
export class AppComponent implements AfterViewInit {
    // rcExpoModel is injected into this compenent (and all its children through their constructors !)
    showMedia: boolean = false;
    showImport: boolean = false;
    editStyle: boolean = false;

    @ViewChild(ObjectListComponent) objectList: ObjectListComponent;
    @ViewChild(MarkdownToolComponent) markdownEditor: MarkdownToolComponent;

    constructor(public rcExpoModel: RCExpoModel) {

    }

    onMediaButton() {
        this.showMedia = !this.showMedia;
        if (this.objectList) {
            this.objectList.whenOpened();
        }
    }

    onChangedObject(identity) {
        let rcobject = this.rcExpoModel.exposition.getObjectWithID(identity);
        let editor: RCMDE = this.rcExpoModel.mde;
        insertMedia(editor, rcobject.name);
    }

    closeMedia() {
        this.showMedia = false;
        this.markdownEditor.refocus();
    }

    ngAfterViewInit() {

    }
}
