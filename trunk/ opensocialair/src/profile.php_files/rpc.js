
var gadgets=gadgets||{};gadgets.util=function(){function parseUrlParams(){var query;var l=document.location.href;var queryIdx=l.indexOf("?");var hashIdx=l.indexOf("#");if(hashIdx===-1){query=l.substr(queryIdx+1);}else{query=[l.substr(queryIdx+1,hashIdx-queryIdx-1),"&",l.substr(hashIdx+1)].join("");}
return query.split("&");}
var parameters=null;var features={};var onLoadHandlers=[];var escapeCodePoints={0:false,10:true,13:true,34:true,39:true,60:true,62:true,92:true,8232:true,8233:true};function unescapeEntity(match,value){return String.fromCharCode(value);}
function init(config){features=config["core.util"]||{};}
if(gadgets.config){gadgets.config.register("core.util",null,init);}
return{getUrlParameters:function(){if(parameters!==null){return parameters;}
parameters={};var pairs=parseUrlParams();var unesc=window.decodeURIComponent?decodeURIComponent:unescape;for(var i=0,j=pairs.length;i<j;++i){var pos=pairs[i].indexOf('=');if(pos===-1){continue;}
var argName=pairs[i].substring(0,pos);var value=pairs[i].substring(pos+1);value=value.replace(/\+/g," ");parameters[argName]=unesc(value);}
return parameters;},makeClosure:function(scope,callback,var_args){var baseArgs=[];for(var i=2,j=arguments.length;i<j;++i){baseArgs.push(arguments[i]);}
return function(){var tmpArgs=baseArgs.slice();for(var i=0,j=arguments.length;i<j;++i){tmpArgs.push(arguments[i]);}
return callback.apply(scope,tmpArgs);};},makeEnum:function(values){var obj={};for(var i=0,v;v=values[i];++i){obj[v]=v;}
return obj;},getFeatureParameters:function(feature){return typeof features[feature]==="undefined"?null:features[feature];},hasFeature:function(feature){return typeof features[feature]!=="undefined";},registerOnLoadHandler:function(callback){onLoadHandlers.push(callback);},runOnLoadHandlers:function(){for(var i=0,j=onLoadHandlers.length;i<j;++i){onLoadHandlers[i]();}},escape:function(input,opt_escapeObjects){if(!input){return input;}else if(typeof input==="string"){return gadgets.util.escapeString(input);}else if(typeof input==="array"){for(var i=0,j=input.length;i<j;++i){input[i]=gadgets.util.escape(input[i]);}}else if(typeof input==="object"&&opt_escapeObjects){var newObject={};for(var field in input)if(input.hasOwnProperty(field)){newObject[gadgets.util.escapeString(field)]=gadgets.util.escape(input[field],true);}
return newObject;}
return input;},escapeString:function(str){var out=[],ch,shouldEscape;for(var i=0,j=str.length;i<j;++i){ch=str.charCodeAt(i);shouldEscape=escapeCodePoints[ch];if(shouldEscape===true){out.push("&#",ch,";");}else if(shouldEscape!==false){out.push(str.charAt(i));}}
return out.join("");},unescapeString:function(str){return str.replace(/&#([0-9]+);/g,unescapeEntity);}};}();gadgets.util.getUrlParameters();

var gadgets=gadgets||{};gadgets.json=function(){function f(n){return n<10?'0'+n:n;}
Date.prototype.toJSON=function(){return[this.getUTCFullYear(),'-',f(this.getUTCMonth()+1),'-',f(this.getUTCDate()),'T',f(this.getUTCHours()),':',f(this.getUTCMinutes()),':',f(this.getUTCSeconds()),'Z'].join("");};var m={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};function stringify(value){var a,i,k,l,r=/["\\\x00-\x1f\x7f-\x9f]/g,v;switch(typeof value){case'string':return r.test(value)?'"'+value.replace(r,function(a){var c=m[a];if(c){return c;}
c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+
(c%16).toString(16);})+'"':'"'+value+'"';case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
a=[];if(typeof value.length==='number'&&!(value.propertyIsEnumerable('length'))){l=value.length;for(i=0;i<l;i+=1){a.push(stringify(value[i])||'null');}
return'['+a.join(',')+']';}
for(k in value)if(value.hasOwnProperty(k)){if(typeof k==='string'){v=stringify(value[k]);if(v){a.push(stringify(k)+':'+v);}}}
return'{'+a.join(',')+'}';}}
return{stringify:stringify,parse:function(text){if(/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/b-u]/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){return eval('('+text+')');}
return false;}};}();

var gadgets=gadgets||{};gadgets.rpc=function(){var CALLBACK_NAME='__cb';var DEFAULT_NAME='';var FE_G2C_CHANNEL='__g2c_rpc';var FE_C2G_CHANNEL='__c2g_rpc';var services={};var iframePool=[];var relayUrl={};var useLegacyProtocol={};var authToken={};var callId=0;var callbacks={};var setup={};var sameDomain={};var params={};if(gadgets.util){params=gadgets.util.getUrlParameters();}
authToken['..']=params.rpctoken||params.ifpctok||0;function getRelayChannel(){return typeof window.postMessage==='function'?'wpm':typeof document.postMessage==='function'?'dpm':navigator.product==='Gecko'?'fe':'ifpc';}
function setupChannel(){if(relayChannel==='dpm'||relayChannel==='wpm'){window.addEventListener('message',function(packet){process(gadgets.json.parse(packet.data));},false);}}
var relayChannel=getRelayChannel();setupChannel();services[DEFAULT_NAME]=function(){throw new Error('Unknown RPC service: '+this.s);};services[CALLBACK_NAME]=function(callbackId,result){var callback=callbacks[callbackId];if(callback){delete callbacks[callbackId];callback(result);}};function setupFrame(frameId){if(setup[frameId]){return;}
if(relayChannel==='fe'){try{var frame=document.getElementById(frameId);frame[FE_G2C_CHANNEL]=function(args){process(gadgets.json.parse(args));};}catch(e){}}
setup[frameId]=true;}
function encodeLegacyData(args){var stringify=gadgets.json.stringify;var argsEscaped=[];for(var i=0,j=args.length;i<j;++i){argsEscaped.push(encodeURIComponent(stringify(args[i])));}
return argsEscaped.join('&');}
function process(rpc){if(rpc&&typeof rpc.s==='string'&&typeof rpc.f==='string'&&rpc.a instanceof Array){if(authToken[rpc.f]){if(authToken[rpc.f]!=rpc.t){throw new Error("Invalid auth token.");}}
if(rpc.c){rpc.callback=function(result){gadgets.rpc.call(rpc.f,CALLBACK_NAME,null,rpc.c,result);};}
var result=(services[rpc.s]||services[DEFAULT_NAME]).apply(rpc,rpc.a);if(rpc.c&&typeof result!='undefined'){gadgets.rpc.call(rpc.f,CALLBACK_NAME,null,rpc.c,result);}}}
function callFrameElement(targetId,serviceName,from,rpcData,callArgs){try{if(from!='..'){var fe=window.frameElement;if(typeof fe[FE_G2C_CHANNEL]==='function'){if(typeof fe[FE_G2C_CHANNEL][FE_C2G_CHANNEL]!=='function'){fe[FE_G2C_CHANNEL][FE_C2G_CHANNEL]=function(args){process(gadgets.json.parse(args));};}
fe[FE_G2C_CHANNEL](rpcData);return;}}else{var frame=document.getElementById(targetId);if(typeof frame[FE_G2C_CHANNEL]==='function'&&typeof frame[FE_G2C_CHANNEL][FE_C2G_CHANNEL]==='function'){frame[FE_G2C_CHANNEL][FE_C2G_CHANNEL](rpcData);return;}}}catch(e){}
callIfpc(targetId,serviceName,from,rpcData,callArgs);}
function callIfpc(targetId,serviceName,from,rpcData,callArgs){var relay=gadgets.rpc.getRelayUrl(targetId);if(!relay){throw new Error('No relay file assigned for IFPC');}
var src=null;if(useLegacyProtocol[targetId]){src=[relay,'#',encodeLegacyData([from,callId,1,0,encodeLegacyData([from,serviceName,'','',from].concat(callArgs))])].join('');}else{src=[relay,'#',targetId,'&',from,'@',callId,'&1&0&',encodeURIComponent(rpcData)].join('');}
emitInvisibleIframe(src);}
function emitInvisibleIframe(src){var iframe;for(var i=iframePool.length-1;i>=0;--i){var ifr=iframePool[i];try{if(ifr&&(ifr.recyclable||ifr.readyState==='complete')){ifr.parentNode.removeChild(ifr);if(window.ActiveXObject){iframePool[i]=ifr=null;iframePool.splice(i,1);}else{ifr.recyclable=false;iframe=ifr;break;}}}catch(e){}}
if(!iframe){iframe=document.createElement('iframe');iframe.style.border=iframe.style.width=iframe.style.height='0px';iframe.style.visibility='hidden';iframe.style.position='absolute';iframe.onload=function(){this.recyclable=true;};iframePool.push(iframe);}
iframe.src=src;setTimeout(function(){document.body.appendChild(iframe);},0);}
function callSameDomain(target,rpc){if(typeof sameDomain[target]==='undefined'){sameDomain[target]=false;var targetEl=null;if(target==='..'){targetEl=parent;}else{targetEl=frames[target];}
try{sameDomain[target]=targetEl.gadgets.rpc.receiveSameDomain;}catch(e){}}
if(typeof sameDomain[target]==='function'){sameDomain[target](rpc);return true;}
return false;}
if(gadgets.config){function init(config){if(config.rpc.parentRelayUrl.substring(0,7)==='http://'){relayUrl['..']=config.rpc.parentRelayUrl;}else{var params=document.location.search.substring(0).split("&");var parentParam="";for(var i=0,param;param=params[i];++i){if(param.indexOf("parent=")===0){parentParam=decodeURIComponent(param.substring(7));break;}}
relayUrl['..']=parentParam+config.rpc.parentRelayUrl;}
useLegacyProtocol['..']=!!config.rpc.useLegacyProtocol;}
var requiredConfig={parentRelayUrl:gadgets.config.NonEmptyStringValidator};gadgets.config.register("rpc",requiredConfig,init);}
return{register:function(serviceName,handler){if(serviceName==CALLBACK_NAME){throw new Error("Cannot overwrite callback service");}
if(serviceName==DEFAULT_NAME){throw new Error("Cannot overwrite default service:"
+" use registerDefault");}
services[serviceName]=handler;},unregister:function(serviceName){if(serviceName==CALLBACK_NAME){throw new Error("Cannot delete callback service");}
if(serviceName==DEFAULT_NAME){throw new Error("Cannot delete default service:"
+" use unregisterDefault");}
delete services[serviceName];},registerDefault:function(handler){services['']=handler;},unregisterDefault:function(){delete services[''];},call:function(targetId,serviceName,callback,var_args){++callId;targetId=targetId||'..';if(callback){callbacks[callId]=callback;}
var from='..';if(targetId==='..'){from=window.name;}
var rpc={s:serviceName,f:from,c:callback?callId:0,a:Array.prototype.slice.call(arguments,3),t:authToken[targetId]};if(callSameDomain(targetId,rpc)){return;}
var rpcData=gadgets.json.stringify(rpc);var channelType=relayChannel;if(useLegacyProtocol[targetId]){channelType='ifpc';}
switch(channelType){case'dpm':var targetDoc=targetId==='..'?parent.document:frames[targetId].document;targetDoc.postMessage(rpcData);break;case'wpm':var targetWin=targetId==='..'?parent:frames[targetId];targetWin.postMessage(rpcData,"*");break;case'fe':callFrameElement(targetId,serviceName,from,rpcData,rpc.a);break;default:callIfpc(targetId,serviceName,from,rpcData,rpc.a);break;}},getRelayUrl:function(targetId){return relayUrl[targetId];},setRelayUrl:function(targetId,url,opt_useLegacy){relayUrl[targetId]=url;useLegacyProtocol[targetId]=!!opt_useLegacy;},setAuthToken:function(targetId,token){authToken[targetId]=token;setupFrame(targetId);},getRelayChannel:function(){return relayChannel;},receive:function(fragment){if(fragment.length>4){process(gadgets.json.parse(decodeURIComponent(fragment[fragment.length-1])));}},receiveSameDomain:function(rpc){rpc.a=Array.prototype.slice.call(rpc.a);window.setTimeout(function(){process(rpc)},0);}};}();
