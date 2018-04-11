import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { RCMedia, RCVideo } from '../../shared/rcexposition';
import { FormControl, AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Backend } from '../../shared/Backend'

import * as Utils from '../../shared/utils'



function forbiddenNameValidator(rcModel: RCExpoModel, oldName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (control.value === oldName) {
            // old name is allowed.
            return null;
        }
        const forbidden = rcModel.exposition.getObjectWithName(control.value);
        return forbidden ? { 'name exists, be creative!': { value: control.value } } : null;
    };
}


@Component({
    selector: 'app-video-tool',
    templateUrl: './video-tool.component.html',
    styleUrls: ['./video-tool.component.css']
})
export class VideoToolComponent implements OnInit {
    // name: string = '';
    collapsed: boolean = false;
    toolForm: FormGroup;
    toolType: string;
    selectedVideo: File = null;

    identifier: number;
    @Input() rcobject: RCMedia;
    @Input() id: number;

    @Output() onRemoveObject = new EventEmitter();
    @Output() onChangedObject = new EventEmitter();



    constructor(private http: HttpClient, private rcExpoModel: RCExpoModel) { }

    ngOnInit() {
        this.identifier = this.rcobject.id;

        this.toolForm = new FormGroup({
            'name': new FormControl(this.rcobject.name,
                [
                    forbiddenNameValidator(this.rcExpoModel, this.rcobject.name), // <-- Here's how you pass in the custom validator.
                    Validators.required
                ]),
            'videoUrl': new FormControl(this.rcobject.url, [Validators.required])
        });


        this.toolType = this.rcobject.constructor.name;
    }

    ngOnChanges() {
        if (this.toolForm) {
            this.toolForm.setValue({
                name: this.rcobject.name,
                videoUrl: this.rcobject.url,
            });
            this.toolForm.controls['name'].setValidators(
                [forbiddenNameValidator(this.rcExpoModel, this.rcobject.name), // <-- Here's how you pass in the custom validator.
                Validators.required]);
            this.toolForm.controls['name'].updateValueAndValidity();
        }
    }

    onSubmit() {
        // Angular protects its values of the model very strictly, so we have to update rcexposition through a deepcopy of the tool.
        let deepCopy = this.prepareSaveObject();
        this.rcExpoModel.exposition.replaceObjectWithID(this.rcobject.id, deepCopy);
    }

    prepareSaveObject(): RCVideo {
        const formModel = this.toolForm.value;

        let id = Utils.uniqueID();
        const newObject: RCVideo = new RCVideo(id, formModel.name);
        newObject.url = formModel.videoUrl;
        newObject.pxWidth = formModel.widthInPixels;
        newObject.pxHeight = formModel.heightInPixels;
        return newObject;
    }

    onTrash() {
        /*
         * Directly remove this on the model, model change will automatically result in view update.
         */
        this.rcExpoModel.exposition.removeObjectWithID(this.rcobject.id);
        this.onRemoveObject.emit(this.rcobject.id);
    }

    onVideoSelect(event) {
        this.selectedVideo = <File>event.target.files[0];
        console.log(this.selectedVideo);
        const fd = new FormData();
        fd.append('uploadFile', this.selectedVideo, this.selectedVideo.name);
        this.http.post(Backend.uploadAddress, fd).subscribe(result => {
            this.onResult(result);
        });
        this.rcExpoModel.mde.render();
    }

    onResult(result) {
        if (this.toolForm) {
            this.toolForm.patchValue({
                videoUrl: Backend.baseAddress + result.url,
            });
        }
        let deepCopy = this.prepareSaveObject();
        this.rcExpoModel.exposition.replaceObjectWithID(this.rcobject.id, deepCopy);

        this.onChangedObject.emit(this.rcobject.id);

    }
}

