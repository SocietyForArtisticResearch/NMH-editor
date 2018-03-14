import { Component, OnInit } from '@angular/core';
import { DragDropDirective } from './drag-drop.directive';


@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css'],
})
export class DragAndDropComponent implements OnInit {
  private fileList : any = [];


  constructor() { }

  ngOnInit() {
  }

  onFilesChange(fileList : FileList){
    this.fileList = fileList;
    console.log('mf!');
    console.log(this.fileList);
  }
 
}
