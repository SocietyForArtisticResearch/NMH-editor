import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RCExpoModel } from '../shared/RCExpoModel';
import { RCExpositionDeserializer } from '../shared/rcexposition';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-doc-uploader',
  templateUrl: './doc-uploader.component.html',
  styleUrls: ['./doc-uploader.component.css']
})
export class DocUploaderComponent implements OnInit {
  selectedFile : File = null;
  selectedJson : File = null;

  constructor(private http: HttpClient, private rcExpoModel: RCExpoModel) { }

  ngOnInit() {
  }

  onFileSelected(event) {
  	this.selectedFile = <File>event.target.files[0];
  }

  onJsonSelected(event) {
    this.selectedJson = <File>event.target.files[0];
  }

  onUpload() {
    //TODO check weird filenames!

  	const fd = new FormData();
  	fd.append('convertFile', this.selectedFile, this.selectedFile.name);
  	this.http.post('http://localhost:3000/import',fd).subscribe(result => { 
      this.onResult(result);
    } );

  }

  onJsonImport() {
    if(!this.selectedJson) {
      alert('please select json file first');
      return;
    }
    let reader = new FileReader();
    reader.onload = (e) => {
      let expositionJSON = JSON.parse(reader.result);
      //  console.log(expositionJSON);
      let exposition = RCExpositionDeserializer.restoreObject(expositionJSON);
      //  console.log(exposition);
      // a bit the dog wagging the tail ?
      this.rcExpoModel.exposition = exposition;
      // TODO ???
    }
    reader.readAsText(this.selectedJson);
  }

  onResult(result) {
    this.rcExpoModel.mde.importDocJSON(result);
  }

  jsonDownload( ) {
    var blob = new Blob([this.rcExpoModel.exposition.serialize()], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob,"exposition.json");
  }
}

/*

example code 
function saveJSON() {
    var blob = new Blob([exposition.serialize()], {type: "text/plain;charset=utf-8"});
    saveAs(blob,"exposition.json");
}


var fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', function(e) {
    var file = fileInput.files[0];
    
    var reader = new FileReader();
    
    reader.onload = function(e) {
  var expositionJSON = JSON.parse(reader.result);
//  console.log(expositionJSON);
  exposition = RCExpositionDeserializer.restoreObject(expositionJSON);
//  console.log(exposition);
  exposition.renderResponsive();
    };
    
    reader.readAsText(file);  

});
*/
