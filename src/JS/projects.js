function initHeaderTransition() {
    const header = document.getElementById('header');
    const plate = header ? header.querySelector('.header-plate') : null;
    const spacer = document.getElementById('header-spacer');
    const hero = document.getElementById('projects-hero');
    const sentinel = document.getElementById('hero-sentinel');

    if (header && plate && spacer && hero && sentinel) {
        function setSpacerHeightFixed() {
            spacer.style.height = `${plate.getBoundingClientRect().height}px`;
        }
        setSpacerHeightFixed();
        window.addEventListener('resize', setSpacerHeightFixed, {passive: true});

        const io = new IntersectionObserver(([entry]) => {
            const onHero = entry.isIntersecting;
            header.classList.toggle('glass', onHero);
            header.classList.toggle('solid', !onHero);
        }, { threshold: 0.2 });

        io.observe(sentinel);
    }
}
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-navbar a');
    const body = document.body;

    if (mobileMenuBtn && mobileNavOverlay) {
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

        mobileNavOverlay.addEventListener('click', function(e) {
            if (e.target === mobileNavOverlay) {
                closeMobileMenu();
            }
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                closeMobileMenu();
                
                document.querySelectorAll('.mobile-navbar a').forEach(l => l.classList.remove('mobile-nav-link-active'));
                this.classList.add('mobile-nav-link-active');
                
                const href = this.getAttribute('href');
                const desktopLink = document.querySelector(`#navbar a[href="${href}"]`);
                if (desktopLink) {
                    document.querySelectorAll('#navbar a').forEach(l => l.classList.remove('active'));
                    desktopLink.classList.add('active');
                }
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                if (mobileNavOverlay.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });

        function syncActiveStates() {
            const activeDesktopLink = document.querySelector('#navbar a.active');
            if (activeDesktopLink) {
                const href = activeDesktopLink.getAttribute('href');
                const mobileLink = document.querySelector(`.mobile-navbar a[href="${href}"]`);
                if (mobileLink) {
                    document.querySelectorAll('.mobile-navbar a').forEach(l => l.classList.remove('mobile-nav-link-active'));
                    mobileLink.classList.add('mobile-nav-link-active');
                }
            }
        }

        syncActiveStates();

        const desktopNavLinks = document.querySelectorAll('#navbar a');
        desktopNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                const href = this.getAttribute('href');
                const mobileLink = document.querySelector(`.mobile-navbar a[href="${href}"]`);
                if (mobileLink) {
                    document.querySelectorAll('.mobile-navbar a').forEach(l => l.classList.remove('mobile-nav-link-active'));
                    mobileLink.classList.add('mobile-nav-link-active');
                }
            });
        });
    }
}

let projectsData = [];
let currentCategory = 'all';
let currentSearchTerm = '';

async function loadProjects() {
    try {
        const response = await fetch('./projects-data.json');
        projectsData = await response.json();
        
        // Update hero project count
        const statProjectsEl = document.getElementById('stat-projects');
        if (statProjectsEl) {
            statProjectsEl.textContent = projectsData.length;
        }
        
        renderProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsData = [];
        renderProjects();
    }
}

// category display name
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

// Search
function filterProjects() {
    let filtered = projectsData;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    // Filter by search 
    if (currentSearchTerm) {
        const searchLower = currentSearchTerm.toLowerCase();
        filtered = filtered.filter(project => {
            const titleMatch = project.title.toLowerCase().includes(searchLower);
            const descMatch = project.description.toLowerCase().includes(searchLower);
            const categoryMatch = getCategoryDisplayName(project.category).toLowerCase().includes(searchLower);
            const detailedDescMatch = project.detailedDescription?.toLowerCase().includes(searchLower);
            
            return titleMatch || descMatch || categoryMatch || detailedDescMatch;
        });
    }
    
    return filtered;
}

// Render Projects
function renderProjects() {
    const grid = document.getElementById('projects-grid');
    const countEl = document.getElementById('count');
    const emptyState = document.getElementById('empty-state');
    const emptyStateMessage = document.getElementById('empty-state-message');
    
    const filtered = filterProjects();

    if (countEl) {
        countEl.textContent = filtered.length;
    }
    
    // empty state
    if (filtered.length === 0) {
        if (grid) grid.style.display = 'none';
        if (emptyState) {
            emptyState.style.display = 'flex';
            
            //  empty state 
            if (emptyStateMessage) {
                if (currentSearchTerm && currentCategory !== 'all') {
                    emptyStateMessage.textContent = `No projects found matching "${currentSearchTerm}" in ${getCategoryDisplayName(currentCategory)}`;
                } else if (currentSearchTerm) {
                    emptyStateMessage.textContent = `No projects found matching "${currentSearchTerm}"`;
                } else if (currentCategory !== 'all') {
                    emptyStateMessage.textContent = `No projects found in ${getCategoryDisplayName(currentCategory)} category`;
                } else {
                    emptyStateMessage.textContent = 'Try adjusting your search or filter criteria';
                }
            }
        }
        return;
    } else {
        if (grid) grid.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';
    }
    
    // Render cards
    if (grid) {
        grid.innerHTML = filtered.map((project, index) => `
            <article class="project-card" style="animation-delay: ${(index % 3) * 0.1}s" data-project-id="${project.id}">
                <div class="project-image-wrapper">
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                    <div class="project-category-badge">${getCategoryDisplayName(project.category)}</div>
                    <div class="project-hover-overlay">
                        <div class="view-details">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                            </svg>
                            <span>View Details</span>
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
                    openProjectModal(projectId, projectsData);
                }
            });
        });

        document.querySelectorAll('.read-more-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const projectId = link.dataset.projectId;
                
                if (typeof openProjectModal === 'function') {
                    openProjectModal(projectId, projectsData);
                }
            });
        });
    }
}

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearchTerm = this.value.trim();
            renderProjects();
            
        
            if (clearBtn) {
                clearBtn.style.display = currentSearchTerm ? 'flex' : 'none';
            }
        }, 300); 
    });
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            currentSearchTerm = '';
            this.style.display = 'none';
            renderProjects();
            searchInput.focus();
        });
    }
}

// Filter 
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentCategory = btn.dataset.category;
            renderProjects();
        });
    });
}

// Hero Parallax
function initHeroParallax() {
    const hero = document.querySelector('[data-parallax-hero]');
    if (!hero) return;
    
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroY = scrolled * 0.3;
                const heroOpacity = Math.max(0.3, 1 - scrolled / 500);
                
                hero.style.transform = `translateY(${heroY}px)`;
                hero.style.opacity = heroOpacity;
                
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

document.addEventListener('DOMContentLoaded', () => {
    initHeaderTransition();
    initMobileMenu();
    loadProjects();
    initSearch();
    initFilters();
    initHeroParallax();
    
    if (typeof initProjectModal === 'function') {
        initProjectModal();
    }
});