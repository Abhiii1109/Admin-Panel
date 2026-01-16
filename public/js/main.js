/**
 * Admin Panel - Client-side JavaScript
 * Handles dynamic interactions and UI enhancements
 */

// Auto-dismiss flash messages
document.addEventListener('DOMContentLoaded', () => {
  // Flash messages auto-dismiss
  const flashMessages = document.querySelectorAll('.flash-messages');
  if (flashMessages.length > 0) {
    setTimeout(() => {
      flashMessages.forEach(msg => {
        msg.style.transition = 'opacity 0.3s ease';
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 300);
      });
    }, 5000);
  }

  // Mobile sidebar toggle (for future enhancement)
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  // Confirm delete actions
  const deleteForms = document.querySelectorAll('form[action*="delete"]');
  deleteForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!confirm('Are you sure you want to delete this item?')) {
        e.preventDefault();
      }
    });
  });

  // Password strength indicator (optional enhancement)
  const passwordInputs = document.querySelectorAll('input[type="password"][name="newPassword"], input[type="password"][name="password"]');
  passwordInputs.forEach(input => {
    input.addEventListener('input', () => {
      const password = input.value;
      const strength = calculatePasswordStrength(password);
      // You can add visual feedback here
    });
  });
});

/**
 * Calculate password strength
 * @param {string} password
 * @returns {number} strength score (0-4)
 */
function calculatePasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]+/)) strength++;
  if (password.match(/[A-Z]+/)) strength++;
  if (password.match(/[0-9]+/)) strength++;
  if (password.match(/[$@#&!]+/)) strength++;
  
  return strength;
}

/**
 * Format date to local string
 * @param {string} dateString
 * @returns {string}
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Show loading state on form submit
 */
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
      }
    });
  });
});
