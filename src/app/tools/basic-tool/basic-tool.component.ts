import { Component, Input, OnInit } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { RCExpoModel }  from '../../shared/RCExpoModel';
import { RCMedia, RCImage } from '../../shared/rcexposition';
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
  // name: string = '';
  collapsed: boolean = false;
  toolForm : FormGroup;
  toolType : string;

  identifier: number;
  @Input() object: RCMedia;
  @Input() id: number;


  constructor(private rcExpoModel: RCExpoModel) { }

  ngOnInit() {
    this.identifier = this.id;

    this.toolForm = new FormGroup({
      'name': new FormControl(this.object.name, [
      forbiddenNameValidator(this.rcExpoModel), // <-- Here's how you pass in the custom validator.
      Validators.required]),
      'imageUrl': new FormControl(this.object.url,[Validators.required]),
      'widthInPixels' : new FormControl(this.object.pxWidth),
      'heightInPixels' : new FormControl(this.object.pxHeight)
     });


    this.toolType = this.object.constructor.name;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.toolForm) {
      this.toolForm.setValue({
        name:    this.object.name,
        imageUrl: this.object.url,
        widthInPixels: this.object.pxWidth,
        heightInPixels : this.object.pxHeight
      });
    }
  }

  onSubmit() {
     // Angular protects its values of the model very strictly, so we have to update rcexposition through a deepcopy of the tool.
     let deepCopy = this.prepareSaveObject();
     this.rcExpoModel.exposition.replaceObjectWithID(this.object.id,deepCopy);
  }

  prepareSaveObject(): RCImage {
    const formModel = this.toolForm.value;
    const newObject :RCImage = new RCImage(formModel.name,formModel.imageUrl,'userClass',formModel.widthInPixels,formModel.heightInPixels);
    return newObject;
  }

  onTrash() {
    /*
     * Directly remove this on the model, model change will automatically result in view update.
     */
    this.rcExpoModel.exposition.removeObjectWithID(this.object.id);

  }

}
