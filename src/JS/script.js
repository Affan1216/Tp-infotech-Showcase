function initModernHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  // Background images for heor
  const BACKGROUND_IMAGES = [
      'src/Images/Home.jpg',
      'src/Images/Home2.jpg',
      'src/Images/Home3.jpg'
  ];

  let currentImageIndex = 0;
  let isPaused = false;
  let slideInterval;

  // Create slideshow 
  const bgWrap = document.createElement('div');
  bgWrap.className = 'hero-bg';

  // slide elements for crossfade
  const slideA = document.createElement('img');
  const slideB = document.createElement('img');
  slideA.className = 'hero-slide show';
  slideB.className = 'hero-slide';
  slideA.src = BACKGROUND_IMAGES[0];
  slideA.alt = 'Technology workspace';

  bgWrap.appendChild(slideA);
  bgWrap.appendChild(slideB);

  // overlays
  const gradientOverlay = document.createElement('div');
  gradientOverlay.className = 'hero-gradient-overlay';

  const animatedGradient = document.createElement('div');
  animatedGradient.className = 'hero-animated-gradient';

  const gridPattern = document.createElement('div');
  gridPattern.className = 'hero-grid-pattern';

  bgWrap.appendChild(gradientOverlay);
  bgWrap.appendChild(animatedGradient);
  bgWrap.appendChild(gridPattern);

  hero.prepend(bgWrap);

  BACKGROUND_IMAGES.forEach(src => {
      const img = new Image();
      img.src = src;
  });

  let visibleSlide = slideA;
  let hiddenSlide = slideB;

  function changeSlide() {
      if (isPaused) return;

      currentImageIndex = (currentImageIndex + 1) % BACKGROUND_IMAGES.length;
      
   
      hiddenSlide.src = BACKGROUND_IMAGES[currentImageIndex];
      hiddenSlide.classList.add('show');
      visibleSlide.classList.remove('show');
      
      [visibleSlide, hiddenSlide] = [hiddenSlide, visibleSlide];
  }

  // Start slideshow
  function startSlideshow() {
      slideInterval = setInterval(changeSlide, 5000); // 5 seconds
  }

  // Stop slideshow
  function stopSlideshow() {
      clearInterval(slideInterval);
  }

  const pauseBtn = document.createElement('button');
  pauseBtn.className = 'hero-pause-btn';
  pauseBtn.setAttribute('aria-label', 'Pause slideshow');
  
  const pauseIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
  const playIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
  
  pauseBtn.innerHTML = pauseIcon;
  
  pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      pauseBtn.innerHTML = isPaused ? playIcon : pauseIcon;
      pauseBtn.setAttribute('aria-label', isPaused ? 'Play slideshow' : 'Pause slideshow');
      
      if (isPaused) {
          stopSlideshow();
      } else {
          startSlideshow();
      }
  });
  
  hero.appendChild(pauseBtn);

  startSlideshow();

  // Parallax effect
  const contentWrapper = hero.querySelector('.hero-content-wrapper');
  
  function handleParallaxScroll() {
      const scrolled = window.pageYOffset;
      const heroRect = hero.getBoundingClientRect();
      const heroHeight = hero.offsetHeight;
      

      const opacity = Math.max(0, Math.min(1, 1 - (scrolled / 300)));
      
      if (bgWrap) {
          const bgY = scrolled * 0.3;
          bgWrap.style.transform = `translateY(${bgY}px)`;
      }
     
      if (contentWrapper) {
          const contentY = scrolled * 0.2;
          contentWrapper.style.transform = `translateY(${contentY}px)`;
          contentWrapper.style.opacity = opacity;
      }
      
      if (pauseBtn) {
          pauseBtn.style.opacity = opacity;
      }
  }
  
  window.addEventListener('scroll', handleParallaxScroll, { passive: true });
  handleParallaxScroll(); 
}


function initHeaderTransition() {
  const header = document.getElementById('header');
  const plate = header ? header.querySelector('.header-plate') : null;
  const spacer = document.getElementById('header-spacer');
  const sentinel = document.getElementById('hero-sentinel');

  if (!header || !plate || !spacer || !sentinel) return;

  function setSpacerHeight() {
      spacer.style.height = `${plate.getBoundingClientRect().height}px`;
  }
  setSpacerHeight();
  window.addEventListener('resize', setSpacerHeight, { passive: true });

  const io = new IntersectionObserver(([entry]) => {
      const onHero = entry.isIntersecting;
      header.classList.toggle('glass', onHero);
      header.classList.toggle('solid', !onHero);
  }, { threshold: 0.2 });

  io.observe(sentinel);
}


function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-navbar a');
  const body = document.body;

  if (!mobileMenuBtn || !mobileNavOverlay) return;

  function toggleMobileMenu() {
      const isActive = mobileMenuBtn.classList.contains('active');
      
      if (isActive) {
          closeMobileMenu();
      } else {
          openMobileMenu();
      }
  }

  function openMobileMenu() {
      if (window.innerWidth <= 768) {
          mobileMenuBtn.classList.add('active');
          mobileNavOverlay.classList.add('active');
          body.style.overflow = 'hidden';
      }
  }

  function closeMobileMenu() {
      mobileMenuBtn.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      body.style.overflow = '';
  }

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  mobileNavOverlay.addEventListener('click', (e) => {
      if (e.target === mobileNavOverlay) {
          closeMobileMenu();
      }
  });

  mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
          closeMobileMenu();
          
          document.querySelectorAll('.mobile-navbar a').forEach(l => 
              l.classList.remove('mobile-nav-link-active')
          );
          link.classList.add('mobile-nav-link-active');
          
          const href = link.getAttribute('href');
          const desktopLink = document.querySelector(`#navbar a[href="${href}"]`);
          if (desktopLink) {
              document.querySelectorAll('#navbar a').forEach(l => l.classList.remove('active'));
              desktopLink.classList.add('active');
          }
      });
  });

  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
          closeMobileMenu();
      }
  });

  window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileNavOverlay.classList.contains('active')) {
          closeMobileMenu();
      }
  });

  // Sync active states
  function syncActiveStates() {
      const activeDesktopLink = document.querySelector('#navbar a.active');
      if (activeDesktopLink) {
          const href = activeDesktopLink.getAttribute('href');
          const mobileLink = document.querySelector(`.mobile-navbar a[href="${href}"]`);
          if (mobileLink) {
              document.querySelectorAll('.mobile-navbar a').forEach(l => 
                  l.classList.remove('mobile-nav-link-active')
              );
              mobileLink.classList.add('mobile-nav-link-active');
          }
      }
  }

  syncActiveStates();

  const desktopNavLinks = document.querySelectorAll('#navbar a');
  desktopNavLinks.forEach(link => {
      link.addEventListener('click', () => {
          const href = link.getAttribute('href');
          const mobileLink = document.querySelector(`.mobile-navbar a[href="${href}"]`);
          if (mobileLink) {
              document.querySelectorAll('.mobile-navbar a').forEach(l => 
                  l.classList.remove('mobile-nav-link-active')
              );
              mobileLink.classList.add('mobile-nav-link-active');
          }
      });
  });
}

let featuredProjectsData = [];

if (typeof getCategoryDisplayName === 'undefined') {
  function getCategoryDisplayName(category) {
      const names = {
          'ai-related': 'AI-RELATED',
          'cybersecurity': 'CYBERSECURITY',
          'it-general': 'IT GENERAL'
      };
      return names[category] || category.toUpperCase();
  }
}

async function loadFeaturedProjects() {
  try {
      const response = await fetch('./projects-data.json');
      const projects = await response.json();

      const sortedProjects = projects
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);

      featuredProjectsData = sortedProjects;

      renderFeaturedProjects(sortedProjects);
  } catch (error) {
      console.error('Error Loading Featured Projects:', error);
  }
}

function renderFeaturedProjects(projects) {
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) return;

  projectsGrid.innerHTML = projects.map((project, index) => `
      <article class="project-card" data-parallax data-index="${index}" data-project-id="${project.id}">
          <div class="project-image-wrapper">
              <img src="${project.image}" alt="${project.title}" class="project-image">
              <div class="project-category-badge">${getCategoryDisplayName(project.category)}</div>
              <div class="project-hover-overlay">
                  <div class="view-details">
                      <span>View Details</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                  </div>
              </div>
          </div>
          <div class="project-content">
              <h3 class="project-title">${project.title}</h3>
              <p class="project-description">${project.description}</p>
              <a href="#" class="read-more-link" data-project-id="${project.id}">
                  <span>Read More</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
              </a>
          </div>
      </article>
  `).join('');

  document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
          if (e.target.closest('.read-more-link')) return;
          const projectId = card.dataset.projectId;
          
          if (typeof openProjectModal === 'function') {
              openProjectModal(projectId, featuredProjectsData);
          }
      });
  });

  document.querySelectorAll('.read-more-link').forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const projectId = link.dataset.projectId;
          
          // Check if openProjectModal exists
          if (typeof openProjectModal === 'function') {
              openProjectModal(projectId, featuredProjectsData);
          }
      });
  });
}
function initMapParallax() {
  const section = document.getElementById('getting-to-tp');
  if (!section) return;

  const mapEl = section.querySelector('[data-parallax-map]');
  const infoEl = section.querySelector('[data-parallax-info]');
  if (!mapEl || !infoEl) return;

  function onScroll() {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const progress = Math.max(0, Math.min(1,
          (viewportHeight - rect.top) / (viewportHeight + rect.height)
      ));

      const mapX = -100 + (progress * 150);
      const mapOpacity = Math.min(1, progress * 2);

      const infoX = 100 - (progress * 150);
      const infoOpacity = Math.min(1, progress * 2);

      mapEl.style.transform = `translateX(${mapX}px)`;
      mapEl.style.opacity = mapOpacity;

      infoEl.style.transform = `translateX(${infoX}px)`;
      infoEl.style.opacity = infoOpacity;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


function initializePage() {
  initModernHero();
  initHeaderTransition();
  initMobileMenu();
  loadFeaturedProjects();
  initMapParallax();
  
  if (typeof initProjectModal === 'function') {
      initProjectModal();
  }
}

document.addEventListener('DOMContentLoaded', initializePage);