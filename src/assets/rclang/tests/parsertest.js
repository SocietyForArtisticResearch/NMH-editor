// global var containing exposition
let exposition;

function getMarkdownInput() {

    // parsing
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    let input = document.getElementById("markdownInput").value;
    let lines = input.split("\n");
    for (let i = 0; i < lines.length; i++) {
//	if (!((lines[i]=="") || (lines[i]==" "))) {
	    // TODO catch error and display line for syntax error
	    parser.feed(lines[i]+"\n");
//	}
    }
    let results = parser.results[0];
    console.log(results);

    // create exposition
    exposition = expositionFromArray(results);
    console.log(exposition);

    // render exposition

    // stylesheet
    if (exposition.style != undefined) {
	document.getElementById("dynStylesheet").href=exposition.style;
    }
    
    // display first weave
    exposition.renderResponsive();

    // print TOC
    console.log(exposition.getTOC());
}


// Shift+Arrow keys for weave navigation
document.onkeydown = k => {
    if (k.shiftKey) {
	switch (k.keyCode) {
	case 37:
	    console.log("back");
	    exposition.setCurrentWeave((exposition.currentWeave - 1 + exposition.weaves.length) % exposition.weaves.length);
	    break;
	case 39:
	    console.log("forth");
	    exposition.setCurrentWeave((exposition.currentWeave + 1) % exposition.weaves.length);
	    break;
	}
    }
};


function pandocConvert() {
    let http = new XMLHttpRequest();
    let ending = document.getElementById("pandocEnding").value;
    let url = `http://localhost:3000/pandoc/${ending}`;

    http.onreadystatechange = function() {
	if (http.readyState === 4) {
	    let file = http.response;
	    console.log(window.location.pathname + "/" + file);
	    window.open(file, '_blank');
	}
    };
    
    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "text/plain");

    let markdown = exposition.asMarkdown();
    console.log(markdown);
    
    http.send(markdown);
}

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
//	console.log(expositionJSON);
	exposition = RCExpositionDeserializer.restoreObject(expositionJSON);
//	console.log(exposition);
	exposition.renderResponsive();
    };
    
    reader.readAsText(file);	

});

