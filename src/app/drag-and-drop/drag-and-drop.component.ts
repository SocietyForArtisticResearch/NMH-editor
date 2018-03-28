import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DragDropDirective } from './drag-drop.directive';
import { Backend } from '../shared/Backend';
import { RCExpoModel } from '../shared/RCExpoModel';
import { RCImage, RCObject, RCAudio, RCVideo } from '../shared/rcexposition';
import { HttpClient } from '@angular/common/http';
//import { BlobMimeDetect } from '../shared/BlobMimeDetect';



@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css'],
})
export class DragAndDropComponent implements OnInit {
  @Output() onChangedObject = new EventEmitter();

  constructor(private http: HttpClient, private rcExpoModel: RCExpoModel) { }

  ngOnInit() {
  
  }

  onFilesChange(fileList : FileList) {
    // image dropped (should add check !)
    if (fileList.length > 0) {
      
      let selectedImage = fileList[0];

      const fd = new FormData();
      fd.append('uploadFile', selectedImage, selectedImage.name);
      this.http.post(Backend.uploadAddress, fd).subscribe(result => {
        this.onResult(result);
      });
    }
  }

  onResult(result) {
      let mimeType = result.mime;
      
      if (mimeType.includes('image')) {

        let imageName = 'image' + this.rcExpoModel.exposition.media.length;
        

        let imageUri = Backend.baseAddress + result.url;
        let imageObject = new RCImage(imageName, imageUri, 'myClass', null, null);


        this.rcExpoModel.exposition.addObject(imageObject);

        this.onChangedObject.emit(imageObject.id);
      } else if (mimeType.includes('audio')) {
        let audioName = 'audio' + this.rcExpoModel.exposition.media.length;

        let audioUri = Backend.baseAddress + result.url;
        //(name: string, url: string, autoplay, loop, userClass, pxWidth?: number, pxHeight?: number) {
        // super(name, url, "rcaudio", userClass, pxWidth, pxHeight);
        let audioObject = new RCAudio(audioName,audioUri, false, false, 'myClass', null,null);
        this.rcExpoModel.exposition.addObject(audioObject);
        this.onChangedObject.emit(audioObject.id);
      }
  }

  onClick() {
    window.document.getElementById('dropzone-manual-input').click();
  }

  onFileSelected($event) {
    this.onFilesChange($event.target.files);
  }
 
}
