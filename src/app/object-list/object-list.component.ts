import { Component, OnInit } from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';

import { RCExpoModel } from '../shared/RCExpoModel';
import { RCMDE, insertMediaToken } from '../shared/rcmde';
import { RCObject, RCImage, RCAudio, RCSvg, RCPdf, RCVideo } from '../shared/rcexposition';


@Component({
    selector: 'app-object-list',
    templateUrl: './object-list.component.html',
    styleUrls: ['./object-list.component.css'],
})
export class ObjectListComponent implements OnInit {
    imageUri: string = null;
    selectedObject: RCObject = null;
    // member object to deal with single vs double click
    dblClickCtrl = {
        timer: <number>2,
        prevent: <boolean>false,
        delay: <number>50
    };

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
        let imageObject = new RCImage(imageName, this.imageUri, 'myClass', null,null);

        this.rcExpoModel.exposition.addObject(imageObject);
        this.selectedObject = imageObject;
        // this.rcExpoModel.exposition.addObject(imageObject, 0);
    }

    onSelect(id: number, rcobject: RCObject) {
        // only process click, if there was not a single click
        console.log('click ?...');
        this.dblClickCtrl.timer = setTimeout(( ) => { 
            if (!this.dblClickCtrl.prevent) {
                console.log('single click');
                this.selectedObject = rcobject;
            }
            this.dblClickCtrl.prevent = false;
        },this.dblClickCtrl.delay);

    }

    onDoubleClick(id: number,rcobject: RCObject) {
        // hey double click, don't process single click;
        clearTimeout(this.dblClickCtrl.timer);
        this.dblClickCtrl.prevent = true;
        // insert rcobject in mde
        this.selectedObject = rcobject;
        let editor: RCMDE = this.rcExpoModel.mde;
        insertMediaToken(editor,rcobject.name);
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
        // check if rcobject was removed
        if (!this.rcExpoModel.exposition.getObjectWithID(this.selectedObject.id)) {
            this.selectedObject = this.rcExpoModel.exposition.media[0];
        }
    }

    objectWasRemoved(removedObjectId: number) {
        if (this.selectedObject.id === removedObjectId) {
             this.selectedObject = this.rcExpoModel.exposition.media[0];
        }
    }

    trashObject(rcObject) {
        this.rcExpoModel.exposition.removeObjectWithID(rcObject.id);
    }

    ngOnInit() {
        if (this.rcExpoModel.exposition.media.length > 0) {
            this.selectedObject = this.rcExpoModel.exposition.media[0];
        }
    }


}
