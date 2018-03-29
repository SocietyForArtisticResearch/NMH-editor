import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { DragDropDirective } from './drag-drop.directive';
import { Backend } from '../shared/Backend';
import { RCExpoModel } from '../shared/RCExpoModel';
import { RCImage, RCObject, RCAudio, RCVideo } from '../shared/rcexposition';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse  } from '@angular/common/http';
//import { BlobMimeDetect } from '../shared/BlobMimeDetect';



@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css'],
})
export class DragAndDropComponent implements OnInit {
  @Output() onChangedObject = new EventEmitter();
  @Input() isBigger: boolean;

  fileUploadStatus: string = null;

  constructor(
    private http: HttpClient, 
    private rcExpoModel: RCExpoModel
  ) { }

  ngOnInit() {
  
  }

  onFilesChange(fileList : FileList) {
    this.fileUploadStatus = 'upload in progress';
    
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
          this.fileUploadStatus = Math.round(100 * event.loaded / event.total) + '%';
          console.log('this.fileUploadStatus',this.fileUploadStatus)
        } else if (event instanceof HttpResponse) {
          this.fileUploadStatus = 'done';
          window.setTimeout( ( ) => { this.fileUploadStatus = null }, 1000 );
          this.onResult(event.body);
          }
      });
    }
  }

  onResult(result) {
      let mimeType = result.mime;

      let newRCObject: RCObject = null;
      
      if (mimeType.includes('image')) {

        let imageName = 'image' + this.rcExpoModel.exposition.media.length;
        let imageUri = Backend.baseAddress + result.url;
        newRCObject = new RCImage(imageName, imageUri, 'myClass', null, null);
      } else if (mimeType.includes('audio')) {
        let audioName = 'audio' + this.rcExpoModel.exposition.media.length;
        let audioUri = Backend.baseAddress + result.url;
        //(name: string, url: string, autoplay, loop, userClass, pxWidth?: number, pxHeight?: number) {
        // super(name, url, "rcaudio", userClass, pxWidth, pxHeight);
        newRCObject = new RCAudio(audioName,audioUri, false, false, 'myClass', null,null);
   
      } else if (mimeType.includes('video')) {
        let videoName = 'video' + this.rcExpoModel.exposition.media.length;
        let videoUri = Backend.baseAddress + result.url;
        //(name, url, autoplay, loop, userClass, pxWidth?: number, pxHeight?: number) 
        newRCObject = new RCVideo(videoName,videoUri,'myClass',null,null);
      }

      this.rcExpoModel.exposition.addObject(newRCObject);
      this.onChangedObject.emit(newRCObject.id);
  }

  onClick() {
    window.document.getElementById('dropzone-manual-input').click();
  }

  onFileSelected($event) {
    this.onFilesChange($event.target.files);
  }
 
}
