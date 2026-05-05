document.addEventListener("DOMContentLoaded", () => {
    console.log("App Inicializado (Supabase).");

    // ---- SESSION ----
    const session = JSON.parse(localStorage.getItem('prato_honesto_session') || 'null');
    const appData = { places: [], currentCategory: '', currentSort: '', currentSearch: '', user: session ? session.user : null, token: session ? session.access_token : null };

    function authHeaders() { return appData.token ? { 'Authorization': 'Bearer ' + appData.token } : {}; }

    // ---- UTILS ----
    window.formatMoney = l => l || '$$';
    window.getCategoryEmoji = c => ({ marmitaria:'🍱', restaurant:'🍽️', snack:'🍔', pastelaria:'🥟' })[c] || '🍽️';
    window.getCategoryName = c => ({ marmitaria:'Marmitaria', restaurant:'Restaurante', snack:'Lanchonete', pastelaria:'Pastelaria' })[c] || 'Local';

    // ---- HEADER DINÂMICO ----
    const headerNav = document.getElementById('headerNav') || document.querySelector('.header-nav');
    if (headerNav && appData.user) {
        headerNav.innerHTML = '<a href="rankings.html" class="btn btn-outline">🏆 Rankings</a>' +
            '<a href="dashboard.html" class="btn btn-outline" style="margin-left:8px">👤 ' + appData.user.name.split(' ')[0] + '</a>' +
            '<a href="#" id="logoutBtn" class="btn btn-outline" style="border-color:var(--destructive);color:var(--destructive);margin-left:8px">Sair</a>';
        document.getElementById('logoutBtn').addEventListener('click', e => { e.preventDefault(); localStorage.removeItem('prato_honesto_session'); window.location.reload(); });
    }

    // ---- STAR RATING ----
    window.setupStars = function(containerId, inputId) {
        const stars = document.querySelectorAll('#' + containerId + ' .star-btn');
        const inp = document.getElementById(inputId);
        if (!stars.length || !inp) return;
        const labels = ['Péssimo','Ruim','Razoável','Muito Bom','Excelente!'];
        const lbl = document.getElementById(containerId === 'uStarRating' ? 'uStarLabel' : 'starLabel');
        stars.forEach(s => {
            s.addEventListener('mouseover', function() { const v = +this.dataset.val; stars.forEach(x => x.classList.toggle('hovered', +x.dataset.val <= v)); if(lbl) lbl.textContent = labels[v-1]; });
            s.addEventListener('mouseout', () => { stars.forEach(x => x.classList.remove('hovered')); if(lbl) lbl.textContent = inp.value ? labels[inp.value-1] : 'Clique para avaliar'; });
            s.addEventListener('click', function() { const v = +this.dataset.val; inp.value = v; stars.forEach(x => x.classList.toggle('selected', +x.dataset.val <= v)); });
        });
    }

    window.setupMiniStars = function(field) {
        const c = document.querySelector('.mini-stars[data-field="'+field+'"]');
        const i = document.querySelector('input[name="'+(field==='food'?'food_quality':field==='cost'?'cost_benefit':'service')+'"]');
        if (!c || !i) return;
        c.querySelectorAll('.mini-star').forEach(s => s.addEventListener('click', () => { const v = +s.dataset.val; i.value = v; c.querySelectorAll('.mini-star').forEach(x => x.classList.toggle('active', +x.dataset.val <= v)); }));
    }

    // ---- LOGIN PAGE ----
    const loginForm = document.getElementById('loginForm');
    if (loginForm && !window.location.pathname.includes('login.html')) {
        // Skip - login.html has its own inline script
    }

    // ---- DASHBOARD ----
    if (window.location.pathname.includes('dashboard.html')) {
        if (!appData.user) { window.location.href = 'login.html'; }
        else {
            const dn = document.getElementById('dashName'), di = document.getElementById('dashInputName'), de = document.getElementById('dashInputEmail');
            if (dn) dn.textContent = appData.user.name;
            if (di) di.value = appData.user.name;
            if (de) de.value = appData.user.email;
            fetch('/api/users/' + appData.user.id + '/stats').then(r => r.json()).then(d => { const el = document.getElementById('dashReviewsCount'); if (el) el.textContent = d.reviewsCount || 0; }).catch(console.error);
        }
    }

    // ---- SEARCH ----
    const heroSearch = document.getElementById('heroSearchInput');
    if (heroSearch) heroSearch.addEventListener('input', e => { appData.currentSearch = e.target.value.trim(); applyFilters(); });

    // ---- FILTERS ----
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            if (chip.dataset.filterCat !== undefined) { appData.currentCategory = chip.dataset.filterCat; appData.currentSort = ''; }
            else if (chip.dataset.filter !== undefined) { appData.currentSort = chip.dataset.filter; appData.currentCategory = ''; }
            applyFilters();
        });
    });

    // ---- LOAD PLACES ----
    const placesGrid = document.getElementById('placesGrid');
    const highlightsSection = document.getElementById('highlightsSection');
    if (placesGrid) { fetchPlaces(); if (highlightsSection) fetchHighlights(); }

    function fetchPlaces() {
        fetch('/api/places').then(r => r.json()).then(data => {
            appData.places = data;
            applyFilters();
        }).catch(err => {
            console.error("Erro:", err);
            if (placesGrid) placesGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted-foreground)">🍽️ Erro ao carregar. Verifique o servidor.</div>';
        });
    }

    function fetchHighlights() {
        fetch('/api/places/highlights').then(r => r.json()).then(data => {
            if (!highlightsSection) return;
            const cats = [{id:'marmitaria',icon:'🍱',title:'Melhores Marmitarias'},{id:'restaurant',icon:'🍽️',title:'Restaurantes em Destaque'},{id:'snack',icon:'🍔',title:'Top Lanchonetes'},{id:'pastelaria',icon:'🥟',title:'Pastelarias Favoritas'}];
            let html = '';
            cats.forEach(cat => {
                const p = data[cat.id];
                if (p && p.length > 0) {
                    html += '<div class="highlight-section"><div class="highlight-section-header"><h2 class="highlight-section-title">'+cat.icon+' '+cat.title+'</h2></div><div class="highlight-grid">' +
                        p.map(pl => '<a href="/place.html?id='+pl.id+'" class="highlight-card"><div class="highlight-card-img">'+(pl.photo_url?'<img src="'+pl.photo_url+'">':cat.icon)+'</div><div class="highlight-card-body"><h3 class="highlight-card-name">'+pl.name+'</h3><div class="highlight-card-rating"><span class="star">⭐</span><strong>'+parseFloat(pl.average_rating).toFixed(1)+'</strong><span>('+pl.total_reviews+' av)</span></div></div></a>').join('') +
                        '</div></div>';
                }
            });
            highlightsSection.innerHTML = html;
        });
    }

    function applyFilters() {
        let f = [...appData.places];
        if (appData.currentSearch) { const q = appData.currentSearch.toLowerCase(); f = f.filter(p => p.name.toLowerCase().includes(q)); }
        if (appData.currentCategory) f = f.filter(p => p.category === appData.currentCategory);
        if (appData.currentSort === 'rating') f.sort((a,b) => b.average_rating - a.average_rating);
        else if (appData.currentSort === 'cheap') f.sort((a,b) => (a.price_range||'$$').length - (b.price_range||'$$').length);
        renderPlaces(f);
    }

    function renderPlaces(places) {
        if (!placesGrid) return;
        if (places.length === 0) { placesGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px"><div style="font-size:3rem;margin-bottom:16px">🔍</div><h3>Nenhum lugar encontrado</h3><p style="color:var(--muted-foreground)">Tente outro nome ou categoria</p></div>'; return; }
        placesGrid.innerHTML = '';
        places.forEach(place => {
            const card = document.createElement('a');
            card.className = 'place-card';
            card.href = '/place.html?id=' + place.id;
            const img = place.photo_url ? '<img src="'+place.photo_url+'" alt="'+place.name+'">' : '<span style="font-size:3rem">'+getCategoryEmoji(place.category)+'</span>';
            card.innerHTML = '<div class="place-img-container">'+img+'<div class="price-badge">'+formatMoney(place.price_range)+'</div></div><div class="place-info"><h3 class="place-name">'+place.name+'</h3><div class="rating-line"><span class="star">⭐</span><span class="rating-val">'+parseFloat(place.average_rating).toFixed(1)+'</span><span class="rating-count">('+place.total_reviews+' avaliações)</span></div><div class="place-meta"><span>'+getCategoryEmoji(place.category)+' '+getCategoryName(place.category)+'</span></div></div>';
            placesGrid.appendChild(card);
        });
    }

    // ---- PLACE DETAIL ----
    const placeDetail = document.getElementById('placeDetail');
    if (placeDetail) {
        const pid = new URLSearchParams(window.location.search).get('id');
        if (pid) loadPlaceDetail(pid);
    }

    function loadPlaceDetail(id) {
        Promise.all([fetch('/api/places/'+id).then(r=>r.json()), fetch('/api/places/'+id+'/reviews').then(r=>r.json())])
        .then(([place, reviews]) => renderPlaceDetail(place, reviews)).catch(console.error);
    }

    function renderPlaceDetail(place, reviews) {
        document.title = place.name + ' - Prato Honesto';
        const coverDiv = document.getElementById('placeCover');
        if (coverDiv && place.photo_url) coverDiv.style.backgroundImage = "url('"+place.photo_url+"')";

        const container = document.getElementById('placeDetail');
        const starsHtml = '⭐'.repeat(Math.round(place.average_rating));
        container.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:flex-start"><div><span style="color:var(--muted-foreground);text-transform:uppercase;font-size:.85rem;font-weight:bold;letter-spacing:1px">'+getCategoryEmoji(place.category)+' '+getCategoryName(place.category)+'</span><h1 style="font-size:2.5rem;margin:8px 0;font-family:\'Libre Caslon Text\',serif">'+place.name+'</h1></div><div style="text-align:right"><div style="background:rgba(230,126,34,0.1);padding:12px 20px;border-radius:var(--radius);display:inline-block"><span style="display:block;font-size:1.1rem;margin-bottom:4px">'+starsHtml+'</span><span style="font-size:2rem;font-weight:bold;line-height:1">'+parseFloat(place.average_rating).toFixed(1)+'</span></div><p style="color:var(--muted-foreground);margin-top:8px;font-size:.9rem">'+place.total_reviews+' avaliações</p></div></div><p style="margin-top:20px;color:var(--foreground);line-height:1.6">'+(place.description||'')+'</p>' + (place.address ? '<p style="margin-top:12px;color:var(--muted-foreground)">📍 '+place.address+'</p>' : '');

        // Reviews
        const reviewsList = document.getElementById('reviewsList');
        const reviewsTitle = document.getElementById('reviewsCountTitle');
        if (reviewsTitle) reviewsTitle.textContent = 'Avaliações ('+reviews.length+')';
        if (reviewsList) {
            if (reviews.length === 0) { reviewsList.innerHTML = '<div class="loading-placeholder">Nenhuma avaliação ainda. Seja o primeiro!</div>'; }
            else {
                reviewsList.innerHTML = reviews.map(r => {
                    const initials = (r.user_name||'U').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
                    const badge = r.would_recommend ? '<span style="background:#e6f4ea;color:#1e8e3e;padding:4px 12px;border-radius:100px;font-size:.8rem;font-weight:600">👍 Recomenda</span>' : '<span style="background:#fce8e6;color:#c5221f;padding:4px 12px;border-radius:100px;font-size:.8rem;font-weight:600">👎 Não recomenda</span>';
                    const date = new Date(r.created_at).toLocaleDateString('pt-BR');
                    let photosHtml = '';
                    try { const urls = typeof r.photo_urls==='string'?JSON.parse(r.photo_urls):r.photo_urls; if(urls&&urls.length>0) photosHtml='<div class="review-photos">'+urls.map(u=>'<img src="'+u+'" class="review-photo">').join('')+'</div>'; } catch(e){}
                    return '<div class="review-card"><div class="review-header"><div class="avatar">'+initials+'</div><div style="flex:1"><h4 style="font-family:Poppins,sans-serif;margin:0">'+r.user_name+'</h4><span style="font-size:.8rem;color:var(--muted-foreground)">'+date+'</span></div></div><div style="margin-bottom:12px;display:flex;align-items:center;gap:8px"><span style="color:var(--accent-foreground);font-weight:bold">'+'⭐'.repeat(r.rating)+' '+r.rating+'.0</span>'+badge+'</div>'+(r.comment?'<p style="margin:12px 0;line-height:1.5">'+r.comment+'</p>':'')+photosHtml+'</div>';
                }).join('');
            }
        }

        // Review form on place page
        const formContainer = document.getElementById('reviewFormContainer');
        if (formContainer) {
            if (appData.user) {
                formContainer.innerHTML = '<div class="review-card" style="position:sticky;top:20px"><h3 style="margin-bottom:16px;font-family:Poppins,sans-serif">Sua experiência</h3><form id="submitReviewForm" enctype="multipart/form-data"><div style="margin-bottom:20px"><label class="mini-rating-label">Nota Geral *</label><div class="star-rating" id="pageStarRating"><span class="star-btn" data-val="1">&#9733;</span><span class="star-btn" data-val="2">&#9733;</span><span class="star-btn" data-val="3">&#9733;</span><span class="star-btn" data-val="4">&#9733;</span><span class="star-btn" data-val="5">&#9733;</span></div><input type="hidden" id="revRating" required></div><div style="margin:20px 0"><label class="mini-rating-label">Recomenda? *</label><div style="display:flex;gap:12px"><button type="button" class="rec-btn yes active" id="btnRecYes" style="flex:1;padding:12px;border:1.5px solid #1e8e3e;background:rgba(30,142,62,.07);color:#1e8e3e;border-radius:10px;font-family:inherit;font-size:.95rem;font-weight:600;cursor:pointer">👍 Sim</button><button type="button" class="rec-btn no" id="btnRecNo" style="flex:1;padding:12px;border:1.5px solid var(--border);background:none;border-radius:10px;font-family:inherit;font-size:.95rem;font-weight:600;cursor:pointer">👎 Não</button></div><input type="hidden" id="revRecommend" value="1"></div><div style="margin-bottom:16px"><label class="mini-rating-label">Comentário</label><textarea id="revComment" rows="4" style="width:100%;padding:12px;border-radius:8px;border:1px solid var(--border);resize:vertical;font-family:inherit;font-size:.9rem;box-sizing:border-box" placeholder="O que você achou?"></textarea></div><div style="margin-bottom:24px"><label class="mini-rating-label">Fotos</label><input type="file" id="revPhotos" name="photos" multiple accept="image/*" style="width:100%;font-size:.8rem"></div><button type="submit" class="btn btn-primary" style="width:100%;padding:14px;font-weight:bold">Publicar Avaliação</button></form></div>';

                setupStars('pageStarRating', 'revRating');

                const btnY = document.getElementById('btnRecYes'), btnN = document.getElementById('btnRecNo'), inpR = document.getElementById('revRecommend');
                btnY.addEventListener('click', () => { inpR.value='1'; btnY.style.borderColor='#1e8e3e'; btnY.style.background='rgba(30,142,62,.07)'; btnY.style.color='#1e8e3e'; btnN.style.borderColor='var(--border)'; btnN.style.background='none'; btnN.style.color='inherit'; });
                btnN.addEventListener('click', () => { inpR.value='0'; btnN.style.borderColor='var(--destructive)'; btnN.style.background='rgba(220,53,69,.07)'; btnN.style.color='var(--destructive)'; btnY.style.borderColor='var(--border)'; btnY.style.background='none'; btnY.style.color='inherit'; });

                document.getElementById('submitReviewForm').addEventListener('submit', function(e) {
                    e.preventDefault();
                    const ratingVal = document.getElementById('revRating').value;
                    if (!ratingVal) { alert('Selecione uma nota!'); return; }
                    const fd = new FormData();
                    fd.append('rating', ratingVal);
                    fd.append('would_recommend', inpR.value);
                    fd.append('comment', document.getElementById('revComment').value);
                    const files = document.getElementById('revPhotos').files;
                    for (let i=0;i<files.length;i++) fd.append('photos', files[i]);

                    const btn = this.querySelector('button[type="submit"]');
                    btn.textContent = 'Enviando...'; btn.disabled = true;

                    fetch('/api/places/'+place.id+'/reviews', { method:'POST', headers: authHeaders(), body: fd })
                    .then(r=>r.json().then(d=>({ok:r.ok,data:d})))
                    .then(res => {
                        if (res.ok) { alert('Avaliação publicada!'); window.location.reload(); }
                        else alert(res.data.error || 'Erro ao publicar.');
                    })
                    .catch(()=>alert('Erro no servidor.'))
                    .finally(()=>{ btn.textContent='Publicar Avaliação'; btn.disabled=false; });
                });
            } else {
                formContainer.innerHTML = '<div class="review-card" style="text-align:center;padding:32px"><div style="font-size:3rem;margin-bottom:16px">🔐</div><h3 style="margin-bottom:8px;font-family:Poppins,sans-serif">Entre para avaliar</h3><p style="color:var(--muted-foreground);margin-bottom:24px;font-size:.9rem">Suas avaliações ajudam outros usuários!</p><a href="login.html" class="btn btn-primary" style="width:100%">Fazer Login</a></div>';
            }
        }
    }

    // ---- ADMIN ----
    window.deletePlace = pid => { if(!confirm('Deletar?'))return; fetch('/api/places/'+pid,{method:'DELETE',headers:{...authHeaders()}}).then(r=>r.json().then(d=>({ok:r.ok,data:d}))).then(r=>{if(r.ok){alert('Removido!');window.location.href='index.html';}else alert(r.data.error);}).catch(()=>alert('Erro.')); };
    window.deleteReview = rid => { if(!confirm('Deletar?'))return; fetch('/api/reviews/'+rid,{method:'DELETE',headers:{...authHeaders()}}).then(r=>r.json().then(d=>({ok:r.ok,data:d}))).then(r=>{if(r.ok){alert('Removido!');window.location.reload();}else alert(r.data.error);}).catch(()=>alert('Erro.')); };

    // ---- MODAL UNIFICADO (Home) ----
    const fab = document.getElementById('fabReview');
    const modal = document.getElementById('reviewModal');

    if (modal && appData.user) {
        if (fab) {
            fab.style.display = 'flex';
            fab.addEventListener('click', () => { modal.style.display = 'flex'; });
        }
        
        const closeBtn = document.getElementById('closeModal');
        if (closeBtn) closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
        
        modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

        // Stars
        setupStars('uStarRating', 'uRating');

        // Recommend
        const ry = document.getElementById('uRecYes'), rn = document.getElementById('uRecNo'), ri = document.getElementById('uRecommend');
        if (ry && rn) {
            ry.addEventListener('click', () => { ri.value='1'; ry.classList.add('active'); rn.classList.remove('active'); });
            rn.addEventListener('click', () => { ri.value='0'; rn.classList.add('active'); ry.classList.remove('active'); });
            ry.classList.add('active');
        }

        // Photo preview
        const uPhotos = document.getElementById('uPhotos');
        const uPreview = document.getElementById('uPhotoPreview');
        if (uPhotos) {
            uPhotos.addEventListener('change', function() {
                uPreview.innerHTML = '';
                if (this.files.length > 3) { alert('Máximo 3 fotos.'); this.value=''; return; }
                Array.from(this.files).forEach(f => { const r = new FileReader(); r.onload = e => { const img = document.createElement('img'); img.src=e.target.result; img.className='photo-thumb'; uPreview.appendChild(img); }; r.readAsDataURL(f); });
            });
        }

        // Submit unified form
        const uForm = document.getElementById('unifiedForm');
        if (uForm) {
            uForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const errEl = document.getElementById('uErrorMsg');
                errEl.style.display = 'none';
                const rating = document.getElementById('uRating').value;
                if (!rating) { errEl.textContent='Selecione uma nota em estrelas.'; errEl.style.display='block'; return; }

                const experiences = Array.from(document.querySelectorAll('input[name="exp"]:checked')).map(c=>c.value);
                const fd = new FormData();
                fd.append('place_name', document.getElementById('uPlaceName').value);
                fd.append('category', document.getElementById('uCategory').value);
                fd.append('address', document.getElementById('uAddress').value);
                fd.append('experience_types', JSON.stringify(experiences));
                fd.append('rating', rating);
                fd.append('would_recommend', document.getElementById('uRecommend').value);
                fd.append('comment', document.getElementById('uComment').value);
                const files = document.getElementById('uPhotos').files;
                for (let i=0;i<files.length;i++) fd.append('photos', files[i]);

                const btn = document.getElementById('uSubmitBtn');
                const orig = btn.textContent;
                btn.textContent = 'Enviando...'; btn.disabled = true;

                fetch('/api/submit', { method: 'POST', headers: authHeaders(), body: fd })
                .then(r => r.json().then(d => ({ ok: r.ok, data: d })))
                .then(result => {
                    if (result.ok) {
                        alert('🎉 Avaliação publicada com sucesso!');
                        modal.style.display = 'none';
                        uForm.reset();
                        document.getElementById('uRating').value = '';
                        document.querySelectorAll('#uStarRating .star-btn').forEach(s=>s.classList.remove('selected'));
                        document.getElementById('uStarLabel').textContent = 'Clique para avaliar';
                        uPreview.innerHTML = '';
                        fetchPlaces();
                        if (highlightsSection) fetchHighlights();
                    } else {
                        errEl.textContent = result.data.error || 'Erro ao enviar.';
                        errEl.style.display = 'block';
                    }
                })
                .catch(() => { errEl.textContent='Erro de conexão com o servidor.'; errEl.style.display='block'; })
                .finally(() => { btn.textContent = orig; btn.disabled = false; });
            });
        }
    }

    // ---- RANKINGS PAGE ----
    const rankingsContainer = document.getElementById('rankingsContainer');
    if (rankingsContainer) {
        fetch('/api/places').then(r=>r.json()).then(data => {
            const sorted = data.sort((a,b) => b.average_rating - a.average_rating);
            rankingsContainer.innerHTML = sorted.map((p,i) => '<a href="/place.html?id='+p.id+'" class="place-card"><div class="place-img-container">'+(p.photo_url?'<img src="'+p.photo_url+'">':'<span style="font-size:3rem">'+getCategoryEmoji(p.category)+'</span>')+'<div class="price-badge">#'+(i+1)+'</div></div><div class="place-info"><h3 class="place-name">'+p.name+'</h3><div class="rating-line"><span class="star">⭐</span><span class="rating-val">'+parseFloat(p.average_rating).toFixed(1)+'</span><span class="rating-count">('+p.total_reviews+' av)</span></div></div></a>').join('');
        });
    }
});