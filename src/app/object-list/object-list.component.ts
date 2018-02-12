import { Component, OnInit } from '@angular/core';
import { RCExpositionModel } from '../shared/RC-exposition-model.service';


@Component({
  selector: 'app-object-list',
  templateUrl: './object-list.component.html',
  styleUrls: ['./object-list.component.css']
})
export class ObjectListComponent implements OnInit {
  expositionObjects = [];

  constructor( private rcExpoModel : RCExpositionModel ) { }

  trashTool(id) {
    this.expositionObjects = this.expositionObjects.filter( (object) => { return object.identity !== id } ); 
  }

  createTextTool($event) {
    let indexNumber = this.expositionObjects.length + 1;

  	this.expositionObjects.push( {
  		idx : indexNumber,
      identity : 'text-tool-editbox-'+ indexNumber
  	});
  }

  renderAll() {

  }

  ngOnInit() {
    // This method assigns the model array directly to this instance.
    this.expositionObjects = this.rcExpoModel.expositionObjects;
  }
}
