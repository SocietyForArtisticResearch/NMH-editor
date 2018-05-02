import { Component } from '@angular/core';
import { BasicToolComponent } from '../basic-tool/basic-tool.component';
import { RCVideo } from '../../shared/rcexposition';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { HttpClient } from '@angular/common/http';
import * as Utils from '../../shared/utils';
import { RCBackendMediaUpload } from '../../shared/RCBackendMediaUpload';



@Component({
    selector: 'app-video-tool',
    templateUrl: '../basic-tool/basic-tool.component.html',
    styleUrls: ['../basic-tool/basic-tool.component.css']
})
export class VideoToolComponent extends BasicToolComponent {
    constructor(http: HttpClient,rcExpoModel: RCExpoModel,rcBackendMediaUpload: RCBackendMediaUpload) { 
        super(http,rcExpoModel,rcBackendMediaUpload);
        this.userMessage = "upload another video";
    }

    prepareSaveObject(): RCVideo {
        const formModel = this.toolForm.value;

        let id = Utils.uniqueID();
        const newObject: RCVideo = new RCVideo(id, formModel.name);
        newObject.url = formModel.fileUrl;
        newObject.pxWidth = formModel.widthInPixels;
        newObject.pxHeight = formModel.heightInPixels;
        newObject.description = formModel.description;
        newObject.copyright = formModel.copyright;
        newObject.thumb = this.rcobject.thumb;
        newObject.transcodingStatus = this.rcobject.transcodingStatus;
        newObject.userClass = formModel.imageClassSelect;
        
        return newObject;
    }
}

