// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "exposition$ebnf$1", "symbols": ["weave"]},
    {"name": "exposition$ebnf$1", "symbols": ["exposition$ebnf$1", "weave"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "exposition", "symbols": ["title", "authors", "__", "options", "exposition$ebnf$1"], "postprocess": d => [d[0], d[1], d[3], d[4]]},
    {"name": "title$string$1", "symbols": [{"literal":"t"}, {"literal":"i"}, {"literal":"t"}, {"literal":"l"}, {"literal":"e"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "title", "symbols": ["title$string$1", "_", "titlestring", "__"], "postprocess": d => d[2]},
    {"name": "authors$string$1", "symbols": [{"literal":"a"}, {"literal":"u"}, {"literal":"t"}, {"literal":"h"}, {"literal":"o"}, {"literal":"r"}, {"literal":"s"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "authors", "symbols": ["authors$string$1", "_", "authorlist"], "postprocess": d => d[2]},
    {"name": "authorlist", "symbols": ["personname"], "postprocess": d => [d[0]]},
    {"name": "authorlist$subexpression$1", "symbols": ["_", {"literal":","}, "_"]},
    {"name": "authorlist", "symbols": ["personname", "authorlist$subexpression$1", "authorlist"], "postprocess": d => [d[0]].concat(d[2])},
    {"name": "titlestring", "symbols": ["name"], "postprocess": d => d},
    {"name": "titlestring", "symbols": ["name", "__C", "titlestring"], "postprocess": d => d[0].concat(d[1]).concat(d[2])},
    {"name": "personname", "symbols": ["name"], "postprocess": d => d[0]},
    {"name": "personname", "symbols": ["personname", "__C", "name"], "postprocess": d => d[0].concat(d[1]).concat(d[2])},
    {"name": "breakpoint$string$1", "symbols": [{"literal":"b"}, {"literal":"r"}, {"literal":"e"}, {"literal":"a"}, {"literal":"k"}, {"literal":"p"}, {"literal":"o"}, {"literal":"i"}, {"literal":"n"}, {"literal":"t"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "breakpoint", "symbols": ["breakpoint$string$1", "__", "int", "_"], "postprocess": d => [d[0], d[2]]},
    {"name": "weave$ebnf$1", "symbols": ["tool"]},
    {"name": "weave$ebnf$1", "symbols": ["weave$ebnf$1", "tool"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "weave", "symbols": ["gridSetting", "__", "name", "__", "weave$ebnf$1"], "postprocess": d => [d[0],d[2],d[4]]},
    {"name": "gridSetting$string$1", "symbols": [{"literal":"g"}, {"literal":"r"}, {"literal":"i"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "gridSetting", "symbols": ["gridSetting$string$1", "__", "int", "__", "int", "_"], "postprocess": d => [d[0], d[2], d[4]]},
    {"name": "style$string$1", "symbols": [{"literal":"s"}, {"literal":"t"}, {"literal":"y"}, {"literal":"l"}, {"literal":"e"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "style", "symbols": ["style$string$1", "__", "file", "_"], "postprocess": d => [ d[0], d[2] ]},
    {"name": "tool", "symbols": ["text"], "postprocess": id},
    {"name": "tool", "symbols": ["image"], "postprocess": id},
    {"name": "tool", "symbols": ["audio"], "postprocess": id},
    {"name": "tool", "symbols": ["pdf"], "postprocess": id},
    {"name": "tool", "symbols": ["svg"], "postprocess": id},
    {"name": "tool", "symbols": ["video"], "postprocess": id},
    {"name": "text$string$1", "symbols": [{"literal":"t"}, {"literal":"e"}, {"literal":"x"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "text$ebnf$1", "symbols": ["int"], "postprocess": id},
    {"name": "text$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "text$ebnf$2", "symbols": ["int"], "postprocess": id},
    {"name": "text$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "text", "symbols": ["text$string$1", "__", "name", "__", "int", "__", "int", "_", "text$ebnf$1", "_", "text$ebnf$2", "__", {"literal":"{"}, "__", "textcontent", "wschar", {"literal":"}"}, "_", "options"], "postprocess": d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[14], d[18] ]},
    {"name": "image$string$1", "symbols": [{"literal":"i"}, {"literal":"m"}, {"literal":"a"}, {"literal":"g"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "image$ebnf$1", "symbols": ["int"], "postprocess": id},
    {"name": "image$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "image$ebnf$2", "symbols": ["int"], "postprocess": id},
    {"name": "image$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "image", "symbols": ["image$string$1", "__", "name", "__", "int", "__", "int", "_", "image$ebnf$1", "_", "image$ebnf$2", "__", "file", "_", "options"], "postprocess": d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[12], d[14]]},
    {"name": "pdf$string$1", "symbols": [{"literal":"p"}, {"literal":"d"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "pdf$ebnf$1", "symbols": ["int"], "postprocess": id},
    {"name": "pdf$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pdf$ebnf$2", "symbols": ["int"], "postprocess": id},
    {"name": "pdf$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pdf", "symbols": ["pdf$string$1", "__", "name", "__", "int", "__", "int", "_", "pdf$ebnf$1", "_", "pdf$ebnf$2", "__", "file", "_", "options"], "postprocess": d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[12], d[14]]},
    {"name": "svg$string$1", "symbols": [{"literal":"s"}, {"literal":"v"}, {"literal":"g"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "svg$ebnf$1", "symbols": ["int"], "postprocess": id},
    {"name": "svg$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "svg$ebnf$2", "symbols": ["int"], "postprocess": id},
    {"name": "svg$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "svg", "symbols": ["svg$string$1", "__", "name", "__", "int", "__", "int", "_", "svg$ebnf$1", "_", "svg$ebnf$2", "__", "file", "_", "options"], "postprocess": d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[12], d[14]]},
    {"name": "audio$string$1", "symbols": [{"literal":"a"}, {"literal":"u"}, {"literal":"d"}, {"literal":"i"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "audio$ebnf$1", "symbols": ["int"], "postprocess": id},
    {"name": "audio$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "audio$ebnf$2", "symbols": ["int"], "postprocess": id},
    {"name": "audio$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "audio", "symbols": ["audio$string$1", "__", "name", "__", "int", "__", "int", "_", "audio$ebnf$1", "_", "audio$ebnf$2", "__", "file", "_", "options"], "postprocess": d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[12], d[14]]},
    {"name": "video$string$1", "symbols": [{"literal":"v"}, {"literal":"i"}, {"literal":"d"}, {"literal":"e"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "video$ebnf$1", "symbols": ["int"], "postprocess": id},
    {"name": "video$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "video$ebnf$2", "symbols": ["int"], "postprocess": id},
    {"name": "video$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "video", "symbols": ["video$string$1", "__", "name", "__", "int", "__", "int", "_", "video$ebnf$1", "_", "video$ebnf$2", "__", "file", "_", "options"], "postprocess": d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[12], d[14]]},
    {"name": "file", "symbols": [/[a-zA-Z0-9\.\/\_]/], "postprocess": d => d[0]},
    {"name": "file", "symbols": ["file", /[a-zA-Z0-9\.\/\_]/], "postprocess": d => d[0]+d[1]},
    {"name": "options$ebnf$1", "symbols": []},
    {"name": "options$ebnf$1", "symbols": ["options$ebnf$1", "option"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "options", "symbols": ["options$ebnf$1"], "postprocess":  function(d)   {
        	let optionsObject = {};
        	for (let i = 0; i < d[0].length; i++) {
        		let opt = d[0][i];
        	for (let prop in opt) {
          			if (opt.hasOwnProperty(prop)) {
            			optionsObject[prop] = opt[prop];
          			}; 
        		}; 
        	};
        	return optionsObject;
        }
        },
    {"name": "option", "symbols": ["name", "_", {"literal":":"}, "_", "file", "_"], "postprocess": function(d) { return { [d[0]] : d[4] } }},
    {"name": "name$ebnf$1", "symbols": [/[a-zA-Z0-9]/]},
    {"name": "name$ebnf$1", "symbols": ["name$ebnf$1", /[a-zA-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "name", "symbols": ["name$ebnf$1"], "postprocess": function(d){ return d[0].join(""); }},
    {"name": "textcontent$ebnf$1", "symbols": []},
    {"name": "textcontent$ebnf$1", "symbols": ["textcontent$ebnf$1", /[^}]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "textcontent", "symbols": ["textcontent$ebnf$1"], "postprocess": d => d[0].join("")},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d){return parseInt(d[0].join("")); }},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "_C$ebnf$1", "symbols": []},
    {"name": "_C$ebnf$1", "symbols": ["_C$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_C", "symbols": ["_C$ebnf$1"], "postprocess": function(d) {return " ";}},
    {"name": "__C$ebnf$1", "symbols": ["wschar"]},
    {"name": "__C$ebnf$1", "symbols": ["__C$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__C", "symbols": ["__C$ebnf$1"], "postprocess": function(d) {return " ";}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id}
]
  , ParserStart: "exposition"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
