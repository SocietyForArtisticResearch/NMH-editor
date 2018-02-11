import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-object-list',
  templateUrl: './object-list.component.html',
  styleUrls: ['./object-list.component.css']
})
export class ObjectListComponent implements OnInit {
  expositionObjects = [];

  constructor() { }

  trashTool(id) {
    console.log('delete tools with '+id)
    this.expositionObjects = this.expositionObjects.filter( (object) => { return object.identity !== id } ); 
  }

  createTextTool($event) {
    let indexNumber = this.expositionObjects.length + 1;

  	this.expositionObjects.push( {
  		idx : indexNumber,
      identity : 'text-tool-editbox-'+ indexNumber
  	});
  }

  ngOnInit() {
  }

}
