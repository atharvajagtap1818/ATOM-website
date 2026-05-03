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
  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* REVEAL ON SCROLL */
  var reveals = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
  reveals.forEach(function(el) { io.observe(el); });

  /* CATALOG FILTER */
  document.querySelectorAll('.tab-btn').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var f = tab.getAttribute('data-filter');
      document.querySelectorAll('.product-card[data-cat]').forEach(function(c) {
        c.classList.toggle('visible', f === 'all' || c.getAttribute('data-cat') === f);
      });
    });
  });

  /* MOBILE NAV */
  function closeMobileNav() {
    var nl = document.getElementById('navLinks');
    nl.classList.remove('mopen');
    nl.removeAttribute('style');
  }
  document.getElementById('navToggle').addEventListener('click', function() {
    var nl = document.getElementById('navLinks');
    if (nl.classList.contains('mopen')) {
      closeMobileNav();
    } else {
      nl.classList.add('mopen');
      nl.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:62px;left:0;right:0;background:rgba(237,232,223,0.98);padding:24px 32px;gap:20px;z-index:199;border-bottom:1px solid rgba(44,43,40,0.1);backdrop-filter:blur(14px);';
    }
  });

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
