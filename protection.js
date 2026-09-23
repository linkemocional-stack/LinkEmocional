
(function(){
document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
document.addEventListener('keydown', function(e){
var k = e.key ? e.key.toUpperCase() : '';
if (k === 'F12') { e.preventDefault(); return; }
if (e.ctrlKey && e.shiftKey && (k === 'I' || k === 'J' || k === 'C')) { e.preventDefault(); return; }
if (e.ctrlKey && (k === 'U' || k === 'S')) { e.preventDefault(); return; }
if (e.metaKey && e.altKey && (k === 'I' || k === 'J' || k === 'C')) { e.preventDefault(); return; }
});
document.addEventListener('dragstart', function(e){ e.preventDefault(); });
document.documentElement.style.webkitUserSelect = 'none';
document.documentElement.style.userSelect = 'none';
var exceptStyle = document.createElement('style');
exceptStyle.textContent = 'input, textarea, [contenteditable="true"] { -webkit-user-select: text; user-select: text; }';
document.head.appendChild(exceptStyle);
})();