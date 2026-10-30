window.DeviceLayout={prepare(s){
 const app=document.getElementById('app'),world=document.getElementById('world');
 app.style.setProperty('--mode-top',Math.max(74,world.getBoundingClientRect().bottom-app.getBoundingClientRect().top-31)+'px');
 // Revisited concerns remain real controls; completed ones share a single row.
 document.querySelectorAll('[data-action="coleConcern"]').forEach(b=>{const done=s.xp.cole.includes(b.dataset.value);b.classList.toggle('concern-addressed',done);if(done){b.setAttribute('aria-label',b.dataset.value==='identity'?'已說明身分，可回看':'已回應顧慮，可回看');b.textContent=b.dataset.value==='identity'?'✓ 已說明身分':'✓ 已回應顧慮'}});
}};
