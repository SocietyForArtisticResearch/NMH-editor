import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';

import { RCExpoModel } from '../shared/RCExpoModel';
import { RCMDE, insertMediaToken, insertMedia } from '../shared/rcmde';
import { RCObject, RCImage, RCAudio, RCSvg, RCPdf, RCVideo } from '../shared/rcexposition';

import * as Utils from '../shared/utils';

import { RCBackendMediaUpload } from '../shared/RCBackendMediaUpload';
import { Backend } from '../shared/Backend'

@Component({
    selector: 'app-object-list',
    templateUrl: './object-list.component.html',
    styleUrls: ['./object-list.component.css'],
})
export class ObjectListComponent implements OnInit {
    imageUri: string = null;
    selectedObject: RCObject = null;

    @Output() onObjectWasChosen = new EventEmitter();

    // member object to deal with single vs double click
    dblClickCtrl = {
        timer: <number>2,
        prevent: <boolean>false,
        delay: <number>60
    };

    constructor(
        public rcExpoModel: RCExpoModel,
        public rcBackendMediaUpload: RCBackendMediaUpload
    ) { }

    createImageTool() {
        // obsolete
        let imageName = 'image' + this.rcExpoModel.exposition.media.length;
        let imageObject = new RCImage(Utils.uniqueID(), imageName);
        imageObject.url = this.imageUri;
        this.rcExpoModel.exposition.addObject(imageObject);
        this.selectedObject = imageObject;
        // this.rcExpoModel.exposition.addObject(imageObject, 0);
    }

    // obsolete
    createAudioTool() {
        let audioName = 'audio' + this.rcExpoModel.exposition.media.length;

        let audioObject = new RCAudio(Utils.uniqueID(), audioName);
        // Luc: audioUri is the same as imageUri? should perhaps be called mediaUri
        audioObject.url = this.imageUri;
        this.rcExpoModel.exposition.addObject(audioObject);
        this.selectedObject = audioObject;
    }

    onSelect(rcobject: RCObject) {
        if (rcobject) {
            let id = rcobject.id;
            // only process click, if there was not a single click
            this.dblClickCtrl.timer = setTimeout(() => {
                if (!this.dblClickCtrl.prevent) {
                    //console.log('succes',rcobject);
                    this.selectedObject = rcobject;
                } else {
                    this.dblClickCtrl.prevent = false;
                }
            }, this.dblClickCtrl.delay);
        }


    }

    onDoubleClick(rcobject: RCObject) {

        if (rcobject) {
            let id = rcobject.id;
            // detected double click, don't process single click;
            clearTimeout(this.dblClickCtrl.timer);
            this.dblClickCtrl.prevent = true;
            // insert rcobject in mde
            let editor: RCMDE = this.rcExpoModel.mde;
            insertMedia(editor, rcobject.name);
            this.onObjectWasChosen.emit();
        }
    }

    isObjectSelected(rcobject: RCObject) {
        if (this.selectedObject) {
            return this.selectedObject.id === rcobject.id;
        }
        return false;
    }

    getCurrentSelection() {
        return this.selectedObject;
    }

    toolType(obj) {
        return obj.constructor.name;
    }

    /*
    removeAll() {
        this.rcExpoModel.exposition.media = [];
    }*/

    ngOnChanges() {
        // check if rcobject was removed
        if (!this.rcExpoModel.exposition.getObjectWithID(this.selectedObject.id)) {
            this.selectedObject = this.rcExpoModel.exposition.media[0];
        }
    }

    whenOpened() {
        if (this.rcExpoModel.exposition.media.length > 0) {
            this.selectedObject = this.rcExpoModel.exposition.media[0];
        }
    }

    onChangedObject(identity: number) {
        let newObject = this.rcExpoModel.exposition.getObjectWithID(identity);
        if (newObject) {
            this.selectedObject = this.rcExpoModel.exposition.getObjectWithID(identity);
        }
    }

    objectWasRemoved(removedObjectId: number) {
        if (this.selectedObject.id === removedObjectId) {
            this.selectedObject = this.rcExpoModel.exposition.media[0];
        }
    }

    trashObject(rcObject) {
        if (Backend.useRC) {
            this.rcBackendMediaUpload.removeObjectFromRC(rcObject.id);
            // will resync
        }
        this.rcExpoModel.exposition.removeObjectWithID(rcObject.id);
    }

    ngOnInit() {
        if (this.rcExpoModel.exposition.media.length > 0) {
            this.selectedObject = this.rcExpoModel.exposition.media[0];
        }
    }

    mediaHasObjects() {
        return this.rcExpoModel.exposition.media.length > 0;
    }

    getTranscodingStatus(rcObject: RCObject) {
        // catch no media selected message
        if (rcObject.transcodingStatus.includes('<div>')) {
            return '';
        } 
        return rcObject.transcodingStatus;
    }


}
