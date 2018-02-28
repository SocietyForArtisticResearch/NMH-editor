import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { RCExpoModel }  from '../../shared/RCExpoModel';
import { RCMedia, RCImage } from '../../shared/rcexposition';
import { FormControl, AbstractControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';



function forbiddenNameValidator(rcModel: RCExpoModel,oldName: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    if (control.value === oldName) {
      // old name is allowed.
      return null;
    }
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
  selectedImage : File = null;

  identifier: number;
  @Input() object: RCMedia;
  @Input() id: number;

  @Output() onRemoveObject = new EventEmitter();



  constructor(private http: HttpClient,private rcExpoModel: RCExpoModel) { }

  ngOnInit() {
    this.identifier = this.object.id;

    this.toolForm = new FormGroup({
      'name': new FormControl(this.object.name, [
      forbiddenNameValidator(this.rcExpoModel,this.object.name), // <-- Here's how you pass in the custom validator.
      Validators.required]),
      'imageUrl': new FormControl(this.object.url,[Validators.required]),
      'widthInPixels' : new FormControl(this.object.pxWidth),
      'heightInPixels' : new FormControl(this.object.pxHeight)
     });


    this.toolType = this.object.constructor.name;
  }

  ngOnChanges() {
    console.log(this.object);
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
    this.onRemoveObject.emit(this.object.id);
  }

  onImageSelect(event) {
    this.selectedImage = <File>event.target.files[0];
  }

  onImageUpload() {
    const fd = new FormData();
    fd.append('uploadFile', this.selectedImage, this.selectedImage.name);
    this.http.post('http://localhost:3000/uploadAngular', fd).subscribe(result => {
        this.onResult(result);
    });
  }

  onResult(result) {
    if (this.toolForm) {
      this.toolForm.patchValue({
        imageUrl: result.url,
      });
    }
    let deepCopy = this.prepareSaveObject();
    this.rcExpoModel.exposition.replaceObjectWithID(this.object.id,deepCopy);
  }
}
