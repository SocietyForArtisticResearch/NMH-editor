import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Trying a proper module this time.

@Injectable()
export class ConvertDocService {

	constructor(private http: HttpClient) {
	
	}

    convert(markdownString: string, fileType : string) { //get file from service
    		let url = "http://localhost:3000/export/"+fileType;
    		let expositionJson = { markdown : markdownString };
    		let stringyfied = JSON.stringify(expositionJson);
    		console.log()
	        this.http.post(url , stringyfied).subscribe(
	        (response: any) => { // download file
	            let blob = new Blob([response.blob()], {type: 'application/'+fileType});
	            let filename = 'file.'+fileType;
	            saveAs(blob, filename);
	    });
	}
}
