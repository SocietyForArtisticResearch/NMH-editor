import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { RCMedia, RCAudio } from '../../shared/rcexposition';
import { FormControl, AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Backend } from '../../shared/Backend'



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
    selector: 'app-audio-tool',
    templateUrl: './audio-tool.component.html',
    styleUrls: ['./audio-tool.component.css']
})
export class AudioToolComponent implements OnInit {
    // name: string = '';
    collapsed: boolean = false;
    toolForm: FormGroup;
    toolType: string;
    selectedAudio: File = null;

    identifier: number;
    @Input() rcobject: RCMedia;
    @Input() id: number;

    @Output() onRemoveObject = new EventEmitter();



    constructor(private http: HttpClient, private rcExpoModel: RCExpoModel) { }

    ngOnInit() {
        this.identifier = this.rcobject.id;

        this.toolForm = new FormGroup({
            'name': new FormControl(this.rcobject.name,
                [
                    forbiddenNameValidator(this.rcExpoModel, this.rcobject.name), // <-- Here's how you pass in the custom validator.
                    Validators.required
                ]),
            'audioUrl': new FormControl(this.rcobject.url, [Validators.required])
        });


        this.toolType = this.rcobject.constructor.name;
    }

    ngOnChanges() {
        if (this.toolForm) {
            this.toolForm.setValue({
                name: this.rcobject.name,
                audioUrl: this.rcobject.url,
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

    prepareSaveObject(): RCAudio {
        const formModel = this.toolForm.value;
        const newObject: RCAudio = new RCAudio(formModel.name, formModel.audioUrl, false, false, 'userClass');
        return newObject;
    }

    onTrash() {
        /*
         * Directly remove this on the model, model change will automatically result in view update.
         */
        this.rcExpoModel.exposition.removeObjectWithID(this.rcobject.id);
        this.onRemoveObject.emit(this.rcobject.id);
    }

    onAudioSelect(event) {
        this.selectedAudio = <File>event.target.files[0];
        const fd = new FormData();
        fd.append('uploadFile', this.selectedAudio, this.selectedAudio.name);
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
    }
}
