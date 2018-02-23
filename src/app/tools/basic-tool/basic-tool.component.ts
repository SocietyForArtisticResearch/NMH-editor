import { Component, Input, OnInit } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { RCExpoModel }  from '../../shared/RCExpoModel';
import { FormControl, AbstractControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';


function forbiddenNameValidator(rcModel: RCExpoModel): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const forbidden = rcModel.exposition.getObjectWithName(control.value);
    return forbidden ? {'name exists, be creative!': {value: control.value}} : null;
  };
}


@Component({
  selector: 'app-basic-tool',
  templateUrl: './basic-tool.component.html',
  styleUrls: ['./basic-tool.component.css']
})
export class BasicToolComponent implements OnInit {
  name: string = '';
  collapsed: boolean = false;
  toolForm : FormGroup;

  @Input() toolType = 'basic';
  @Input() identifier: number;

  constructor(private rcExpoModel: RCExpoModel) { }

  ngOnInit() {
    this.toolForm = new FormGroup({
      'name': new FormControl(this.name, [
      forbiddenNameValidator(this.rcExpoModel), // <-- Here's how you pass in the custom validator.
      Validators.required
      ])
    });
  }

  onNameChange($event) {
     var object = this.rcExpoModel.exposition.getObjectWithID(this.identifier);
     object.name = $event.target.value;
  }

  onTrash() {
    /*
     * Directly remove this on the model, model change will automatically result in view update.
     */
    this.rcExpoModel.exposition.removeObjectWithID(this.identifier);
  }

}
