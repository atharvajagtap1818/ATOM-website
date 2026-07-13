import './cart.js';

  /* SMOOTH SCROLL — uses scrollIntoView, no href hashes, no iframe issues */
  function goTo(id) {
    var el = document.getElementById(id);
    if (!el) {
      window.location.href = '/#' + id;
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var nl = document.getElementById('navLinks');
    if (nl && nl.classList.contains('mopen')) window.closeMobileNav();
  }

  /* NAV SCROLL SHRINK */
  var nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* REVEAL ON SCROLL */
  var reveals = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
  reveals.forEach(function(el) { io.observe(el); });

  /* CATALOG FILTER */
  const subWrapper = document.getElementById('subcategoryWrapper');
  
  function applyFilters() {
    const activeParentTab = document.querySelector('.tab-btn.active');
    if (!activeParentTab) return;
    
    const parentFilter = activeParentTab.getAttribute('data-filter');
    
    if (parentFilter === 'signature') {
      const activeSubTab = document.querySelector('.sub-tab-btn.active');
      const subFilter = activeSubTab ? activeSubTab.getAttribute('data-subfilter') : 'all-sig';
      
      document.querySelectorAll('.product-card[data-cat]').forEach(function(c) {
        const cat = c.getAttribute('data-cat');
        const isSignature = (cat !== 'eco-jute' && cat !== 'eco-polymer');
        
        if (isSignature) {
          c.classList.toggle('visible', subFilter === 'all-sig' || cat === subFilter);
        } else {
          c.classList.remove('visible');
        }
      });
      
      const customCard = document.querySelector('.custom-enquiry-card');
      if (customCard) {
        customCard.style.display = (subFilter === 'custom') ? 'flex' : 'none';
      }
    } else {
      const customCard = document.querySelector('.custom-enquiry-card');
      if (customCard) {
        customCard.style.display = 'none';
      }
      
      document.querySelectorAll('.product-card[data-cat]').forEach(function(c) {
        const cat = c.getAttribute('data-cat');
        if (parentFilter === 'all') {
          c.classList.add('visible');
        } else if (parentFilter === 'eco-jute') {
          c.classList.toggle('visible', cat === 'eco-jute');
        } else if (parentFilter === 'eco-polymer') {
          c.classList.toggle('visible', cat === 'eco-polymer');
        }
      });
    }
  }

  document.querySelectorAll('.tab-btn').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      
      const parentFilter = tab.getAttribute('data-filter');
      if (parentFilter === 'signature') {
        if (subWrapper) subWrapper.classList.add('open');
        document.querySelectorAll('.sub-tab-btn').forEach(function(st) { st.classList.remove('active'); });
        const defaultSubTab = document.querySelector('.sub-tab-btn[data-subfilter="all-sig"]');
        if (defaultSubTab) defaultSubTab.classList.add('active');
      } else {
        if (subWrapper) subWrapper.classList.remove('open');
      }
      
      applyFilters();
    });
  });

  document.querySelectorAll('.sub-tab-btn').forEach(function(subTab) {
    subTab.addEventListener('click', function() {
      document.querySelectorAll('.sub-tab-btn').forEach(function(st) { st.classList.remove('active'); });
      subTab.classList.add('active');
      applyFilters();
    });
  });

  /* MOBILE NAV */
  function closeMobileNav() {
    var nl = document.getElementById('navLinks');
    if (nl) {
      nl.classList.remove('mopen');
      nl.removeAttribute('style');
    }
  }
  var navToggle = document.getElementById('navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      var nl = document.getElementById('navLinks');
      if (nl) {
        if (nl.classList.contains('mopen')) {
          closeMobileNav();
        } else {
          nl.classList.add('mopen');
          nl.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:62px;left:0;right:0;background:rgba(249,246,240,0.98);padding:24px 32px;gap:20px;z-index:199;border-bottom:1px solid rgba(44,43,40,0.1);backdrop-filter:blur(14px);';
        }
      }
    });
  }

  /* WHATSAPP FORM */
  const sendToWhatsApp = () => {
    // Your target mobile number
    const myNumber = "919021207129"; 

    // Getting values from the form fields
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const type = document.getElementById('enquiryType').value;
    const message = document.getElementById('userMessage').value;

    // Creating the encoded WhatsApp message
    const whatsappMessage = "Hello ATOM! I have an enquiry:%0A%0A" + 
      "*Name:* " + name + "%0A" +
      "*Phone:* " + phone + "%0A" +
      "*Type:* " + type + "%0A" +
      "*Details:* " + message;

    // Creating the URL
    const whatsappURL = "https://wa.me/" + myNumber + "?text=" + whatsappMessage;

    // Opening WhatsApp in a new tab
    window.open(whatsappURL, '_blank').focus();
  };

  // Attach this to your "SEND ENQUIRY" button
  const submitBtn = document.getElementById('fsubmit');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendToWhatsApp();
    });
  }

  window.goTo = goTo;
  window.closeMobileNav = closeMobileNav;

  /* DYNAMIC WHATSAPP REDIRECT FOR PRODUCTS */
  window.dynamicWhatsAppRedirect = (productName) => {
    const myNumber = "919021207129";
    const message = "Hello Atombiotic! I am interested in buying the *" + productName + "*. Please provide the basic information and details for buying.";
    const whatsappURL = `https://wa.me/${myNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank').focus();
  };
  
  /* INITIATE CUSTOM ENQUIRY AND SCROLL TO CONTACT */
  window.initiateCustomEnquiry = () => {
    const typeSelect = document.getElementById('enquiryType');
    if (typeSelect) {
      typeSelect.value = 'custom';
    }
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    const messageInput = document.getElementById('userMessage');
    if (messageInput) {
      setTimeout(() => {
        messageInput.focus();
      }, 800);
    }
  };

  /* SMOOTH HASH SCROLL ON LOAD */
  window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash) {
      const parts = hash.substring(1).split('?');
      const targetId = parts[0];
      const params = parts[1] ? new URLSearchParams(parts[1]) : null;

      if (params && params.get('enquiry') === 'custom') {
        const typeSelect = document.getElementById('enquiryType');
        if (typeSelect) {
          typeSelect.value = 'custom';
        }
      }

      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (params && params.get('enquiry') === 'custom') {
          const messageInput = document.getElementById('userMessage');
          if (messageInput) {
            setTimeout(() => {
              messageInput.focus();
            }, 800);
          }
        }
      }, 300);
    }
  });
