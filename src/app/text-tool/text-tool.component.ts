import { Component, OnInit, Output, EventEmitter } from '@angular/core';

/*
 * This is a component, 
 */

@Component({
  selector: 'app-text-tool',
  templateUrl: './text-tool.component.html',
  styleUrls: ['./text-tool.component.css']
})
export class TextToolComponent implements OnInit {
  response:string = '';
  id:string = ""

  static count:number = 0;


  constructor() {
  	this.id = "text-tool-editbox-"+TextToolComponent.count;
  }


  @Output() 
  trash: EventEmitter<string> = new EventEmitter<string>();

  onTrash() {
  	/*
  	 * Trash this, through parent.
  	 */
  	this.trash.emit(this.id);
  }

  textChange($event) {
    this.response = $event.target.value;
  }

  ngOnInit() {
  }

}
