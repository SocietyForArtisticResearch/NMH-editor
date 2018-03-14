import { Component, OnInit } from '@angular/core';
import { DragDropDirective } from './drag-drop.directive';
import { Backend } from '../shared/Backend';
import { RCExpoModel } from '../shared/RCExpoModel';
import { RCImage } from '../shared/rcexposition';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css'],
})
export class DragAndDropComponent implements OnInit {
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
      let imageName = 'image' + this.rcExpoModel.exposition.media.length;
      let imageUri = Backend.baseAddress + result.url;
      let imageObject = new RCImage(imageName, imageUri, 'myClass', null, null);
      this.rcExpoModel.exposition.addObject(imageObject);
  }
 
}
