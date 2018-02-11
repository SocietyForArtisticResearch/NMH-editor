import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

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
  static count:number = 0;

  @Input() 
  identity: string;

  @Output() 
  trash: EventEmitter<string> = new EventEmitter<string>();

  constructor() {

  }

  

  onTrash() {
  	/*
  	 * Trash this, through parent.
  	 */
  	this.trash.emit(this.identity);
  }

  textChange($event) {
    this.response = $event.target.value;
  }

  ngOnInit() {
  }

}
