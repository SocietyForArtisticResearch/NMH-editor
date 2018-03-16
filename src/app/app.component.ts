import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { RCExpoModel } from './shared/RCExpoModel';
import { RCMDE, insertMediaToken, insertMedia } from './shared/rcmde';
import { RCImage, RCAudio, RCSvg, RCPdf, RCVideo } from './shared/rcexposition';
import { ObjectListComponent } from './object-list/object-list.component';



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

    @ViewChild(ObjectListComponent) child: ObjectListComponent;

    constructor(private rcExpoModel: RCExpoModel) {

    }

    onMediaButton() {
        this.showMedia = !this.showMedia;
        if (this.child) {
            this.child.whenOpened();
        }
    }

    onChangedObject(identity) {
        let rcobject = this.rcExpoModel.exposition.getObjectWithID(identity);
        let editor: RCMDE = this.rcExpoModel.mde;
        insertMedia(editor, rcobject.name);
    }

    ngAfterViewInit() {

    }
}
