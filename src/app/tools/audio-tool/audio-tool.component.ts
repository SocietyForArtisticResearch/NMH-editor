import { RCAudio } from '../../shared/rcexposition';
import { BasicToolComponent } from '../basic-tool/basic-tool.component';
import { Component } from '@angular/core';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { HttpClient } from '@angular/common/http';
import * as Utils from '../../shared/utils';
import { RCBackendMediaUpload } from '../../shared/RCBackendMediaUpload' ;




@Component({
    selector: 'app-audio-tool',
    templateUrl: './audio-tool.component.html',
    styleUrls: ['./audio-tool.component.css']
})
export class AudioToolComponent extends BasicToolComponent {
    constructor(http: HttpClient,rcExpoModel: RCExpoModel,rcBackendMediaUpload: RCBackendMediaUpload) { 
        super(http,rcExpoModel,rcBackendMediaUpload);
    }

    prepareSaveObject(): RCAudio {
        const formModel = this.toolForm.value;
        let id = Utils.uniqueID();
        const newObject: RCAudio = new RCAudio(id, formModel.name);
        newObject.url = formModel.fileUrl;
        return newObject;
    }
}
