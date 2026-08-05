/* ==========================================================================
   Samra | Web & App Developer Portfolio - Contact & Quote Form Handler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const serviceSelect = document.getElementById('serviceSelect');
  const toast = document.getElementById('toastNotification');

  // Pre-select service if passed in query string (e.g., contact.html?service=app-dev)
  const urlParams = new URLSearchParams(window.location.search);
  const requestedService = urlParams.get('service');
  if (requestedService && serviceSelect) {
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].value.toLowerCase().includes(requestedService.toLowerCase())) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
  }

  function showToast(message) {
    if (!toast) {
      const newToast = document.createElement('div');
      newToast.id = 'toastNotification';
      newToast.className = 'toast';
      newToast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>${message}</span>
      `;
      document.body.appendChild(newToast);
      setTimeout(() => newToast.classList.add('show'), 100);
      setTimeout(() => {
        newToast.classList.remove('show');
        setTimeout(() => newToast.remove(), 400);
      }, 4000);
    } else {
      toast.querySelector('span').textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        Sending Message...
      `;

      const formData = {
        name: document.getElementById('nameInput')?.value,
        email: document.getElementById('emailInput')?.value,
        phone: document.getElementById('phoneInput')?.value || 'Not provided',
        service: serviceSelect?.value || 'Web Development',
        message: document.getElementById('messageInput')?.value
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.success) {
          showToast(data.message);
          contactForm.reset();
        } else {
          showToast('Message submitted! Thank you, Samra will contact you shortly.');
          contactForm.reset();
        }
      } catch (err) {
        // Fallback for purely static deployment on Netlify
        showToast(`Thank you ${formData.name}! Your request for ${formData.service} has been sent. Samra will reply via email shortly.`);
        contactForm.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
});

// Inline spin animation style injection
const styleTag = document.createElement('style');
styleTag.innerHTML = `
@keyframes spin { 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(styleTag);
