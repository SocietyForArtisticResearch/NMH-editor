import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { RCMedia, RCImage } from '../../shared/rcexposition';
import { FormControl, AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpEventType, HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { Backend } from '../../shared/Backend';

import * as Utils from '../../shared/utils';

/* this is the basic tool, from which image, video and audio derive */


/* checks if name is unique */
function forbiddenNameValidator(rcModel: RCExpoModel, oldName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (control.value === oldName) {
            return null;
        }
        const forbidden = rcModel.exposition.getObjectWithName(control.value);
        return forbidden ? { 'name exists, be creative!': { value: control.value } } : null;
    };
}


@Component({
    selector: 'app-basic-tool',
    templateUrl: './basic-tool.component.html',
    styleUrls: ['./basic-tool.component.css']
})
export class BasicToolComponent implements OnInit {
    // name: string = '';
    collapsed: boolean = false;
    toolForm: FormGroup;
    toolType: string;
    selectedFile: File = null;
    
    formattedMessage: string;
    fileUploadStatus: string = null;

    identifier: number;
    @Input() rcobject: RCMedia;
    @Input() id: number;

    @Output() onRemoveObject = new EventEmitter();
    @Output() onChangedObject = new EventEmitter();



    constructor(private http: HttpClient,private rcExpoModel: RCExpoModel) { }

    ngOnInit() {
        this.identifier = this.rcobject.id;

        this.toolForm = new FormGroup({
            'name': new FormControl(this.rcobject.name,
                [
                    forbiddenNameValidator(this.rcExpoModel, this.rcobject.name), // <-- Here's how you pass in the custom validator.
                    Validators.required
                ]),
            'fileUrl': new FormControl(this.rcobject.url, [Validators.required]),
            'widthInPixels': new FormControl(this.rcobject.pxWidth),
            'heightInPixels': new FormControl(this.rcobject.pxHeight),
            'filePickerButton': new FormControl(null)
        });

        this.toolForm.valueChanges.subscribe(val => {
            this.onSubmit();
        });

        this.toolType = this.rcobject.constructor.name;
    }

    ngOnChanges() {
        if (this.toolForm) {
            this.toolForm.setValue({
                'name': this.rcobject.name,
                'fileUrl': this.rcobject.url,
                'widthInPixels': this.rcobject.pxWidth,
                'heightInPixels': this.rcobject.pxHeight,
                'filePickerButton': null
            });

            this.toolForm.controls['name'].setValidators(
                [forbiddenNameValidator(this.rcExpoModel, this.rcobject.name), // <-- Here's how you pass in the custom validator.
                Validators.required]);
            this.toolForm.controls['name'].updateValueAndValidity();

            this.toolForm.valueChanges.subscribe(val => {
                this.onSubmit();
            });

        }
    }

    allowEditName() {
        if (this.rcobject.url == null) {
            return false;
        }
        return true;
    }


    onSubmit() {
        // Angular protects its values of the model very strictly, so we have to update rcexposition through a deepcopy of the tool.
        let deepCopy = this.prepareSaveObject();
        this.rcExpoModel.exposition.replaceObjectWithID(this.rcobject.id, deepCopy);
        this.rcExpoModel.mde.forceRender();
        //        console.log("update");
    }

    prepareSaveObject(): RCImage {
        const formModel = this.toolForm.value;
        let id = Utils.uniqueID();
        const newObject: RCImage = new RCImage(id, formModel.name);
        newObject.url = formModel.fileUrl;
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

    onFileSelect(event) {

        this.selectedFile = <File>event.target.files[0];
        const fd = new FormData();
        fd.append('uploadFile', this.selectedFile, this.selectedFile.name);

        const req = new HttpRequest('POST', Backend.uploadAddress, fd, {
            reportProgress: true,
        });

        this.http.request(req).subscribe(event => {
            // Via this API, you get access to the raw event stream.
            // Look for upload progress events.
            if (event.type === HttpEventType.UploadProgress) {
                // This is an upload progress event. Compute and show the % done:
                this.fileUploadStatus = Math.round(100 * event.loaded / event.total) + '%';
            } else if (event instanceof HttpResponse) {
                this.fileUploadStatus = 'done';
                window.setTimeout(() => { this.fileUploadStatus = null }, 1000);
                this.onResult(event.body);
            }
        });

        this.rcExpoModel.mde.render();
    }

    onResult(result) {
        if (this.toolForm) {
            this.toolForm.patchValue({
                fileUrl: Backend.baseAddress + result.url,
            });
        }
        let deepCopy = this.prepareSaveObject();
        this.rcExpoModel.exposition.replaceObjectWithID(this.rcobject.id, deepCopy);
        this.onChangedObject.emit(this.rcobject.id);
    }

    rcobjectGetUrl() {
        let parts = this.rcobject.url.split('/');
        let lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash

        return lastSegment;
    }
}
