import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RCExpositionModel } from '../shared/RC-exposition-model.service';
import { tinymceDefaultSettings } from 'angular-tinymce';
import { TinyMceModule } from 'angular-tinymce';



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
  content:string = '';
  textContent:string = '';
  customTinyMCESettings = <any>{};

  @Input() 
  identity: string;

  @Output() 
  trash: EventEmitter<string> = new EventEmitter<string>();

  constructor(private rcExpoModel : RCExpositionModel ) {

  }

  onTrash() {
  	/*
  	 * Trash this, through parent.
  	 */
  	this.trash.emit(this.identity);
  }

  onChange($event) {
    alert("hey you typed something !");
  }

  ngOnInit() {
    this.customTinyMCESettings = tinymceDefaultSettings();
    this.customTinyMCESettings.height = '420px';
  }
}
