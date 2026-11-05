(function(){
'use strict';
var root=document.getElementById('muchi-desktop');
if(!root)return;
root.querySelectorAll('.laptop-display').forEach(function(screen){
 var image=screen.querySelector('img');if(!image)return;
 function measure(){
  var distance=Math.max(0,image.offsetHeight-screen.clientHeight);
  screen.style.setProperty('--preview-scroll',(-distance)+'px');
  screen.style.setProperty('--preview-duration',Math.max(7,Math.min(35,distance/38))+'s');
 }
 image.addEventListener('load',measure);
 if(image.complete)measure();
 if(window.ResizeObserver)new ResizeObserver(measure).observe(screen);
 else window.addEventListener('resize',measure);
});
})();
