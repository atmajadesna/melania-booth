document.addEventListener('DOMContentLoaded',()=>{
 const brand=document.querySelector('header .wordmark');brand.innerHTML='melania <span>booth</span>';
 const a=document.createElement('a');a.href='#tentang';a.textContent='Tentang';document.querySelector('nav').insertBefore(a,document.querySelector('.language-switch'));
 const about=document.createElement('section');about.id='tentang';about.className='about-inline';about.innerHTML='<h2>Tentang Kami</h2><p>Melania Booth adalah studio foto berbasis browser karya Desna. Abadikan momen, pilih bingkai, dan simpan hasilnya—tanpa akun, dengan foto sesi tetap diproses di perangkat Anda.</p>';document.querySelector('main').append(about);
 const track=document.querySelector('.gallery-track');function enrich(){track.querySelectorAll('.gallery-item:not([data-portrait])').forEach((card,i)=>{card.dataset.portrait='true';const img=document.createElement('img');img.src=`assets/gallery-${i%6}.webp`;img.alt='Potret ilustratif untuk tema '+themes[i].name;img.className='gallery-portrait';card.prepend(img);});}new MutationObserver(enrich).observe(track,{childList:true});enrich();
});
