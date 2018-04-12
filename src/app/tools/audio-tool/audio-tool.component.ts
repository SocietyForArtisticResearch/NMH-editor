import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { RCMedia, RCAudio } from '../../shared/rcexposition';
import { FormControl, AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpEventType, HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { Backend } from '../../shared/Backend';

import * as Utils from '../../shared/utils';

import { BasicToolComponent } from '../basic-tool/basic-tool.component';


@Component({
    selector: 'app-audio-tool',
    templateUrl: './audio-tool.component.html',
    styleUrls: ['./audio-tool.component.css']
})
export class AudioToolComponent extends BasicToolComponent {
    constructor(private http: HttpClient, private rcExpoModel: RCExpoModel) { 
        super();
    }


    prepareSaveObject(): RCAudio {
        const formModel = this.toolForm.value;
        let id = Utils.uniqueID();
        const newObject: RCAudio = new RCAudio(id, formModel.name);
        newObject.url = formModel.audioUrl;
        return newObject;
    }
}
