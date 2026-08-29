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



//packages lnik
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const packageVal = urlParams.get('package');
    const addonsVal = urlParams.get('addons');

    //auto select service
    if (packageVal === 'solo_package_01') {
        const serviceSelect = document.getElementById('cf-service');
        if (serviceSelect) {
            serviceSelect.value = "Solo - Package 01";
        }
    }
    if (packageVal === 'solo_package_02') {
        const serviceSelect = document.getElementById('cf-service');
        if (serviceSelect) {
            serviceSelect.value = "Solo - Package 02";
        }
    }
    if (packageVal === 'ella_train_experience') {
        const serviceSelect = document.getElementById('cf-service');
        if (serviceSelect) {
            serviceSelect.value = "Ella Train Experience";
        }
    }
    if (packageVal === 'normal_package') {
        const serviceSelect = document.getElementById('cf-service');
        if (serviceSelect) {
            serviceSelect.value = "Proposal - Normal Package";
        }
    }
    if (packageVal === 'proposal-most_popular') {
        const serviceSelect = document.getElementById('cf-service');
        if (serviceSelect) {
            serviceSelect.value = "Proposal - Most Popular Package";
        }
    }
    if (packageVal === 'proposal-premium') {
        const serviceSelect = document.getElementById('cf-service');
        if (serviceSelect) {
            serviceSelect.value = "Proposal - Premium Package";
        }
    }
    if (packageVal === 'couple_photoshoot_01') {
        const serviceSelect = document.getElementById('cf-service');
        if (serviceSelect) {
            serviceSelect.value = "Couple - Package 01";
        }
    }
    if (packageVal === 'couple_photoshoot_02') {
        const serviceSelect = document.getElementById('cf-service');
        if (serviceSelect) {
            serviceSelect.value = "Couple - Package 02";
        }
    }
    if (packageVal === 'wedding_photoshoot') {
        const serviceSelect = document.getElementById('cf-service');
        if (serviceSelect) {
            serviceSelect.value = "Wedding Photography";
        }
    }
    if (packageVal === 'family_photoshoot_01') {
        const serviceSelect = document.getElementById('cf-service');
        if (serviceSelect) {
            serviceSelect.value = "Family - Package 01";
        }
    }
    if (packageVal === 'family_photoshoot_02') {
        const serviceSelect = document.getElementById('cf-service');
        if (serviceSelect) {
            serviceSelect.value = "Family - Package 02";
        }
    }


    //auto add-ons
    if (addonsVal) {
        const selectedAddons = addonsVal.split(',');

        selectedAddons.forEach(addon => {
            if (addon === 'live-saxophone') {
                const saxophoneCheckbox = document.querySelector('input[name="Optional-Addons"][value="Live Saxophone "]');
                if (saxophoneCheckbox) {
                    saxophoneCheckbox.checked = true;
                }
            }
            if (addon === 'drone-coverage') {
                const droneCoverageCheckbox = document.querySelector('input[name="Optional-Addons"][value="Drone Coverage "]');
                if (droneCoverageCheckbox) {
                    droneCoverageCheckbox.checked = true;
                }
            }
        });
    }
});