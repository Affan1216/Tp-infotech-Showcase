const COLLABORATE_FORM_URL = "https://forms.office.com/r/6XTScuEiKt";

function getCategoryDisplayName(category) {
    const names = {
        'ai-related': 'AI-RELATED',
        'cybersecurity': 'CYBERSECURITY',
        'it-general': 'IT GENERAL'
    };
    return names[category] || category.toUpperCase();
}

function openProjectModal(projectId, projectsData){
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('project-modal');
    if (!modal) return;

    document.getElementById('modal-hero-img').src = project.image;
    document.getElementById('modal-hero-img').alt = project.title;
    document.getElementById('modal-category').textContent = getCategoryDisplayName(project.category);
    document.getElementById('modal-title').textContent = project.title;


    const objectiveSection = document.getElementById('objective-section');
    if (project.objective){
        document.getElementById('modal-objective').textContent = project.objective;
        objectiveSection.style.display = 'block';
    } else {
        objectiveSection.style.display = 'none';
    }

    const descSection = document.getElementById('description-section');
    if (project.detailedDescription) {
        document.getElementById('modal-description').textContent = project.detailedDescription;
        descSection.style.display = 'block';
    } else {
        descSection.style.display = 'none';
    }

    const featuresSection = document.getElementById('features-section');
    if (project.keyFeatures && project.keyFeatures.length > 0) {
        const featuresList = document.getElementById('modal-features');
        featuresList.innerHTML = project.keyFeatures.map(feature => `
            <li>
                <div class="modal-list-bullet"></div>
                <span class="modal-text">${feature}</span>
            </li>
        `).join('');
        featuresSection.style.display = 'block';
    } else {
        featuresSection.style.display = 'none';
    }

    const techSection = document.getElementById('technologies-section');
    if (project.technologies && project.technologies.length > 0) {
        const techContainer = document.getElementById('modal-technologies');
        techContainer.innerHTML = project.technologies.map(tech => `
            <span class="modal-tag">${tech}</span>
        `).join('');
        techSection.style.display = 'block';
    } else {
        techSection.style.display = 'none';
    }

    const teamSection = document.getElementById('team-section');
    if (project.teamMembers && project.teamMembers.length > 0) {
        const teamContainer = document.getElementById('modal-team');
        teamContainer.innerHTML = project.teamMembers.map(member => {
            const initials = member.split(' ').map(n => n[0]).join('');
            return `
                <div class="modal-team-member">
                    <div class="modal-team-avatar">${initials}</div>
                    <span class="modal-team-name">${member}</span>
                </div>
            `;
        }).join('');
        teamSection.style.display = 'block';
    } else {
        teamSection.style.display = 'none';
    }

    const gallerySection = document.getElementById('gallery-section');
    if (project.additionalImages && project.additionalImages.length > 0) {
        const galleryContainer = document.getElementById('modal-gallery');
        galleryContainer.innerHTML = project.additionalImages.map((img, index) => `
            <div class="modal-gallery-item">
                <img src="${img}" alt="${project.title} - Image ${index + 1}">
            </div>
        `).join('');
        gallerySection.style.display = 'block';
    } else {
        gallerySection.style.display = 'none';
    }
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    const modalScroll = modal.querySelector('.modal-scroll');
    if (modalScroll) {
        modalScroll.scrollTop = 0;
    }
}

function closeProjectModal(){
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    modal.classList.remove('show');

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function initProjectModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const closeBtn = document.querySelector('.modal-close-btn');
    const backBtn = document.getElementById('modal-back-btn');
    const collaborateBtn = document.getElementById('modal-collaborate-btn');
    const overlay = document.querySelector('.modal-overlay');

    if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
    if (backBtn) backBtn.addEventListener('click', closeProjectModal);

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeProjectModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeProjectModal();
        }
    });

    if (collaborateBtn) {
        collaborateBtn.addEventListener('click', () => {
            window.open(COLLABORATE_FORM_URL, '_blank');
        });
    }
}