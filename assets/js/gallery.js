/**
 * Grade 1 Construction Gallery - Static JavaScript
 * Updated with Video Progress Bar and Time Tracking
 */

(function () {
  'use strict';

  // ============================================
  // 1. DATA CONFIGURATION
  // ============================================
  const RELEASE_URL = 'https://cold-poetry-8926.nazrawigirma598.workers.dev/';

  const CAT_KEYS = [
    'high-rise', 'villas-residential', 'commercial-offices', 
    'hospitality-hotels', 'healthcare', 'education', 
    'infrastructure', 'industrial', 'sustainable-green', 'iconic-landmark'
  ];

  const PROJECTS = Array.from({ length: 19 }, (_, i) => {
    const id = (i + 1).toString();
    const catIndex = i % CAT_KEYS.length;
    
    return {
      id: id,
      title: `Project Demo ${id}`,
      location: 'Addis Ababa, Ethiopia',
      year: 2024,
      category: CAT_KEYS[catIndex],
      categoryLabel: CAT_KEYS[catIndex].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      media: [{
        id: `${id}a`,
        type: 'video',
        src: `${RELEASE_URL}${id}.mp4`,     
        thumbnail: `${RELEASE_URL}${id}.jpg`, 
       
        aspectRatio: 1.33
      }]
    };
  });

  const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'high-rise', label: 'High-Rise Buildings' },
    { id: 'villas-residential', label: 'Villas & Residential' },
    { id: 'commercial-offices', label: 'Commercial & Offices' },
    { id: 'hospitality-hotels', label: 'Hospitality & Hotels' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'education', label: 'Education' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'sustainable-green', label: 'Sustainable & Green' },
    { id: 'iconic-landmark', label: 'Iconic & Landmark' }
  ];

  let state = {
    activeCategory: 'all',
    visibleCount: 12,
    itemsPerPage: 12,
    selectedProject: null,
    currentMediaIndex: 0,
    isLoading: false
  };

  let elements = {};

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  const icons = {
    chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    eye: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    play: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    pause: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>',
    volume2: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    volumeX: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>',
    maximize: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
    mapPin: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    loader: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'
  };

  // Helper for video formatting
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function getProjectCounts() {
    const counts = { all: PROJECTS.length };
    CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') counts[cat.id] = PROJECTS.filter(p => p.category === cat.id).length;
    });
    return counts;
  }

  function renderFilterBar() {
    const counts = getProjectCounts();
    if (!elements.filterList) return;
    elements.filterList.innerHTML = CATEGORIES.map(cat => `
      <button class="filter-btn ${state.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
        <span>${cat.label}</span>
        <span class="filter-count">${counts[cat.id] || 0}</span>
      </button>
    `).join('');

    $$('.filter-btn', elements.filterList).forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.dataset.category;
        state.visibleCount = state.itemsPerPage;
        renderFilterBar();
        renderGallery();
      });
    });
    updateScrollButtons();
  }

  function updateScrollButtons() {
    if (!elements.filterList) return;
    const { scrollLeft, scrollWidth, clientWidth } = elements.filterList;
    if (elements.filterScrollLeft) elements.filterScrollLeft.classList.toggle('visible', scrollLeft > 0);
    if (elements.filterScrollRight) elements.filterScrollRight.classList.toggle('visible', scrollLeft < scrollWidth - clientWidth - 10);
  }

  function scrollFilters(direction) {
    elements.filterList.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  }

  function getFilteredProjects() {
    const largeIds = ['1','2','3','4','5','6']; // treat these as large; they will appear last
    const filtered = state.activeCategory === 'all'
      ? PROJECTS.slice() // copy to avoid mutating original
      : PROJECTS.filter(p => p.category === state.activeCategory);

    // Sort: non-large first, then large; stable sort by id inside each group
    filtered.sort((a, b) => {
      const aIsLarge = largeIds.includes(a.id) ? 1 : 0;
      const bIsLarge = largeIds.includes(b.id) ? 1 : 0;
      if (aIsLarge !== bIsLarge) return aIsLarge - bIsLarge;
      return Number(a.id) - Number(b.id);
    });

    return filtered;
  }

  function renderGallery() {
    const filtered = getFilteredProjects();
    const visible = filtered.slice(0, state.visibleCount);
    if (!elements.galleryGrid) return;

    if (filtered.length === 0) {
      elements.galleryGrid.innerHTML = `<div class="empty-state"><h3>No projects found</h3></div>`;
      return;
    }

    elements.galleryGrid.innerHTML = visible.map((p, i) => createProjectCard(p, i)).join('');
    // Lazy-load video sources when cards become visible
    setupVideoLazyLoad();
    setupScrollReveal();
    if (!prefersReducedMotion()) setupTiltEffect();

    $$('.project-card', elements.galleryGrid).forEach(card => {
      card.addEventListener('click', () => openLightbox(card.dataset.projectId));
    });

    if (elements.loadMoreContainer) elements.loadMoreContainer.style.display = (state.visibleCount < filtered.length) ? 'flex' : 'none';
  }

  function createProjectCard(project, index) {
    const media = project.media[0];
    const isVideo = media?.type === 'video';
    return `
      <article class="gallery-item">
        <div class="project-card reveal" data-project-id="${project.id}" tabindex="0">
          <figure class="card-media" style="aspect-ratio: ${media?.aspectRatio || 1}">
            <div class="card-skeleton"></div>
            ${isVideo ? `
              <img src="${media.thumbnail}" class="video-poster" onload="this.previousElementSibling.style.display='none'">
              <video data-src="${media.src}" muted loop playsinline class="video-hover" preload="metadata"></video>
              <div class="video-play-overlay"><div class="play-icon-large">${icons.play}</div></div>
            ` : `<img src="${media.src}" onload="this.previousElementSibling.style.display='none'">`}
            <div class="card-overlay"><span class="view-details-btn">${icons.eye} View Details</span></div>
          </figure>
        </div>
      </article>`;
  }

  // ============================================
  // Lightbox & Video Progress Logic
  // ============================================
  function openLightbox(projectId) {
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project) return;
    state.selectedProject = project;
    state.currentMediaIndex = 0;
    renderLightbox();
    elements.lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    elements.lightbox.classList.remove('open');
    document.body.style.overflow = '';
    elements.lightbox.innerHTML = '';
  }

  function renderLightbox() {
    const project = state.selectedProject;
    if (!project) return;

    const media = project.media[state.currentMediaIndex];
    const isVideo = media?.type === 'video';

    // Added progress-container and time-display to your existing structure
    elements.lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <button class="lightbox-close">${icons.x}</button>
      <div class="lightbox-content">
        <div class="lightbox-media">
          ${isVideo ? `
            <video src="${media.src}" autoplay muted loop playsinline></video>
            <div class="video-controls">
              <button class="video-play-pause">${icons.pause}</button>
              <div class="progress-container" style="flex:1; height:6px; background:rgba(255,255,255,0.2); border-radius:3px; cursor:pointer; position:relative; overflow:hidden;">
                <div class="progress-bar" style="width:0%; height:100%; background:var(--primary); box-shadow:var(--shadow-glow);"></div>
              </div>
              <span class="time-display" style="font-size:0.75rem; color:white; min-width:70px;">0:00 / 0:00</span>
              <button class="video-mute">${icons.volumeX}</button>
            </div>
          ` : `<img src="${media.src}">`}
        </div>
        <div class="lightbox-info">
          <h3 class="lightbox-title">${project.title}</h3>
        </div>
      </div>
    `;

    // Re-bind basic events
    $('.lightbox-close', elements.lightbox).addEventListener('click', closeLightbox);
    $('.lightbox-backdrop', elements.lightbox).addEventListener('click', closeLightbox);

    // Video specific logic
    if (isVideo) {
      const video = $('video', elements.lightbox);
      const playPauseBtn = $('.video-play-pause', elements.lightbox);
      const muteBtn = $('.video-mute', elements.lightbox);
      const progressBar = $('.progress-bar', elements.lightbox);
      const progressContainer = $('.progress-container', elements.lightbox);
      const timeDisplay = $('.time-display', elements.lightbox);

      video.addEventListener('timeupdate', () => {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percent}%`;
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration || 0)}`;
      });

      progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
      });

      playPauseBtn.addEventListener('click', () => {
        if (video.paused) { video.play(); playPauseBtn.innerHTML = icons.pause; }
        else { video.pause(); playPauseBtn.innerHTML = icons.play; }
      });

      muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted ? icons.volumeX : icons.volume2;
      });
    }
  }

  // Remaining Utilities
  function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    $$('.reveal').forEach(el => observer.observe(el));
  }

  function setupTiltEffect() {
    $$('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2) * 8;
        const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2) * -8;
        card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = ``);
    });
  }

  // Lazy-load helper for video sources
  function setupVideoLazyLoad() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const video = entry.target.querySelector('video[data-src]');
        if (video && !video.src) {
          video.src = video.dataset.src;
        }
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '200px 0px 200px 0px' });

    document.querySelectorAll('.gallery-item').forEach(el => observer.observe(el));
  }

  function init() {
    elements = {
      filterList: $('#filter-list'),
      galleryGrid: $('#gallery-grid'),
      loadMoreBtn: $('#load-more-btn'),
      loadMoreContainer: $('#load-more-container'),
      lightbox: $('#lightbox')
    };
    renderFilterBar();
    renderGallery();
    if (elements.loadMoreBtn) elements.loadMoreBtn.addEventListener('click', () => {
        state.visibleCount += state.itemsPerPage;
        renderGallery();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
```0
