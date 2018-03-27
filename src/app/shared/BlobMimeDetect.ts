/*

export class BlobMimeDetect {
	detect(blob, callback ) {
		var fileReader = new FileReader();
		fileReader.onloadend = function(e) {
		  var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
		  var header = "";
		  for(var i = 0; i < arr.length; i++) {
		     header += arr[i].toString(16);
		  }
		  console.log("header is: ",header);
		  let mime = this.parseHeader(header);
		  console.log("mime is: ",mime);

		  callback(mime);
		  // Check the file signature against known types

		};
		fileReader.readAsArrayBuffer(blob);
	}

	parseHeader(string: header) {
		var string: type;
		switch (header) {
		    case "89504e47":
		        type = "image/png";
		        break;
		    case "47494638":
		        type = "image/gif";
		        break;
		    case "ffd8ffe0":
		    case "ffd8ffe1":
		    case "ffd8ffe2":
		    case "ffd8ffe3":
		    case "ffd8ffe8":
		        type = "image/jpeg";
		        break;
		    case "fffb":
		    	type = "audio/mp3"
		    default:
		        type = blob.type; // Or you can use the blob.type as fallback
		        break;
			}
		return type;
	}
}
*/