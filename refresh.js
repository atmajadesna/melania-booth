document.addEventListener('DOMContentLoaded',()=>{
 const brand=document.querySelector('header .wordmark');brand.innerHTML='melania <span>booth</span>';
 const a=document.createElement('a');a.href='tentang.html';a.textContent='Tentang';document.querySelector('nav').insertBefore(a,document.querySelector('.language-switch'));
 const track=document.querySelector('.gallery-track');function enrich(){track.querySelectorAll('.gallery-item:not([data-portrait])').forEach((card,i)=>{card.dataset.portrait='true';const img=document.createElement('img');img.src=`assets/gallery-${i%6}.webp`;img.alt='Potret ilustratif untuk tema '+themes[i].name;img.className='gallery-portrait';card.prepend(img);});}new MutationObserver(enrich).observe(track,{childList:true});enrich();
});
