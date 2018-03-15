import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { RCMedia, RCImage } from '../../shared/rcexposition';
import { FormControl, AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Backend } from '../../shared/Backend';



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
    selectedImage: File = null;
    formattedMessage: string;
    allowEditName: boolean = false;

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
            'imageUrl': new FormControl(this.rcobject.url, [Validators.required]),
            'widthInPixels': new FormControl(this.rcobject.pxWidth),
            'heightInPixels': new FormControl(this.rcobject.pxHeight)
        });


        this.toolType = this.rcobject.constructor.name;
    }

    ngOnChanges() {
        console.log('this.obect.url',this.rcobject.url);
        if (this.toolForm) {
            this.toolForm.setValue({
                'name': this.rcobject.name,
                'imageUrl': this.rcobject.url,
                'widthInPixels': this.rcobject.pxWidth,
                'heightInPixels': this.rcobject.pxHeight,
            });
            (<HTMLInputElement>document.getElementById('imageFileSelect')).value = null;

            this.toolForm.controls['name'].setValidators(
                [forbiddenNameValidator(this.rcExpoModel, this.rcobject.name), // <-- Here's how you pass in the custom validator.
                Validators.required]);
            this.toolForm.controls['name'].updateValueAndValidity();

            this.toolForm.valueChanges.subscribe(val => {
                this.onSubmit();
            });

        }
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
        const newObject: RCImage = new RCImage(formModel.name, formModel.imageUrl, 'userClass', formModel.widthInPixels, formModel.heightInPixels);
        return newObject;
    }

    onTrash() {
        /*
         * Directly remove this on the model, model change will automatically result in view update.
         */
        this.rcExpoModel.exposition.removeObjectWithID(this.rcobject.id);
        this.onRemoveObject.emit(this.rcobject.id);
    }

    onImageSelect(event) {
        this.allowEditName = true;

        this.selectedImage = <File>event.target.files[0];
        const fd = new FormData();
        fd.append('uploadFile', this.selectedImage, this.selectedImage.name);
        this.http.post(Backend.uploadAddress, fd).subscribe(result => {
            this.onResult(result);
        });
        this.rcExpoModel.mde.render();
    }

    onResult(result) {
        if (this.toolForm) {
            this.toolForm.patchValue({
                imageUrl: Backend.baseAddress + result.url,
            });
        }
        let deepCopy = this.prepareSaveObject();
        this.rcExpoModel.exposition.replaceObjectWithID(this.rcobject.id, deepCopy);
        this.onChangedObject.emit(this.rcobject.id);
    }
}
