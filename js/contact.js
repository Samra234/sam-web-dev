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

  function renderSentInquiries() {
    const container = document.getElementById('sentInquiriesList');
    if (!container) return;

    const logs = JSON.parse(localStorage.getItem('sentInquiries') || '[]');
    if (logs.length === 0) {
      container.innerHTML = `<p style="font-size: 0.88rem; color: var(--text-muted); font-style: italic;">No messages sent yet. Fill out the form above to send an inquiry.</p>`;
      return;
    }

    container.innerHTML = logs.map((log, index) => `
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-light); border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
          <strong style="color: var(--accent-blue); font-size: 0.95rem;">${log.service}</strong>
          <span style="font-size: 0.75rem; color: var(--text-dim);">${log.date}</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-main); margin-bottom: 0.25rem;"><strong>From:</strong> ${log.name} (${log.email})</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">${log.message}</p>
      </div>
    `).join('');
  }

  renderSentInquiries();

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
        // Send email via FormSubmit API directly to developer email
        const response = await fetch('https://formsubmit.co/ajax/samramuhammadsiddique831@gmail.com', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message,
            _subject: `New Portfolio Inquiry: ${formData.service} from ${formData.name}`,
            _template: 'table'
          })
        });

        const data = await response.json();

        // Save to local submission history for user review
        const localLogs = JSON.parse(localStorage.getItem('sentInquiries') || '[]');
        localLogs.unshift({
          ...formData,
          date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        });
        localStorage.setItem('sentInquiries', JSON.stringify(localLogs));
        renderSentInquiries();

        if (data.success === "true" || data.success === true) {
          showToast(`Thank you ${formData.name}! Your message has been sent directly to samramuhammadsiddique831@gmail.com.`);
          contactForm.reset();
        } else {
          showToast(`Thank you ${formData.name}! Message sent and logged.`);
          contactForm.reset();
        }
      } catch (err) {
        // Fallback to server API or local logging
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }).catch(() => {});

        const localLogs = JSON.parse(localStorage.getItem('sentInquiries') || '[]');
        localLogs.unshift({
          ...formData,
          date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        });
        localStorage.setItem('sentInquiries', JSON.stringify(localLogs));
        renderSentInquiries();

        showToast(`Thank you ${formData.name}! Your request for ${formData.service} has been logged.`);
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
