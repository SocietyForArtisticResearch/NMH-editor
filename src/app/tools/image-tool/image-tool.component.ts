import { Component, OnInit } from '@angular/core';
import { RCExpoModel }  from '../../shared/RCExpoModel';


@Component({
  selector: 'app-image-tool',
  templateUrl: './image-tool.component.html',
  styleUrls: ['./image-tool.component.css']
})
export class ImageToolComponent implements OnInit {

  constructor(private rcExpoModel : RCExpoModel) { }

  ngOnInit() {
  }

}
