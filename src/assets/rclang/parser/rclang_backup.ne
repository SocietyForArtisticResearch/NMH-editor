exposition -> title authors __ style:? weave:+ {% d => [d[0], d[1], d[3], d[4]] %}
title -> "title:" _ titlestring __ {% d => d[2] %}
authors -> "authors:" _ authorlist {% d => d[2] %}
authorlist -> personname {% d => [d[0]] %} | personname (_ "," _) authorlist {% d => [d[0]].concat(d[2]) %}
titlestring -> name {% d => d %} | name __C titlestring {% d => d[0].concat(d[1]).concat(d[2]) %}
personname -> name {% d => d[0] %} | personname __C name {% d => d[0].concat(d[1]).concat(d[2]) %}

weave -> gridSetting tool:+ {% d => [d[0],d[1]] %}
gridSetting -> "grid" __ int __ int _ {% d => [d[0], d[2], d[4]] %}
style -> "style" __ file _ {% d => [ d[0], d[2] ] %} 
tool -> text {% id %} | image {% id %}
text -> "text"  __ name  __ int __ int _ int:? _ int:? __ "{" __ textcontent __ "}" _
{% d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[14] ] %}
image -> "image" __ name __ int __ int _ int:? _ int:? _ int:? _ int:? __ file _
{% d => [ d[0], d[2], d[4], d[6],  d[8], d[10], d[12], d[14], d[16]] %}
file -> [a-zA-Z0-9\.\/\_] {% d => d[0] %}
     | file [a-zA-Z0-9\.\/\_] {% d => d[0]+d[1] %} 
name  -> [a-zA-Z0-9]:+  {% function(d){ return d[0].join(""); } %}
textcontent -> [^}]:* {% d => d[0].join("") %}
int -> [0-9]:+ {% function(d){return parseInt(d[0].join("")); } %}

_  -> wschar:* {% function(d) {return null;} %}
__ -> wschar:+ {% function(d) {return null;} %}

_C  -> wschar:* {% function(d) {return " ";} %}
__C -> wschar:+ {% function(d) {return " ";} %}

wschar -> [ \t\n\v\f] {% id %}