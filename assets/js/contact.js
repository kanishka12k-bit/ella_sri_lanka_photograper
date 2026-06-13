const contactForm = document.getElementById('contact-form');

  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();

          const submitBtn = this.querySelector('.btn-contact-submit');
          if (submitBtn) submitBtn.disabled = true;

          fetch('https://api.web3forms.com/submit', {
              method: 'POST',
              body: new FormData(this)
          })
          .then(response => response.json())
          .then(data => {
              if(data.success) {
                 
                  contactForm.style.display = 'none';
                  const success = document.getElementById('form-success');
                  if (success) {
                      success.style.display = 'block';
                      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
              } else {
                  alert('Something went wrong. Please try again: ' + data.message);
                  if (submitBtn) submitBtn.disabled = false;
              }
          })
          .catch(error => {
              console.error('Error:', error);
              alert('An error occurred. Please check your connection.');
              if (submitBtn) submitBtn.disabled = false;
          });
      });
  }