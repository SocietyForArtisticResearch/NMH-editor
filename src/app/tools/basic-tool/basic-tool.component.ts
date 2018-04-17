import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { RCMedia, RCImage } from '../../shared/rcexposition';
import { FormControl, AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpEventType, HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { Backend } from '../../shared/Backend';
import { RCBackendMediaUpload, RCMetaData } from '../../shared/RCBackendMediaUpload';

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
    userMessage:string = "upload a file";

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



    constructor(
        private http: HttpClient,
        private rcExpoModel: RCExpoModel,
        private rcBackendMediaUpload: RCBackendMediaUpload) { }

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
            'filePickerButton': new FormControl(null),
            'copyright' : new FormControl(this.rcobject.copyright),
            'description' : new FormControl(this.rcobject.description),
        });

        this.toolForm.get('name').valueChanges.subscribe( val => { this.onNameChange(val); } );
        this.toolForm.get('widthInPixels').valueChanges.subscribe( val => { this.onLocalPropertyChange(val); });
        this.toolForm.get('heightInPixels').valueChanges.subscribe( val => { this.onLocalPropertyChange(val); });
        
        if(Backend.useRC) { // these properties should be updated through RC API
            this.toolForm.get('copyright').valueChanges.subscribe( val =>  { this.onRCMetaDataChange(val); });
            this.toolForm.get('description').valueChanges.subscribe( val =>  { this.onRCMetaDataChange(val); });
        }

        if (!Backend.useRC) { // if not on RC, update the model using old methods:
            // old situation
            this.toolForm.valueChanges.subscribe(val => {
                this.onSubmit();
            });
        }

        this.toolType = this.rcobject.constructor.name;
    }

    onLocalPropertyChange(val) {
        this.rcObject.pxWidth = this.toolForm.get('widthInPixels');
        this.rcObject.pxHeight = this.toolForm.get('heightInPixels');
    }

    onRCMetaDataChange(val) {
        // this should call edit meta data in RCBackendMediaUpload.ts;
        let metadata :RCMetaData = {
            copyrightholder : this.rcobject.copyright,
            description : this.rcobject.description ,
            name : this.rcobject.name 
        }

        this.rcBackendMediaUpload.editObjectFromRC(this.rcobject.id,metadata);
    }

    onNameChange(val) {
        let field = this.toolForm.get('name');
        if (field.valid) {
            let rcobject = this.rcExpoModel.exposition.getObjectWithID(this.rcobject.id);
            rcobject.name = field.value;
        }
    }

    ngOnChanges() {
        if (!Backend.useRC) {
            if (this.toolForm) {
                this.toolForm.setValue({
                    'name': this.rcobject.name,
                    'fileUrl': this.rcobject.url,
                    'widthInPixels': this.rcobject.pxWidth,
                    'heightInPixels': this.rcobject.pxHeight,
                    'filePickerButton': null,
                    'copyright': this.rcobject.copyright,
                    'description' : this.rcobject.description
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
        newObject.description = formModel.description;
        newObject.copyright = formModel.copyright;
        return newObject;
    }

    onTrash() {
        if(Backend.useRC) {
            // remove through rc, will automatically resync
            this.rcBackendMediaUpload.removeObjectFromRC(this.rcobject.id);
        } else {
        /*
         * Directly remove this on the (local) model.
         */
            this.rcExpoModel.exposition.removeObjectWithID(this.rcobject.id);
            this.onRemoveObject.emit(this.rcobject.id);
        }
    }

    onFileSelect(event) {
        if (Backend.useRC) {
            let onRCResult = ( evt :any ) => { console.log('file updated, should have resynced?', evt); };
            let onProgress = ( progress: string ) => { this.fileUploadStatus = progress };

            this.rcBackendMediaUpload.replaceFileRC(
                this.rcobject.id,
                event.target.files,
                onRCResult,
                onProgress);

        } else {
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
        }

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
