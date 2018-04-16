import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { DragDropDirective } from './drag-drop.directive';
import { Backend } from '../shared/Backend';
import { RCExpoModel } from '../shared/RCExpoModel';
import { RCImage, RCObject, RCAudio, RCVideo } from '../shared/rcexposition';
import * as Utils from '../shared/utils';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { RCBackendMediaUpload } from '../shared/RCBackendMediaUpload';
//import { BlobMimeDetect } from '../shared/BlobMimeDetect';

@Component({
    selector: 'app-drag-and-drop',
    templateUrl: './drag-and-drop.component.html',
    styleUrls: ['./drag-and-drop.component.css'],
})
export class DragAndDropComponent implements OnInit {
    @Output() onChangedObject = new EventEmitter<number>();
    @Input() isBigger: boolean;

    fileUploadStatus: string = null;

    constructor(
        private http: HttpClient,
        private rcExpoModel: RCExpoModel,
        private backendUpload: RCBackendMediaUpload
    ) { }

    ngOnInit() {

    }

    uploadFileRC(fileList: FileList) {
        this.fileUploadStatus = 'upload in progress';

        if (fileList.length > 0) {
            let selectedFile = fileList[0];
            let fileType = selectedFile.type;
            console.log(selectedFile.type);

            if (fileType.includes('image')) {
                fileType = 'image';
            } else if (fileType.includes('audio')) {
                fileType = 'audio';
            } else if (fileType.includes('video')) {
                fileType = 'video';
            } else if (fileType.includes('pdf')) {
                fileType = 'pdf';
            }

            let onResult = ( evt :any ) => { this.onResult(evt) };
            let onProgress = ( progress: string ) => { this.fileUploadStatus = progress };
            this.backendUpload.uploadFile(fileList,fileType,onResult,onProgress);

        }
    }


    onFilesChange(fileList: FileList) {
        this.fileUploadStatus = 'upload in progress';

        Backend.useRC = true;

        if (Backend.useRC) { // TODO detect BACKEND setting !!!
            this.uploadFileRC(fileList);
        } else {

            if (fileList.length > 0) {

                let selectedFile = fileList[0];

                const fd = new FormData();
                fd.append('uploadFile', selectedFile, selectedFile.name);

                const req = new HttpRequest('POST', Backend.uploadAddress, fd, {
                    reportProgress: true,
                });

                this.http.request(req).subscribe(event => {
                    // Via this API, you get access to the raw event stream.
                    // Look for upload progress events.
                    if (event.type === HttpEventType.UploadProgress) {
                        // This is an upload progress event. Compute and show the % done:
                        this.fileUploadStatus = 'uploading ' + Math.round(100 * event.loaded / event.total) + '%';
                    } else if (event instanceof HttpResponse) {
                        this.fileUploadStatus = 'done';
                        window.setTimeout(() => { this.fileUploadStatus = null }, 1000);
                        this.onResult(event.body);
                    }
                });
            }
        }
    }

    onResult(result) {
        let mimeType = result.mime;

        let newRCObject: RCObject = null;

        if (mimeType.includes('image')) {
            let imageName = 'image' + this.rcExpoModel.exposition.media.length;
            if (Backend.useRC) {
                // TODO upload to RC, get ID and make rc object
            } else {
                let imageUri = Backend.baseAddress + result.url;
                newRCObject = new RCImage(Utils.uniqueID(), imageName);
                newRCObject.url = imageUri;
            }
        } else if (mimeType.includes('audio')) {
            let audioName = 'audio' + this.rcExpoModel.exposition.media.length;
            if (Backend.useRC) {
                // TODO upload to RC, get ID and make rc object
            } else {
                let audioUri = Backend.baseAddress + result.url;
                newRCObject = new RCAudio(Utils.uniqueID(), audioName);
                newRCObject.url = audioUri;
            }
        } else if (mimeType.includes('video')) {
            let videoName = 'video' + this.rcExpoModel.exposition.media.length;
            let videoUri = Backend.baseAddress + result.url;
            if (Backend.useRC) {
                // TODO upload to RC, get ID and make rc object
            } else {
                let audioUri = Backend.baseAddress + result.url;
                newRCObject = new RCVideo(Utils.uniqueID(), videoName);
                newRCObject.url = videoUri;
            }


        }

        this.rcExpoModel.exposition.addObject(newRCObject);
        this.onChangedObject.emit(newRCObject.id);
    }

    onClick() {
        window.document.getElementById('dropzone-manual-input').click();
    }

    onFileSelected($event) {
        this.uploadFileRC($event.target.files);
        this.onFilesChange($event.target.files);
    }

}
