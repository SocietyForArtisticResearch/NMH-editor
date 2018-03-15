import { Component, OnInit, ViewChild } from '@angular/core';
import { RCExpoModel } from './shared/RCExpoModel';
import { RCImage, RCAudio, RCSvg, RCPdf, RCVideo } from './shared/rcexposition';
import { ObjectListComponent } from './object-list/object-list.component';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [RCExpoModel]
})
export class AppComponent implements OnInit {
    // rcExpoModel is injected into this compenent (and all its children through their constructors !)
    showMedia: boolean = false;
    showImport: boolean = false;
    editStyle: boolean = false;

    @ViewChild(ObjectListComponent) child: ObjectListComponent;

    constructor(private rcExpoModel: RCExpoModel) {

    }

    onMediaButton() {
        this.showMedia = !this.showMedia;
        this.child.whenOpened();
    }

    ngOnInit() {

        // for testing purposes
        //  let imageObject = new RCImage('leonardo', "assets/media/leonardo.jpg", 'myClass',100,100);
        //this.rcExpoModel.exposition.addObject(imageObject);
    }
}
