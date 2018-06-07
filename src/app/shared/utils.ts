export let uniqueID = function () {
    var i = 1;

    return function () {
        return i++;
    };
}();


export function stringToId(str) {
    return str.replace(/[^A-Z0-9]+/ig, "-");
}

export function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

export function getExtension(fileNameStr : string) {
	return fileNameStr.split('.').pop();
}

export function checkTypeUsingFilename(filename:string ,allowed : string[]) {
	var ext = filename.split('.').pop();
	let checker = check => check !== ext // ext does not equal allowed, thus 
	return !allowed.every(checker); // if all is true (no match) = wrong type.
}

export function urlStripQueries(url : string) {
   return url.split("?")[0];
};