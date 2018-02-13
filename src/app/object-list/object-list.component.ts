import { Component, OnInit } from '@angular/core';
import { RCExpositionModel } from '../shared/RC-exposition-model.service';
import { TextToolData } from '../shared/tools/text-tooldata';


@Component({
  selector: 'app-object-list',
  templateUrl: './object-list.component.html',
  styleUrls: ['./object-list.component.css']
})
export class ObjectListComponent implements OnInit {
  expositionObjects = [];

  constructor( private rcExpoModel : RCExpositionModel ) { }

  createTextTool($event) {
    // make sure our model knows about
  	this.rcExpoModel.addTool( 'text' );

  }

  renderAll() {
    this.rcExpoModel.renderTest();
  }

  ngOnInit() {
    // This method assigns the model array directly to this instance.
    this.expositionObjects = this.rcExpoModel.expositionObjects;
  }
}
