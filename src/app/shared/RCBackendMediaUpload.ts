

import { Backend } from './Backend';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { RCExpoModel } from './RCExpoModel';
import * as Utils from '../shared/utils';

export interface RCMetaData {
    copyrightholder: string,
    description: string,
    name: string
};

/*
 * This class is only for updating and editing media entries in the RC API.
 */

@Injectable()
export class RCBackendMediaUpload {
    constructor(
        private http: HttpClient,
        private rcExpoModel: RCExpoModel
    ) { }

    uploadFile(
        fileList,
        onResult: (httpEvent: any) => void,
        onProgress: (progress: string) => void,
        metaData: RCMetaData = null) {

        /*
         * uploads a file to RC, and takes a callback to return the result.
         * add media: https://dev.researchcatalogue.net/text-editor/simple-media-add?research=32350 
         * (POST) mit {mediatype=video|image|audio|pdf, media=FILE, name=XXX, copyrightholder=XXX, description=XXX}
        */

        let selectedFile = fileList[0];
        // using Javascript file api, may not work everywhere ?
        let fileType = selectedFile.type;

        // fetch some values for metadata (for drag and drop convenience)

        let authors = " ";//this.rcExpoModel.exposition.authors[0] ? this.rcExpoModel.exposition.authors[0] : 'no author';

        let copyrightholder = "Please insert copyright information";

        let rcMetaData: RCMetaData = {
            // default values:
            copyrightholder: copyrightholder,
            description: 'description',
            name: selectedFile.name
        };

        if (metaData !== null) {
            // merge with user provided data
            Object.assign(rcMetaData, metaData);
        }

        if (fileType.includes('image')) {
            fileType = 'image';
        } else if (fileType.includes('audio')) {
            fileType = 'audio';
        } else if (fileType.includes('video')) {
            fileType = 'video';
        } else if (fileType.includes('pdf')) {
            fileType = 'pdf';
        }

        if (fileList.length > 0) {
            let selectedFile = fileList[0];

            let uploadApiUrl = Backend.rcMediaUpload;
            let expositionId = this.rcExpoModel.exposition.id;

            var fd = new FormData();
            
            fd.append('mediatype', fileType);
            fd.append('name', rcMetaData.name);
            fd.append('media', selectedFile);
            fd.append('copyrightholder', rcMetaData.copyrightholder);
            fd.append('description', rcMetaData.description);
            fd.append('thumb',new File([""], "")); // RC api required thumb.


            //console.log('formdata',fd);

            var req = new HttpRequest('POST', uploadApiUrl + '?research=' + String(expositionId), fd, {
                reportProgress: true
            });

            //console.log('request',req);

            this.http.request(req).subscribe(event => {
                // Via this API, you get access to the raw event stream.
                // Look for upload progress events.
                if (event.type === HttpEventType.UploadProgress) {
                    // This is an upload progress event. Compute and show the % done:
                    onProgress('uploading ' + Math.round(100 * event.loaded / event.total) + '%');
                } else if (event instanceof HttpResponse) {
                    onProgress('done');
                    this.rcExpoModel.syncModelWithRC();
                    window.setTimeout(() => { onProgress(''); }, 1000);
                    onResult(event.body);
                }
            });
        }
    }

    removeObjectFromRC(rcobjectid: number, reSync: boolean = true, onSuccess? : ( ) => void ) {
        let id = this.rcExpoModel.exposition.id;
        var xhttp = new XMLHttpRequest();
        var that = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (reSync) {
                    let body = this.response;
                    //console.log('deleted tool, response body',body);
                    that.rcExpoModel.syncModelWithRC(onSuccess);
                }
            } else {
                console.log('RC Simple Media API error (status, response):  ', this.status, this.response);
            }
        };
        //        console.log(`${Backend.rcBaseAddress}text-editor/simple-media-list?research=${id}`);
        xhttp.open("POST", `${Backend.rcBaseAddress}text-editor/simple-media-remove?research=${id}&simple-media=${rcobjectid}`, true);
        xhttp.send();
    }


    replaceFileRC(
        rcobjectid: number,
        fileList,
        onResult: (httpEvent: any) => void,
        onProgress: (progress: string) => void
    ) {
        let oldRCObject = this.rcExpoModel.exposition.getObjectWithID(rcobjectid);

        let metadata: RCMetaData = {
            copyrightholder: oldRCObject.copyright,
            description: oldRCObject.description,
            name: oldRCObject.name // old name, so that reference in expo doesn't break!
        }

         // prepare metadata
        let fd = new FormData();
        fd.append('name', metadata.name);
        fd.append('copyrightholder', metadata.copyrightholder);
        fd.append('description', metadata.description);
        fd.append('thumb', fileList[0]);
        fd.append('media', fileList[0]);

        let editApiUrl = Backend.rcMediaEdit;
        let expositionId = this.rcExpoModel.exposition.id;

        var req = new HttpRequest('POST', editApiUrl + `?research=${expositionId}&simple-media=${rcobjectid}`, fd, {
                reportProgress: true
        });

        console.log('request',req);

        this.http.request(req).subscribe(event => {
            // Via this API, you get access to the raw event stream.
            // Look for upload progress events.
            if (event.type === HttpEventType.UploadProgress) {
                // This is an upload progress event. Compute and show the % done:
                onProgress('uploading ' + Math.round(100 * event.loaded / event.total) + '%');
            } else if (event instanceof HttpResponse) {
                onProgress('done');
                

                let refreshImagesWhenComplete = ( ) => {
                    // this should force the image to refresh
                    let rcobj = this.rcExpoModel.exposition.getObjectWithID(rcobjectid);
                    rcobj.thumb = rcobj.thumb.split('?')[0] + '?=' + new Date().getTime();  
                    rcobj.url = rcobj.url.split('?')[0] + '?=' + new Date().getTime();
                }; 

                this.rcExpoModel.syncModelWithRC(refreshImagesWhenComplete);

                window.setTimeout(() => { onProgress(''); }, 1000);
                onResult(event.body);
            }
        });
        
    }

    editObjectFromRC(rcobjectid: number, metadata: RCMetaData) {
        let expositionid = this.rcExpoModel.exposition.id;

        // prepare metadata
        let fd = new FormData();
        fd.append('name', metadata.name);
        fd.append('copyrightholder', metadata.copyrightholder);
        fd.append('description', metadata.description);
        fd.append('thumb', new File([""], ""));
        fd.append('media', new File([""], ""));


        let xhttp = new XMLHttpRequest();
        var that = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let body = this.response;
                console.log('edit tool call',body);
                that.rcExpoModel.syncModelWithRC();
            } else {
                console.log('RC Simple Media API error, edit (status, response):  ', this.status, this.response);
            }
        };
        xhttp.open("POST", `${Backend.rcBaseAddress}text-editor/simple-media-edit?research=${expositionid}&simple-media=${rcobjectid}`, true);
        xhttp.send(fd);

    }

}
