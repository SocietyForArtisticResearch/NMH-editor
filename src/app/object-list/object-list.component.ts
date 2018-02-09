import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-object-list',
  templateUrl: './object-list.component.html',
  styleUrls: ['./object-list.component.css']
})
export class ObjectListComponent implements OnInit {
  expositionObjects = [];


  constructor() { }

  createTextTool($event) {
  	this.expositionObjects.push( {
  		'name' : 'casper'
  	});
  }

  ngOnInit() {
  }

}
