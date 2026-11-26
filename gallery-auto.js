document.addEventListener('DOMContentLoaded',()=>{
const track=document.querySelector('.gallery-track');if(!track)return;
document.querySelector('.gallery-actions')?.remove();document.querySelector('.gallery-note')?.remove();
const credits=document.createElement('p');credits.className='gallery-credit';credits.textContent='Contoh galeri menggunakan foto ilustratif dari Unsplash; foto sesi tidak dipublikasikan.';document.querySelector('footer').append(credits);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let last=0,pauseUntil=0,direction=1;
track.addEventListener('pointerdown',()=>pauseUntil=performance.now()+6000);track.addEventListener('wheel',()=>pauseUntil=performance.now()+6000,{passive:true});track.addEventListener('keydown',()=>pauseUntil=performance.now()+6000);
function tick(now){const dt=Math.min(now-last,40);last=now;if(!document.hidden&&!reduced.matches&&!document.body.classList.contains('motion-paused')&&now>pauseUntil){const end=track.scrollWidth-track.clientWidth;if(end>0){if(track.scrollLeft>=end-1)direction=-1;else if(track.scrollLeft<=1)direction=1;track.scrollLeft+=direction*Math.max(1,dt*.055);}}requestAnimationFrame(tick);}requestAnimationFrame(tick);
});
