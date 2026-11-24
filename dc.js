(function(){var __D=document.implementation.createHTMLDocument('');
window.DCLogic=class{constructor(){this.props={};this.state={};}setState(p){this.state=Object.assign({},this.state,p);window.__dcRender&&window.__dcRender();}forceUpdate(){window.__dcRender&&window.__dcRender();}};
document.addEventListener('DOMContentLoaded',function(){
 var T=document.getElementById('dc'); var x=T?T.content.querySelector('x-dc'):document.querySelector('x-dc'); var helmet=x.querySelector('helmet');
 if(helmet){Array.from(helmet.children).forEach(function(c){document.head.appendChild(c.cloneNode(true));}); helmet.remove();}
 var tpl=x.innerHTML; var host=document.createElement('div');  (T||x).replaceWith(host);
 var sc=document.querySelector('script[data-dc-script]'); var Comp=(new Function(sc.textContent+';return Component;'))();
 var inst=new Comp(); inst.props={};
 function get(scope,path){path=path.trim(); if(path==='true')return true; if(path==='false')return false; if(/^-?\d/.test(path))return +path; return path.split('.').reduce(function(o,k){return o==null?undefined:o[k];},scope);}
 function interp(str,scope){var whole=str.match(/^\s*\{\{([^}]+)\}\}\s*$/); if(whole)return get(scope,whole[1]); return str.replace(/\{\{([^}]+)\}\}/g,function(_,p){var v=get(scope,p);return v==null?'':v;});}
 function walk(node,scope){
  var kids=Array.from(node.childNodes);
  kids.forEach(function(n){
   if(n.nodeType===3){ if(n.nodeValue.indexOf('{{')>=0) n.nodeValue=interp(n.nodeValue,scope); return; }
   if(n.nodeType!==1) return;
   var tag=n.tagName.toLowerCase();
   if(tag==='sc-for'){ var list=interp(n.getAttribute('list'),scope)||[]; var as=n.getAttribute('as'); var frag=__D.createDocumentFragment();
     list.forEach(function(item,i){var s=Object.assign({},scope); s[as]=item; s.$index=i; var wrap=__D.createElement('div'); wrap.innerHTML=n.innerHTML; walk(wrap,s); while(wrap.firstChild)frag.appendChild(wrap.firstChild);});
     n.replaceWith(frag); return; }
   if(tag==='sc-if'){ var v=interp(n.getAttribute('value'),scope); if(v){var wrap=__D.createElement('div'); wrap.innerHTML=n.innerHTML; walk(wrap,scope); var f=__D.createDocumentFragment(); while(wrap.firstChild)f.appendChild(wrap.firstChild); n.replaceWith(f);} else n.remove(); return; }
   Array.from(n.attributes).forEach(function(a){
     if(/^on[A-Z]/.test(a.name)||/^on[a-z]/.test(a.name)&&a.value.indexOf('{{')>=0){ var fn=interp(a.value,scope); n.removeAttribute(a.name); if(typeof fn==='function'){var ev=a.name.slice(2).toLowerCase(); n.addEventListener(ev,fn);} return; }
     if(a.value.indexOf('{{')>=0){ var v=interp(a.value,scope); n.setAttribute(a.name, v==null?'':v); }
   });
   walk(n,scope);
  });
 }
 var first=true;
 window.__dcRender=function(){ var vals=inst.renderVals(); var wrap=__D.createElement('div'); wrap.innerHTML=tpl; walk(wrap,vals);
   // preserve video element across renders
   if(first){ while(wrap.firstChild)host.appendChild(wrap.firstChild); }
   else { morphdom(host, wrap, {childrenOnly:true, onBeforeElUpdated:function(f,t){ if(f.tagName==='VIDEO') return false; if(f.classList&&f.classList.contains('in')) t.classList.add('in'); if(f._ob) t._ob=f._ob; return true; }}); }
   if(first){first=false; inst.componentDidMount&&inst.componentDidMount();} else inst.componentDidUpdate&&inst.componentDidUpdate(); };
 window.__dcRender();
});
})();
