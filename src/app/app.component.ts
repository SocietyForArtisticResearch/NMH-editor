import { Component, OnInit } from '@angular/core';
import { RCExpoModel } from './shared/RCExpoModel';
import { RCImage, RCAudio, RCSvg, RCPdf, RCVideo } from './shared/rcexposition';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [RCExpoModel]
})
export class AppComponent implements OnInit {
    // rcExpoModel is injected into this compenent (and all its children through their constructors !)
    constructor(private rcExpoModel: RCExpoModel) {

    }

    ngOnInit() {

        // for testing purposes
        let imageObject = new RCImage('leonardo', "../../assets/media/leonardo.jpg", 'myClass');
        this.rcExpoModel.exposition.addObject(imageObject);
    }
}
