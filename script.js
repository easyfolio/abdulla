document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // --- Theme Logic ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateThemeToggleIcon(savedTheme);
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('theme-dark');
            localStorage.setItem('theme', 'theme-dark');
            updateThemeToggleIcon('theme-dark');
        } else {
            body.classList.add('theme-light');
            localStorage.setItem('theme', 'theme-light');
            updateThemeToggleIcon('theme-light');
        }
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('theme-dark')) {
            body.classList.remove('theme-dark');
            body.classList.add('theme-light');
            localStorage.setItem('theme', 'theme-light');
            updateThemeToggleIcon('theme-light');
        } else {
            body.classList.remove('theme-light');
            body.classList.add('theme-dark');
            localStorage.setItem('theme', 'theme-dark');
            updateThemeToggleIcon('theme-dark');
        }
    });

    function updateThemeToggleIcon(currentTheme) {
        const icon = themeToggle.querySelector('i');
        if (currentTheme === 'theme-dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }


    // --- Fetch Content from content.json ---
    fetch('content.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - Could not load content.json. Please check file path and content.`);
            }
            return response.json();
        })
        .then(data => {
            // --- Global Data ---
            document.getElementById('logo-text').textContent = data.profile.logo_text; // Load logo text
            document.getElementById('footer-name').textContent = data.profile.name;
            document.getElementById('current-year').textContent = new Date().getFullYear();

            // --- Hero Section ---
            document.getElementById('hero-name').innerHTML = `<span>${data.profile.first_name}</span> ${data.profile.last_name}`;
            document.getElementById('hero-title').textContent = data.profile.title;
            document.getElementById('hero-bio').textContent = data.profile.bio;
            document.getElementById('profile-pic').src = data.profile.profile_picture;
            document.getElementById('profile-pic').alt = `Profile Picture of ${data.profile.name}`;

            const heroSocialLinksDiv = document.getElementById('hero-social-links');
            heroSocialLinksDiv.innerHTML = ''; 
            // Filter social links to only include desired platforms (LinkedIn, Twitter, Instagram)
            const filteredHeroSocialLinks = data.social_links.filter(link => 
                link.platform === 'LinkedIn' || link.platform === 'Twitter' || link.platform === 'Instagram'
            );
            filteredHeroSocialLinks.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.target = "_blank";
                a.setAttribute('aria-label', link.platform);
                a.innerHTML = `<i class="${link.icon}"></i>`;
                heroSocialLinksDiv.appendChild(a);
            });

            // --- About Section ---
            document.getElementById('about-image-src').src = data.about.about_image;
            document.getElementById('about-image-src').alt = `About ${data.profile.name}`;
            document.getElementById('about-description-paragraph1').textContent = data.about.description_p1;
            document.getElementById('about-description-paragraph2').textContent = data.about.description_p2;

            const educationList = document.getElementById('education-list');
            educationList.innerHTML = '';
            data.about.education.forEach(edu => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${edu.degree}</strong>, ${edu.institution} (${edu.years})`;
                educationList.appendChild(li);
            });

            const experienceList = document.getElementById('experience-list');
            experienceList.innerHTML = '';
            data.about.experience.forEach(exp => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${exp.position}</strong> at ${exp.company} (${exp.years})`;
                experienceList.appendChild(li);
            });

            // --- Skills Section ---
            const skillsGrid = document.getElementById('skills-grid');
            skillsGrid.innerHTML = '';
            data.skills.forEach(skill => {
                const skillCard = document.createElement('div');
                skillCard.classList.add('skill-card');
                // Removed icon tag for skills
                skillCard.innerHTML = `<h4>${skill.name}</h4>`; 
                skillsGrid.appendChild(skillCard);
            });

            // --- Projects Section ---
            const projectsGrid = document.getElementById('projects-grid');
            projectsGrid.innerHTML = '';
            data.projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');
                projectCard.innerHTML = `
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-content">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <a href="${project.link}" target="_blank" class="btn btn-secondary">View Project</a>
                    </div>
                `;
                projectsGrid.appendChild(projectCard);
            });

            // --- Contact Section ---
            document.getElementById('contact-email').textContent = data.contact.email;
            document.getElementById('contact-phone').textContent = data.contact.phone;
            document.getElementById('contact-location').textContent = data.contact.location;

            const contactSocialLinksDiv = document.getElementById('social-links-contact');
            contactSocialLinksDiv.innerHTML = ''; 
            // Filter social links for contact section as well (LinkedIn, Twitter, Instagram)
            const filteredContactSocialLinks = data.social_links.filter(link => 
                link.platform === 'LinkedIn' || link.platform === 'Twitter' || link.platform === 'Instagram'
            );
            filteredContactSocialLinks.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.target = "_blank";
                a.setAttribute('aria-label', link.platform);
                a.innerHTML = `<i class="${link.icon}"></i>`;
                contactSocialLinksDiv.appendChild(a);
            });

            // Removed ScrollReveal initialization code

        })
        .catch(error => {
            console.error('Error fetching or processing content.json:', error);
            document.body.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #cc0000; font-family: sans-serif; background-color: #fce8e6; border: 1px solid #f5c6cb; border-radius: 8px; margin: 20px;">
                    <h1 style="font-size: 2em; margin-bottom: 20px;">Error Loading Portfolio</h1>
                    <p style="font-size: 1.1em; line-height: 1.5;">Failed to load essential content. This usually happens if 'content.json' is missing, has errors, or cannot be accessed due to browser security policies.</p>
                    <p style="font-size: 0.9em; margin-top: 15px;">**Details:** ${error.message}</p>
                    <p style="font-size: 1em; margin-top: 20px; font-weight: bold;">**Solusi:** Pastikan Anda membuka proyek ini menggunakan server pengembangan lokal (misalnya, ekstensi "Live Server" di VS Code, atau \`python -m http.server\` dari terminal).</p>
                    <p style="font-size: 0.9em; margin-top: 10px;">Juga, periksa tab "Console" dan "Network" di Developer Tools browser Anda untuk detail error lebih lanjut.</p>
                </div>
            `;
        });

    // --- Smooth Scrolling for internal links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});