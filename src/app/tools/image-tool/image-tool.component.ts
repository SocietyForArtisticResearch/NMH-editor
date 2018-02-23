import { Component, OnInit, Input } from '@angular/core';
import { RCExpoModel }  from '../../shared/RCExpoModel';



@Component({
  selector: 'app-image-tool',
  templateUrl: './image-tool.component.html',
  styleUrls: ['./image-tool.component.css']
})
export class ImageToolComponent implements OnInit {
  @Input() identifier: number;

  id: string = 'blah';

  imageUrl: string = 'myUrl';
  pxWidth: number = 100;
  pxHeight: number = 100;

  constructor(private rcExpoModel : RCExpoModel) { }

  ngOnInit() {
  	this.id = 'imageTool=' + this.identifier;

    window.setTimeout( ( ) => { this.imageUrl = "thisIsMyImageUrl"; }, 2000);

  }

}
