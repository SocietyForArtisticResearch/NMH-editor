import { Component, Input, OnInit } from '@angular/core';
import { RCExpoModel }  from '../../shared/RCExpoModel';


@Component({
  selector: 'app-basic-tool',
  templateUrl: './basic-tool.component.html',
  styleUrls: ['./basic-tool.component.css']
})
export class BasicToolComponent implements OnInit {
  name: string = '';
  collapsed: boolean = false;

  @Input() toolType = 'basic';
  @Input() identifier: number;

  constructor(private rcExpoModel: RCExpoModel) { }

  ngOnInit() {
  }

  onTrash() {
    /*
     * Directly remove this on the model, model change will automatically result in view update.
     */
    this.rcExpoModel.exposition.removeObjectWithID(this.identifier);
  }

}
