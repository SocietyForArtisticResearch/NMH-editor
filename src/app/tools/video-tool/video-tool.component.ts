import { Component } from '@angular/core';
import { BasicToolComponent } from '../basic-tool/basic-tool.component';
import { RCVideo } from '../../shared/rcexposition';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { HttpClient } from '@angular/common/http';
import * as Utils from '../../shared/utils';


@Component({
    selector: 'app-video-tool',
    templateUrl: './video-tool.component.html',
    styleUrls: ['./video-tool.component.css']
})
export class VideoToolComponent extends BasicToolComponent {
    constructor(http: HttpClient,rcExpoModel: RCExpoModel) { 
        super(http,rcExpoModel);
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
}

