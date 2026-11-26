document.addEventListener('DOMContentLoaded',()=>{
document.querySelectorAll('.intro>.eyebrow,.intro>p,.intro>.hero-actions').forEach(e=>e.remove());
const footer=document.querySelector('footer');footer.replaceChildren();const brand=document.createElement('span');brand.className='footer-brand';brand.textContent='Melania Booth';const credit=document.createElement('span');credit.textContent='Design by Desna';footer.append(brand,credit);
const headerBrand=document.querySelector('header>.wordmark');if(headerBrand){headerBrand.remove();document.querySelector('header').classList.add('minimal-header');}
const navCTA=document.querySelector('nav a[href="#studio"]');navCTA.classList.add('round-cta');navCTA.innerHTML='<span>Mulai<br>Foto</span><span aria-hidden="true">↗</span>';navCTA.setAttribute('aria-label','Mulai foto, buka studio');
const invite=document.querySelector('.studio-invite a');invite.classList.add('invite-cta');invite.innerHTML='<span>Coba sekarang</span><span class="cta-arrow" aria-hidden="true">↗</span>';
[navCTA,invite].forEach(a=>a.addEventListener('click',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;e.preventDefault();if(a.dataset.transitioning)return;a.dataset.transitioning='true';a.classList.add('cta-clicked');setTimeout(()=>{location.hash='studio';a.classList.remove('cta-clicked');delete a.dataset.transitioning;},300);}));
});
