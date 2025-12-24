/**
 * Grade 1 Construction Gallery - Static JavaScript
 * Vanilla JS implementation matching React functionality
 * Features: Filtering, Masonry Grid, Lightbox, Scroll Reveal, 3D Tilt
 */

(function () {
  'use strict';

  // ============================================
  // Project Data
  // ============================================
  // Sample video URLs for demonstration
  const SAMPLE_VIDEOS = {
    construction1: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    construction2: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    construction3: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    timelapse1: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    timelapse2: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    drone1: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  };

  const PROJECTS = [
    
    {
      id: '1',
      media: [
        { id: '2a', type: 'video', src: SAMPLE_VIDEOS.timelapse1, thumbnail: 'assets/images/azure-heights.jpg', alt: 'Azure Heights drone flythrough', aspectRatio: 1.78 },
        
      ]
    },
    {
      id: '10',
      title: 'Horizon University Campus',
      location: 'Sydney, Australia',
      year: 2023,
      category: 'education',
      categoryLabel: 'Education',
      media: [
        { id: '10a', type: 'image', src: 'assets/images/horizon-university.jpg', alt: 'Horizon University Campus - Contemporary educational architecture', aspectRatio: 1.33 }
      ]
    },
    {
      id: '11',
      title: 'Cross-Bay Bridge',
      location: 'San Francisco, USA',
      year: 2024,
      category: 'infrastructure',
      categoryLabel: 'Infrastructure',
      media: [
        { id: '11a', type: 'video', src: SAMPLE_VIDEOS.timelapse1, thumbnail: 'assets/images/cross-bay-bridge.jpg', alt: 'Cross-Bay Bridge construction timelapse', aspectRatio: 1.78 },
        { id: '11b', type: 'image', src: 'assets/images/cross-bay-bridge.jpg', alt: 'Cross-Bay Bridge - Cable-stayed bridge at sunset', aspectRatio: 1.6 }
      ]
    },
    {
      id: '12',
      title: 'Global Logistics Center',
      location: 'Rotterdam, Netherlands',
      year: 2023,
      category: 'industrial',
      categoryLabel: 'Industrial',
      media: [
        { id: '12a', type: 'image', src: 'assets/images/logistics-center.jpg', alt: 'Global Logistics Center - Automated port facility', aspectRatio: 1.33 },
        { id: '12b', type: 'video', src: SAMPLE_VIDEOS.construction2, thumbnail: 'assets/images/logistics-center.jpg', alt: 'Logistics Center operations video', aspectRatio: 1.78 }
      ]
    },
    {
      id: '13',
      title: 'EcoVerde Headquarters',
      location: 'Copenhagen, Denmark',
      year: 2024,
      category: 'sustainable-green',
      categoryLabel: 'Sustainable & Green',
      media: [
        { id: '13a', type: 'image', src: 'assets/images/ecoverde-hq.jpg', alt: 'EcoVerde Headquarters - Biophilic office building', aspectRatio: 1.0 },
        { id: '13b', type: 'video', src: SAMPLE_VIDEOS.timelapse2, thumbnail: 'assets/images/ecoverde-hq.jpg', alt: 'EcoVerde sustainable features tour', aspectRatio: 1.78 }
      ]
    },
    {
      id: '14',
      title: 'The Helix Tower',
      location: 'Tokyo, Japan',
      year: 2024,
      category: 'iconic-landmark',
      categoryLabel: 'Iconic & Landmark',
      featured: true,
      media: [
        { id: '14a', type: 'image', src: 'assets/images/helix-tower.jpg', alt: 'The Helix Tower - Twisted spiral skyscraper at night', aspectRatio: 0.7 },
        { id: '14b', type: 'video', src: SAMPLE_VIDEOS.drone1, thumbnail: 'assets/images/helix-tower.jpg', alt: 'Helix Tower drone showcase', aspectRatio: 1.78 }
      ]
    },
    {
      id: '15',
      title: 'Coastal Medical Center',
      location: 'Miami, USA',
      year: 2023,
      category: 'healthcare',
      categoryLabel: 'Healthcare',
      media: [
        { id: '15a', type: 'image', src: 'assets/images/coastal-medical.jpg', alt: 'Coastal Medical Center - Art Deco hospital with ocean view', aspectRatio: 1.33 }
      ]
    }
  ];

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

  // ============================================
  // State
  // ============================================
  let state = {
    activeCategory: 'all',
    visibleCount: 12,
    itemsPerPage: 12,
    selectedProject: null,
    currentMediaIndex: 0,
    isLoading: false
  };

  // ============================================
  // DOM Elements
  // ============================================
  let elements = {};

  // ============================================
  // Utility Functions
  // ============================================
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

  // ============================================
  // Icon SVGs
  // ============================================
  const icons = {
    chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    eye: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    play: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    pause: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>',
    volume2: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    volumeX: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>',
    maximize: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
    mapPin: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    loader: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'
  };

  // ============================================
  // Project Counts
  // ============================================
  function getProjectCounts() {
    const counts = { all: PROJECTS.length };
    CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = PROJECTS.filter(p => p.category === cat.id).length;
      }
    });
    return counts;
  }

  // ============================================
  // Filter Bar
  // ============================================
  function renderFilterBar() {
    const counts = getProjectCounts();
    const filterList = elements.filterList;

    filterList.innerHTML = CATEGORIES.map(cat => `
      <button
        class="filter-btn ${state.activeCategory === cat.id ? 'active' : ''}"
        data-category="${cat.id}"
        role="tab"
        aria-selected="${state.activeCategory === cat.id}"
        aria-controls="gallery-grid"
      >
        <span>${cat.label}</span>
        <span class="filter-count">${counts[cat.id] || 0}</span>
      </button>
    `).join('');

    // Add event listeners
    $$('.filter-btn', filterList).forEach(btn => {
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
    const scrollContainer = elements.filterList;
    const leftBtn = elements.filterScrollLeft;
    const rightBtn = elements.filterScrollRight;

    if (!scrollContainer || !leftBtn || !rightBtn) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

    leftBtn.classList.toggle('visible', scrollLeft > 0);
    rightBtn.classList.toggle('visible', scrollLeft < scrollWidth - clientWidth - 10);
  }

  function scrollFilters(direction) {
    const scrollAmount = 200;
    elements.filterList.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  // ============================================
  // Gallery Grid
  // ============================================
  function getFilteredProjects() {
    if (state.activeCategory === 'all') return PROJECTS;
    return PROJECTS.filter(p => p.category === state.activeCategory);
  }

  function renderGallery() {
    const filtered = getFilteredProjects();
    const visible = filtered.slice(0, state.visibleCount);
    const hasMore = state.visibleCount < filtered.length;

    if (filtered.length === 0) {
      elements.galleryGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🏗️</div>
          <h3 class="empty-title">No projects found</h3>
          <p class="empty-text">We don't have any projects in this category yet. Check back soon or explore other categories.</p>
        </div>
      `;
      elements.loadMoreContainer.style.display = 'none';
      elements.resultsCount.textContent = '';
      return;
    }

    elements.galleryGrid.innerHTML = visible.map((project, index) => createProjectCard(project, index)).join('');

    // Setup scroll reveal
    setupScrollReveal();

    // Setup 3D tilt
    if (!prefersReducedMotion()) {
      setupTiltEffect();
    }

    // Add click listeners
    $$('.project-card', elements.galleryGrid).forEach(card => {
      const projectId = card.dataset.projectId;
      card.addEventListener('click', () => openLightbox(projectId));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(projectId);
        }
      });
    });

    // Load more button
    if (hasMore) {
      elements.loadMoreContainer.style.display = 'flex';
     elements.loadMoreBtn.innerHTML = `Load More Projects`;
      
      elements.loadMoreBtn.disabled = false;
    } else {
      elements.loadMoreContainer.style.display = 'none';
    }

    // Results count
    elements.resultsCount.textContent = `Showing ${visible.length} of ${filtered.length} projects`;
  }

  function createProjectCard(project, index) {
    const media = project.media[0];
    const isVideo = media?.type === 'video';
    const aspectRatio = media?.aspectRatio || 1;
    const posterSrc = isVideo ? (media.thumbnail || '') : media.src;

    return `
      <article 
        class="gallery-item"
        style="animation-delay: ${index * 80}ms"
      >
        <div 
          class="project-card reveal"
          data-project-id="${project.id}"
          tabindex="0"
          role="button"
          aria-label="View ${project.title} project details"
          style="transition-delay: ${index * 80}ms"
        >
          <figure class="card-media" style="aspect-ratio: ${aspectRatio}">
            <div class="card-skeleton"></div>
            ${isVideo ? `
              <!-- Poster image shown by default -->
              <img 
                src="${posterSrc}"
                alt="${media.alt}"
                class="video-poster"
                loading="lazy"
                onload="this.previousElementSibling.style.display='none'"
              />
              <!-- Video plays on hover -->
              <video 
                src="${media.src}" 
                poster="${posterSrc}"
                muted 
                loop 
                playsinline
                class="video-hover"
                aria-hidden="true"
              ></video>
              <!-- Play icon overlay - always visible for video cards -->
              <div class="video-play-overlay">
                <div class="play-icon-large">${icons.play}</div>
              </div>
            ` : `
              <img 
                src="${media.src}" 
                alt="${media.alt}"
                loading="lazy"
                onload="this.previousElementSibling.style.display='none'"
              />
            `}
            <span class="card-badge">${project.categoryLabel}</span>
            <div class="card-overlay">
              <span class="view-details-btn">
                ${icons.eye}
                View Details
              </span>
            </div>
          </figure>
          <figcaption class="card-content">
            <h3 class="card-title">${project.title}</h3>
            <div class="card-meta">
              <span class="card-meta-item">
                ${icons.mapPin}
                ${project.location}
              </span>
              <span class="card-meta-item">
                ${icons.calendar}
                ${project.year}
              </span>
            </div>
          </figcaption>
        </div>
      </article>
    `;
  }

  function loadMore() {
    if (state.isLoading) return;

    state.isLoading = true;
    elements.loadMoreBtn.disabled = true;
    elements.loadMoreBtn.innerHTML = `<div class="loading-spinner"></div> Loading...`;

    setTimeout(() => {
      const filtered = getFilteredProjects();
      state.visibleCount = Math.min(state.visibleCount + state.itemsPerPage, filtered.length);
      state.isLoading = false;
      renderGallery();
    }, 300);
  }

  // ============================================
  // Scroll Reveal
  // ============================================
  function setupScrollReveal() {
    if (prefersReducedMotion()) {
      $$('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    $$('.reveal').forEach(el => observer.observe(el));
  }

  // ============================================
  // 3D Tilt Effect
  // ============================================
  function setupTiltEffect() {
    $$('.project-card').forEach(card => {
      const maxTilt = 8;
      const perspective = 1000;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
        const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

        card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });
  }

  // ============================================
  // Lightbox
  // ============================================
  function openLightbox(projectId) {
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    state.selectedProject = project;
    state.currentMediaIndex = 0;

    renderLightbox();
    elements.lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus trap
    elements.lightboxClose.focus();
  }

  function closeLightbox() {
    elements.lightbox.classList.remove('open');
    document.body.style.overflow = '';
    state.selectedProject = null;
  }

  function renderLightbox() {
    const project = state.selectedProject;
    if (!project) return;

    const media = project.media[state.currentMediaIndex];
    const isVideo = media?.type === 'video';
    const totalMedia = project.media.length;

    elements.lightbox.innerHTML = `
      <div class="lightbox-backdrop" aria-hidden="true"></div>
      <button class="lightbox-close" aria-label="Close gallery">${icons.x}</button>
      <button class="lightbox-fullscreen" aria-label="Toggle fullscreen">${icons.maximize}</button>
      
      <div class="lightbox-content">
        <div class="lightbox-media">
          <div class="lightbox-loading"><div class="loading-spinner"></div></div>
          ${isVideo ? `
            <video 
              src="${media.src}" 
              poster="${media.thumbnail || ''}"
              muted 
              loop 
              playsinline
              autoplay
            ></video>
            <div class="video-controls">
              <button class="video-play-pause" aria-label="Play/Pause">${icons.pause}</button>
              <button class="video-mute" aria-label="Mute/Unmute">${icons.volumeX}</button>
            </div>
          ` : `
            <img 
              src="${media.src}" 
              alt="${media.alt}"
              onload="this.previousElementSibling.style.display='none'"
            />
          `}
        </div>

        ${totalMedia > 1 ? `
          <button class="lightbox-nav lightbox-prev" aria-label="Previous media">${icons.chevronLeft}</button>
          <button class="lightbox-nav lightbox-next" aria-label="Next media">${icons.chevronRight}</button>
        ` : ''}

        

        ${totalMedia > 1 ? `
          <div class="lightbox-thumbnails">
            ${project.media.map((m, idx) => `
              <button 
                class="lightbox-thumb ${idx === state.currentMediaIndex ? 'active' : ''}"
                data-index="${idx}"
                aria-label="Go to ${m.type === 'video' ? 'video' : 'image'} ${idx + 1}"
              >
                <img src="${m.thumbnail || m.src}" alt="" loading="lazy" />
                ${m.type === 'video' ? `<div class="thumb-video-overlay">${icons.play}</div>` : ''}
              </button>
            `).join('')}
          </div>
          <div class="lightbox-counter">${state.currentMediaIndex + 1} / ${totalMedia}</div>
        ` : ''}
      </div>
    `;

    // Re-cache and bind events
    elements.lightboxClose = $('.lightbox-close', elements.lightbox);
    elements.lightboxBackdrop = $('.lightbox-backdrop', elements.lightbox);

    elements.lightboxClose.addEventListener('click', closeLightbox);
    elements.lightboxBackdrop.addEventListener('click', closeLightbox);

    const fullscreenBtn = $('.lightbox-fullscreen', elements.lightbox);
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    const prevBtn = $('.lightbox-prev', elements.lightbox);
    const nextBtn = $('.lightbox-next', elements.lightbox);

    if (prevBtn) prevBtn.addEventListener('click', () => navigateMedia(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateMedia(1));

    $$('.lightbox-thumb', elements.lightbox).forEach(thumb => {
      thumb.addEventListener('click', () => {
        state.currentMediaIndex = parseInt(thumb.dataset.index, 10);
        renderLightbox();
      });
    });

    // Video controls
    const video = $('video', elements.lightbox);
    const playPauseBtn = $('.video-play-pause', elements.lightbox);
    const muteBtn = $('.video-mute', elements.lightbox);

    if (video && playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          playPauseBtn.innerHTML = icons.pause;
        } else {
          video.pause();
          playPauseBtn.innerHTML = icons.play;
        }
      });
    }

    if (video && muteBtn) {
      muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted ? icons.volumeX : icons.volume2;
      });
    }
  }

  function navigateMedia(direction) {
    const project = state.selectedProject;
    if (!project) return;

    const total = project.media.length;
    state.currentMediaIndex = (state.currentMediaIndex + direction + total) % total;
    renderLightbox();
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      elements.lightbox.requestFullscreen();
    }
  }

  // ============================================
  // Keyboard Navigation
  // ============================================
  function handleKeydown(e) {
    if (!elements.lightbox.classList.contains('open')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        navigateMedia(1);
        break;
      case 'ArrowLeft':
        navigateMedia(-1);
        break;
      case ' ':
        e.preventDefault();
        const video = $('video', elements.lightbox);
        if (video) {
          if (video.paused) video.play();
          else video.pause();
        }
        break;
    }
  }

  // ============================================
  // Initialization
  // ============================================
  function init() {
    // Cache DOM elements
    elements = {
      filterList: $('#filter-list'),
      filterScrollLeft: $('#filter-scroll-left'),
      filterScrollRight: $('#filter-scroll-right'),
      galleryGrid: $('#gallery-grid'),
      loadMoreContainer: $('#load-more-container'),
      loadMoreBtn: $('#load-more-btn'),
      resultsCount: $('#results-count'),
      lightbox: $('#lightbox')
    };

    // Render initial state
    renderFilterBar();
    renderGallery();

    // Event listeners
    elements.filterScrollLeft.addEventListener('click', () => scrollFilters('left'));
    elements.filterScrollRight.addEventListener('click', () => scrollFilters('right'));
    elements.filterList.addEventListener('scroll', debounce(updateScrollButtons, 100));
    elements.loadMoreBtn.addEventListener('click', loadMore);
    document.addEventListener('keydown', handleKeydown);

    // Resize handler
    window.addEventListener('resize', debounce(() => {
      updateScrollButtons();
    }, 200));

    console.log('Gallery initialized successfully');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
