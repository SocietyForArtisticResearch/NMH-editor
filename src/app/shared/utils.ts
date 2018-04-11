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
