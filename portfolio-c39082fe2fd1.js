(function(){
'use strict';
var root=document.getElementById('muchi-desktop');if(!root)return;
var reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(reduced.matches)return;
var glyphs='01アイウエオカキクケコサシスセソタチツテトABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}';
var pending=new Map(),seen=new WeakSet(),frame=0,lastPaint=0,observer;
function random(){return glyphs.charAt(Math.floor(Math.random()*glyphs.length));}
function scramble(text,progress){var end=Math.floor(text.length*progress);return Array.from(text).map(function(c,i){return /\s/.test(c)||i<end?c:random();}).join('');}
function textNodes(el){var nodes=[],walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentElement;return n.nodeValue.trim()&&p&&!p.closest('script,style,[aria-hidden="true"],.hero-portrait,.matrix-boot')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});while(walk.nextNode())nodes.push({node:walk.currentNode,text:walk.currentNode.nodeValue});return nodes;}
function restore(el,item){item.nodes.forEach(function(n){if(n.node.isConnected)n.node.nodeValue=n.text;});el.classList.remove('code-decoding');el.removeAttribute('aria-busy');pending.delete(el);}
function paint(now){frame=0;if(now-lastPaint<65){frame=requestAnimationFrame(paint);return;}lastPaint=now;pending.forEach(function(item,el){var p=Math.max(0,Math.min(1,(now-item.start)/1050));if(!el.isConnected||p>=1){restore(el,item);return;}item.nodes.forEach(function(n){if(n.node.isConnected)n.node.nodeValue=scramble(n.text,p);});});if(pending.size)frame=requestAnimationFrame(paint);}
function reveal(el,delay){if(seen.has(el)||reduced.matches)return;seen.add(el);var nodes=textNodes(el);if(!nodes.length)return;
var label=el.textContent.replace(/\s+/g,' ').trim();if(!el.hasAttribute('aria-label')&&/^(H[123]|BUTTON|A)$/.test(el.tagName))el.setAttribute('aria-label',label);
el.classList.add('code-decoding');el.setAttribute('aria-busy','true');pending.set(el,{nodes:nodes,start:performance.now()+(delay||0)});if(!frame)frame=requestAnimationFrame(paint);
}
var selectors='h1,h2,h3,p,.hero-subtitle,.stack-strip>span,.service-name,.service-summary,.service-cost,.service-number,.case-meta>span,.step-num,.certificate>span,.contact-user,.portfolio-footer>a,.portfolio-footer>span,.matrix-button,.desk-contact,.site-menu>a';
function watch(container){var all=Array.from(container.querySelectorAll(selectors)).filter(function(el){return !el.closest('.hero-portrait,.matrix-boot')&&!el.parentElement.closest(selectors)&&!el.closest('[aria-hidden="true"]');});all.forEach(function(el){if(observer)observer.observe(el);else reveal(el,0);});}
var boot=document.createElement('div');boot.className='matrix-boot';boot.setAttribute('aria-hidden','true');boot.innerHTML='<div class="boot-code" aria-hidden="true"></div><div class="boot-center"><span class="boot-caption">INITIALIZING / MUCHI_TECH</span><span class="boot-brand">muchi_tech</span><span class="boot-line"><i></i></span><span class="boot-caption">Собираю интерфейс из кода<span class="boot-dots">...</span></span></div>';
root.appendChild(boot);document.documentElement.classList.add('matrix-entering');
var brand=boot.querySelector('.boot-brand'),code=boot.querySelector('.boot-code'),started=performance.now(),bootFrame=0;
function finishBoot(){if(!boot.isConnected)return;if(bootFrame)cancelAnimationFrame(bootFrame);document.documentElement.classList.remove('matrix-entering');boot.classList.add('is-finished');setTimeout(function(){boot.remove();},450);watch(root);}
function bootPaint(now){var progress=Math.min(1,(now-started)/1100);brand.textContent=scramble('muchi_tech',progress);var lines=[];for(var r=0;r<14;r++){var line='';for(var c=0;c<65;c++)line+=random();lines.push(line);}code.textContent=lines.join('\n');if(progress<1)bootFrame=requestAnimationFrame(bootPaint);else finishBoot();}
if('IntersectionObserver'in window)observer=new IntersectionObserver(function(entries){var index=0;entries.forEach(function(entry){if(entry.isIntersecting){reveal(entry.target,Math.min(index++*55,220));observer.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px -3% 0px'});
bootFrame=requestAnimationFrame(bootPaint);setTimeout(finishBoot,2200);
var dialog=root.querySelector('dialog'),body=root.querySelector('.window-scroll');if(dialog&&body)new MutationObserver(function(){if(dialog.open)watch(body);}).observe(body,{childList:true});
reduced.addEventListener('change',function(){if(!reduced.matches)return;pending.forEach(function(item,el){restore(el,item);});if(observer)observer.disconnect();if(frame)cancelAnimationFrame(frame);finishBoot();});
document.addEventListener('visibilitychange',function(){if(document.hidden){pending.forEach(function(item,el){restore(el,item);});finishBoot();}});
})();
