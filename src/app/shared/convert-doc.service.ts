import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConvertDocService {

	constructor(private http: HttpClient) {
	
	}

    convert(markdownString: string, fileType : string) { //get file from service
    		let expositionJson = { markdown : markdownString };
    		let stringyfied = JSON.stringify(expositionJson);
	        this.http.post("http://localhost:3000/convert", stringyfied);
	    }).subscribe(
	        (response) => { // download file
	            var blob = new Blob([response.blob()], {type: 'application'+fileType});
	            var filename = 'file.'+fileType;
	            saveAs(blob, filename);
	    });
	}
}
