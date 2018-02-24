import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RCExpoModel } from '../shared/RCExpoModel';

@Component({
  selector: 'app-doc-uploader',
  templateUrl: './doc-uploader.component.html',
  styleUrls: ['./doc-uploader.component.css']
})
export class DocUploaderComponent implements OnInit {
  selectedFile : File = null;

  constructor(private http: HttpClient, private rcExpoModel: RCExpoModel) { }

  ngOnInit() {
  }

  onFileSelected(event) {
  	this.selectedFile = <File>event.target.files[0];
  }

  onUpload() {
    //TODO check weird filenames!

  	const fd = new FormData();
  	fd.append('convertFile', this.selectedFile, this.selectedFile.name);
  	this.http.post('http://localhost:3000/import',fd).subscribe(result => { 
      this.onResult(result);
    } );

  }

  onResult(result) {
    console.log(result,'result');
    this.rcExpoModel.mde.importDocJSON(result);
  }

}
