// The RC weave (aka "page")
class RCWeave {
    
    constructor(grid,objects) {
	this.grid = grid; // RCGrid object
	this.objects = objects; // a list of tools (here called 'objects')
    }

    // write all objects to page in grid
    render(linear=false) {

	if ((this.objects != undefined) && (this.objects.length > 0)) {
	    this.grid.createHTML(linear);
	    // add all objects to the grid
	    this.objects.forEach( (object,i) =>  {
		object.createHTML(linear,i);
		this.grid.html.appendChild(object.html);
	    });
	    //	document.body.insertBefore(this.grid.html, null);
	    //	document.body.innerHTML = this.grid.html.outerHTML;
	    document.getElementById("weave").innerHTML = this.grid.html.outerHTML;
	}
    }

    renderResponsiveOnce(breakpoint=1200) {
	const mq = window.matchMedia("(min-width: " + breakpoint + "px)");
	var matcher = (query => this.render(!query.matches) );
	matcher(mq);
    }

    
    renderResponsive(breakpoint=1200) {
	const mq = window.matchMedia("(min-width: " + breakpoint + "px)");
	var matcher = (query => this.render(!query.matches) );
	mq.addListener(matcher);
	matcher(mq);
    }
    
    
}

// Grid Class
// the basic template grid for the entire weave
class RCGrid {

    constructor(x,y,autoRows=false) {
	this.x = x;
	this.y = y;
	this.autoRows = autoRows;
    }

    createHTML(linear=false) {
	let div = document.createElement("div");
	this.autoRows = linear;
	div.id = "grid";
	div.style.display = "grid";
	if (this.autoRows) {
	    div.style.gridTemplateRows = "none";
	    div.style.gridTemplateColumns = "1fr";
	} else {
	    div.style.gridTemplateRows = "repeat(" + this.y + ", 1fr)";
	    div.style.gridTemplateColumns = "repeat(" + this.x + ", 1fr)";
	}

	this.html = div;
    }


    
}


// Object prototype class
class RCObject {
    
    constructor(name,gridX,gridY,width=1,height=1) {
	this.gridX = gridX;
	this.gridY = gridY;
	this.gridXEnd = width + gridX;
	this.gridYEnd = height + gridY;
	this.name = name;
    }


    createBasicHTML(linear=false,i=0) {
	let div = document.createElement("div");
	div.id = this.name;
	div.className = "object";

	if (linear) {
	    div.style.gridColumnStart = 1;
	    div.style.gridRowStart = i;
	    div.style.gridColumnEnd = 2;
	    div.style.gridRowEnd = i+1;
	} else {
	    div.style.gridColumnStart = this.gridX;
	    div.style.gridRowStart = this.gridY;
	    div.style.gridColumnEnd = this.gridXEnd;
	    div.style.gridRowEnd = this.gridYEnd;
	}
	this.html = div;
    }
    
}

// Text Object
class RCText extends RCObject {

    constructor(name,gridX,gridY,text,width=1,height=1) {
	super(name,gridX,gridY,width,height);
	this.text = text;
    }

    createHTML(linear=false,i=0) {
	let content = document.createElement("div");
	this.createBasicHTML(linear,i);
	content.innerHTML = this.text;
	this.html.appendChild(content);
    }

}

// Image Object
class RCImage extends RCObject {

    constructor(name,gridX,gridY,url,pxWidth,pxHeight,width=1,height=1) {
	super(name,gridX,gridY,width,height);
	this.url = url;
	this.pxWidth = pxWidth;
	this.pxHeight = pxHeight;
    }

    createHTML(linear=false,i=0) {
	let img = document.createElement("img");
	img.setAttribute("src", this.url);
	img.setAttribute("height", this.pxHeight);
	img.setAttribute("width", this.pxWidth);
	img.setAttribute("alt", this.name);
	this.createBasicHTML(linear,i);
	this.html.appendChild(img);
    }

}

// after parser
// TODO: make safe (proper exception handling)
function objectFromArray(array,md) {
    switch (array[0]) {
    case "text":
	// TODO: add markdown parsing here
	return new RCText(array[1], array[2], array[3], md.render(array[6]), array[4], array[5]);
	break;
    case "image":
	return new RCImage(array[1], array[2], array[3], array[8], array[4], array[5],
			   array[6], array[7]);
	break;
    }
}

/// Test

// let lorem = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

// // specify grid
// let grid = new RCGrid(4,6);

// // create objects
// let objects = [new RCText("text1", 1, 1, lorem+lorem+lorem, 3), // wide and long text
// 	       new RCText("text2", 2, 3, lorem),
// 	       new RCText("text3", 3, 5, lorem+lorem, 1, 2), // larger height, longer text
// 	       new RCText("text4", 4, 6, lorem),
// 	       new RCImage("image1", 1, 2, "glas_small.jpg", 300, 200)
// 	      ];

// // create weave
// let weave = new RCWeave(grid,objects);

// // render, breakpoint is 1200
// weave.renderResponsive(1200);

console.log(JSON.stringify(weave));

