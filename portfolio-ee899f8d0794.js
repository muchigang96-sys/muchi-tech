(function () {
'use strict';
var site = document.getElementById('muchi-desktop');
if (!site || site.querySelector('.muchi-matrix-rain')) return;

var canvas = document.createElement('canvas');
canvas.className = 'muchi-matrix-rain';
canvas.setAttribute('aria-hidden', 'true');
canvas.setAttribute('role', 'presentation');
var ctx = canvas.getContext('2d');
if (!ctx) return;
site.insertBefore(canvas, site.firstChild);

var characters = '01234567890123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+*=:<>アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモラリルレロ' ;
var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
var width = 0;
var height = 0;
var cell = 16;
var columns = [];
var frame = 0;
var previous = 0;
var resizeFrame = 0;

function glyph() {
return characters.charAt(Math.floor(Math.random() * characters.length));
}

function makeColumn(x, scattered) {
var rows = Math.ceil(height / cell);
var length = Math.max(8, Math.floor(rows * (0.72 + Math.random() * 0.24)));
var symbols = [];
for (var j = 0; j < length; j++) symbols.push(glyph());
return {
x: x,
y: Math.random() * Math.ceil(height / cell) * cell,
speed: 55 + Math.random() * 105,
length: length,
symbols: symbols,
tick: 0,
brightness: 0.65 + Math.random() * 0.35
};
}

function resize() {
width = site.clientWidth || window.innerWidth;
height = window.innerHeight;
var ratio = Math.min(window.devicePixelRatio || 1, 1.5);
cell = width < 600 ? 14 : 16;
canvas.width = Math.round(width * ratio);
canvas.height = Math.round(height * ratio);
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
ctx.font = '400 ' + (cell - 1) + 'px monospace';
ctx.textBaseline = 'top';
columns = [];
var stride = Math.max(cell, width / 110);
for (var x = 5; x < width; x += stride) columns.push(makeColumn(x, true));
paint(0);
}

function paint(delta) {
ctx.clearRect(0, 0, width, height);
columns.forEach(function (column, index) {
var wrapHeight = Math.ceil(height / cell) * cell;
column.y = (column.y + column.speed * delta) % wrapHeight;
column.tick += delta;
if (column.tick > 0.12) {
column.tick = 0;
for (var change = 0; change < 3; change++) {
column.symbols[Math.floor(Math.random() * column.length)] = glyph();
}
}
for (var j = column.length - 1; j >= 0; j--) {
var y = ((column.y - j * cell) % wrapHeight + wrapHeight) % wrapHeight - cell;
if (y < -cell || y > height) continue;
ctx.globalAlpha = (0.18 + 0.82 * Math.pow(1 - j / column.length, 1.15)) * column.brightness;
ctx.fillStyle = j === 0 ? '#caffbb' : '#38e06b';
ctx.shadowColor = '#5cff73';
ctx.shadowBlur = j === 0 ? 7 : 0;
ctx.fillText(column.symbols[j], column.x, y);
}
});
ctx.globalAlpha = 1;
ctx.shadowBlur = 0;
}

function animate(now) {
if (document.hidden || motion.matches) {
frame = 0;
previous = 0;
return;
}
if (!previous) previous = now;
var elapsed = now - previous;
if (elapsed >= 1000 / 24) {
paint(Math.min(elapsed / 1000, 0.09));
previous = now;
}
frame = window.requestAnimationFrame(animate);
}

function updatePlayback() {
if (frame) window.cancelAnimationFrame(frame);
frame = 0;
previous = 0;
if (!document.hidden && !motion.matches) frame = window.requestAnimationFrame(animate);
else if (motion.matches) paint(0);
}

window.addEventListener('resize', function () {
if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
resizeFrame = window.requestAnimationFrame(function () {
resizeFrame = 0;
resize();
});
});
document.addEventListener('visibilitychange', updatePlayback);
if (motion.addEventListener) motion.addEventListener('change', updatePlayback);
else if (motion.addListener) motion.addListener(updatePlayback);
resize();
updatePlayback();
})();
