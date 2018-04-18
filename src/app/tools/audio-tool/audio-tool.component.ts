import { RCAudio } from '../../shared/rcexposition';
import { BasicToolComponent } from '../basic-tool/basic-tool.component';
import { Component } from '@angular/core';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { HttpClient } from '@angular/common/http';
import * as Utils from '../../shared/utils';
import { RCBackendMediaUpload } from '../../shared/RCBackendMediaUpload' ;




@Component({
    selector: 'app-audio-tool',
    templateUrl: '../basic-tool/basic-tool.component.html',
    styleUrls: ['../basic-tool/basic-tool.component.css']
})
export class AudioToolComponent extends BasicToolComponent {
    constructor(http: HttpClient,rcExpoModel: RCExpoModel,rcBackendMediaUpload: RCBackendMediaUpload) { 
        super(http,rcExpoModel,rcBackendMediaUpload);
        this.userMessage = "upload another audiofile";
        console.log('called');
    }

    prepareSaveObject(): RCAudio {
        const formModel = this.toolForm.value;
        let id = Utils.uniqueID();
        const newObject: RCAudio = new RCAudio(id, formModel.name);
        newObject.url = formModel.fileUrl;
        newObject.pxWidth = formModel.widthInPixels;
        newObject.pxHeight = formModel.heightInPixels;
        newObject.description = formModel.description;
        newObject.copyright = formModel.copyright;
        newObject.thumb = this.rcobject.thumb;
        return newObject;
    }
}
