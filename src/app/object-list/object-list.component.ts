import { Component, OnInit } from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';

import { RCExpoModel } from '../shared/RCExpoModel';
import { RCObject, RCImage, RCAudio, RCSvg, RCPdf, RCVideo } from '../shared/rcexposition';


@Component({
    selector: 'app-object-list',
    templateUrl: './object-list.component.html',
    styleUrls: ['./object-list.component.css'],
})
export class ObjectListComponent implements OnInit {
    imageUri: string = "data:image/jpeg;base64,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";
    selectedObject: RCObject = null;

    eventOptions = {
        onUpdate: (event) => {
            console.log(event.oldIndex);
            console.log(event.newIndex);
            console.log('event');
        }
    }

    constructor(private rcExpoModel: RCExpoModel) { }

    // TO BE FIXED! (ALWAYS NEEDS A UNIQUE NAME)
    createImageTool() {
        let imageName = 'image'+this.rcExpoModel.exposition.media.length;
        let imageObject = new RCImage(imageName, this.imageUri, 'myClass', 100,100);

        this.rcExpoModel.exposition.addObject(imageObject);
        this.selectedObject = imageObject;
        // this.rcExpoModel.exposition.addObject(imageObject, 0);
    }

    onSelect(id: number, object: RCObject) {
        this.selectedObject = object;
    }

    getCurrentSelection() {
        return this.selectedObject;
    }

    toolType(obj) {
        return obj.constructor.name;
    }

    removeAll() {
        this.rcExpoModel.exposition.media = [];
    }

    ngOnChanges() {
        // check if object was removed
        if (!this.rcExpoModel.exposition.getObjectWithID(this.selectedObject.id)) {
            this.selectedObject = this.rcExpoModel.exposition.media[0];
        }
    }

    objectWasRemoved(removedObjectId: number) {
        if (this.selectedObject.id === removedObjectId) {
             this.selectedObject = this.rcExpoModel.exposition.media[0];
        }
    }

    ngOnInit() {
        if (this.rcExpoModel.exposition.media.length > 0) {
            this.selectedObject = this.rcExpoModel.exposition.media[0];
        }
    }


}
