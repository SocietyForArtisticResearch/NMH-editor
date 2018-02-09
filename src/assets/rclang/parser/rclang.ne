exposition -> title authors __ options weave:+ {% d => [d[0], d[1], d[3], d[4]] %}
title -> "title:" _ titlestring __ {% d => d[2] %}
authors -> "authors:" _ authorlist {% d => d[2] %}
authorlist -> personname {% d => [d[0]] %} | personname (_ "," _) authorlist {% d => [d[0]].concat(d[2]) %}
titlestring -> name {% d => d %} | name __C titlestring {% d => d[0].concat(d[1]).concat(d[2]) %}
personname -> name {% d => d[0] %} | personname __C name {% d => d[0].concat(d[1]).concat(d[2]) %}
breakpoint -> "breakpoint:" __ int _ {% d => [d[0], d[2]] %}
weave -> gridSetting __ name __ tool:+ {% d => [d[0],d[2],d[4]] %}
gridSetting -> "grid" __ int __ int _ {% d => [d[0], d[2], d[4]] %}
style -> "style:" __ file _ {% d => [ d[0], d[2] ] %} 
tool -> text {% id %} | image {% id %} | audio {% id %} | pdf {% id %} | svg {% id %} | video {% id %}
text -> "text"  __ name  __ int __ int _ int:? _ int:? __ "{" __ textcontent wschar "}" _ options
{% d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[14], d[18] ] %}
image -> "image" __ name __ int __ int _ int:? _ int:? __ file _ options 
{% d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[12], d[14]] %}
pdf -> "pdf" __ name __ int __ int _ int:? _ int:? __ file _ options 
{% d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[12], d[14]] %}
svg -> "svg" __ name __ int __ int _ int:? _ int:? __ file _ options 
{% d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[12], d[14]] %}
audio -> "audio" __ name __ int __ int _ int:? _ int:? __ file _ options 
{% d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[12], d[14]] %}
video -> "video" __ name __ int __ int _ int:? _ int:? __ file _ options 
{% d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[12], d[14]] %}
file -> [a-zA-Z0-9\.\/\_] {% d => d[0] %}
     | file [a-zA-Z0-9\.\/\_] {% d => d[0]+d[1] %} 
options -> option:* {% function(d)   {
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
%}
option -> name _ ":" _ file _ {% function(d) { return { [d[0]] : d[4] } } %} 
name  -> [a-zA-Z0-9]:+  {% function(d){ return d[0].join(""); } %}
textcontent -> [^}]:* {% d => d[0].join("") %}
int -> [0-9]:+ {% function(d){return parseInt(d[0].join("")); } %}

_  -> wschar:* {% function(d) {return null;} %}
__ -> wschar:+ {% function(d) {return null;} %}

_C  -> wschar:* {% function(d) {return " ";} %}
__C -> wschar:+ {% function(d) {return " ";} %}

wschar -> [ \t\n\v\f] {% id %}
