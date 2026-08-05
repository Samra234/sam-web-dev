/* ==========================================================================
   Samra | Web & App Developer Portfolio - Main Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for Fade-In Reveal Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-fade').forEach(el => {
    revealObserver.observe(el);
  });

  // Project Category Filter Handler
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-secondary'));
      btn.classList.classList?.remove('btn-secondary');
      btn.classList.add('active', 'btn-primary');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category?.includes(filterValue)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Project Preview Modal Lightbox
  const modal = document.getElementById('projectModal');
  const modalClose = document.querySelector('.modal-close');
  const modalBody = document.getElementById('modalBody');

  document.querySelectorAll('.preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || 'Project Preview';
      const desc = btn.getAttribute('data-desc') || 'Project details and features.';
      const tech = btn.getAttribute('data-tech') || 'HTML • CSS • JS';
      const link = btn.getAttribute('data-link') || '#';

      if (modalBody && modal) {
        modalBody.innerHTML = `
          <div style="text-align: left;">
            <span class="section-eyebrow"><span class="dot"></span> Live Demo Preview</span>
            <h2 style="margin: 0.5rem 0 1rem 0;">${title}</h2>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
              ${tech.split('•').map(t => `<span class="tech-tag">${t.trim()}</span>`).join('')}
            </div>
            <div style="background:var(--bg-main); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.5rem; margin-bottom:1.5rem; min-height: 200px;">
              <p style="margin-bottom:1rem;">${desc}</p>
              <div style="background:#000; border-radius:8px; padding:1.5rem; font-family:var(--font-mono); font-size:0.85rem; color:#10B981;">
                &gt; Status: Deployed & Active<br/>
                &gt; Platform: Netlify / Play Store Ready<br/>
                &gt; Speed Score: 99/100 Mobile & Desktop
              </div>
            </div>
            <div style="display:flex; gap:1rem; justify-content:flex-end;">
              <button class="btn btn-secondary modal-close-btn">Close</button>
              <a href="${link}" class="btn btn-primary">View Full Case Study →</a>
            </div>
          </div>
        `;
        modal.classList.add('active');

        document.querySelector('.modal-close-btn')?.addEventListener('click', () => {
          modal.classList.remove('active');
        });
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Interactive Code Terminal Typing Accent
  const codeTerminal = document.getElementById('typewriterCode');
  if (codeTerminal) {
    const codeSnippet = `const developer = {
  name: "Samra",
  title: "Web & Mobile App Developer",
  skills: ["HTML5", "CSS3", "JavaScript", "React", "Kotlin", "Firebase"],
  deliverables: "High performance, client-focused business solutions",
  status: "Available for new projects"
};`;
    let idx = 0;
    function typeCode() {
      if (idx < codeSnippet.length) {
        codeTerminal.textContent += codeSnippet.charAt(idx);
        idx++;
        setTimeout(typeCode, 15);
      }
    }
    typeCode();
  }
});
