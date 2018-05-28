import { Component, OnInit } from '@angular/core';

import { RCPdf } from '../../shared/rcexposition';
import { BasicToolComponent } from '../basic-tool/basic-tool.component';
import { RCExpoModel } from '../../shared/RCExpoModel';

import { HttpClient } from '@angular/common/http';
import * as Utils from '../../shared/utils';
import { RCBackendMediaUpload } from '../../shared/RCBackendMediaUpload';





@Component({
  selector: 'app-pdf-tool',
  templateUrl: '../basic-tool/basic-tool.component.html',
  styleUrls: ['../basic-tool/basic-tool.component.css']
})
export class PdfToolComponent extends BasicToolComponent {
    
    constructor(http: HttpClient,rcExpoModel: RCExpoModel,rcBackendMediaUpload: RCBackendMediaUpload) { 
        super(http,rcExpoModel,rcBackendMediaUpload);
        this.userMessage = "upload another image";
    }
	
    prepareSaveObject(): RCPdf {
        const formModel = this.toolForm.value;
        // this id will be thrown away:
        let id = Utils.uniqueID();
        const newObject: RCPdf = new RCPdf(id, formModel.name);
        newObject.url = formModel.fileUrl;
        newObject.pxWidth = formModel.widthInPixels;
        newObject.pxHeight = formModel.heightInPixels;
        newObject.description = formModel.description;
        newObject.copyright = formModel.copyright;
        newObject.thumb = this.rcobject.thumb;
        newObject.transcodingStatus = this.rcobject.transcodingStatus;
        newObject.userClass = formModel.imageClassSelect;
        console.log('debug prepareSaveObject, pxWidth&pxHeight should be null',newObject);
        return newObject;
    }
}
