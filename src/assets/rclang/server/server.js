const http = require("http");
const path = require("path");
const fs = require("fs");
const child = require('child_process');
const process = require('process');

const port = 3000;

const server = http.createServer();

server.on('request', (request, response) => {
    let body = [];
    let splitURL = request.url.replace(/^\/|\/$/g, '').split(path.sep);
    console.log(splitURL);
    
    request.on('data', (chunk) => {
	body.push(chunk);
    }).on('end', () => {

	body = Buffer.concat(body).toString();

//	console.log(splitURL);
//	console.log(request.url);
	
//	console.log(body);
	
	switch (splitURL[0]) {
	    case "pandoc":
	    // write md file
	    let testpath = path.resolve(__dirname, '..', 'tests/');
	    
	    process.chdir(testpath);
	    
	    fs.writeFile("tmp.md", body, err => {
		if (err) {
		    throw err;
		} 
		let ending = splitURL[1];

		
		child.exec(`pandoc -s -o tmp.${ending} tmp.md`, (err, stdoutm, stderr) => {
		    response.writeHead(200,
				       { 'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*' });	
		    //respond with file path
		    response.write(`tmp.${ending}`);
		    response.end();
		});
	    });
	    break;
	    
	    // call pandoc
	}

    });
});


server.listen(port);
console.log(`Server is listening on port ${port}`);
