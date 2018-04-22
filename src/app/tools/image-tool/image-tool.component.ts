import { Component } from '@angular/core';
import { BasicToolComponent } from '../basic-tool/basic-tool.component';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { RCImage } from '../../shared/rcexposition';

import { HttpClient } from '@angular/common/http';
import * as Utils from '../../shared/utils';
import { RCBackendMediaUpload } from '../../shared/RCBackendMediaUpload';




@Component({
  selector: 'app-image-tool',
    templateUrl: '../basic-tool/basic-tool.component.html',
    styleUrls: ['../basic-tool/basic-tool.component.css']
})
export class ImageToolComponent extends BasicToolComponent {
    constructor(http: HttpClient,rcExpoModel: RCExpoModel,rcBackendMediaUpload: RCBackendMediaUpload) { 
        super(http,rcExpoModel,rcBackendMediaUpload);
        this.userMessage = "upload another image";
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
        newObject.thumb = this.rcobject.thumb;
        newObject.transcodingStatus = this.rcobject.transcodingStatus;
        return newObject;
    }
}
