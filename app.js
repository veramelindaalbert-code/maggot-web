// JavaScript Controller for Rumah Hijau Lestari

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all interactive components
  initSPARouter();
  initSubTabs();
  initTestimonialSlider();
  initFAQAccordion();
  initContactForm();
  initMobileMenu();
});

/* ========================================================
   SPA ROUTER (Page Transitions)
   ======================================================== */
function initSPARouter() {
  const navLinks = document.querySelectorAll(".nav-link");
  
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-target");
      switchPage(targetId);
      
      // Update hash in URL
      window.location.hash = targetId;

      // Close mobile menu if open
      const menu = document.getElementById("nav-links");
      if (menu.classList.contains("open")) {
        menu.classList.remove("open");
      }
    });
  });

  // Handle back/forward buttons and initial hash loading
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      switchPage(hash);
    }
  });

  // Apply initial hash if exists
  const initialHash = window.location.hash.substring(1);
  if (initialHash) {
    switchPage(initialHash);
  }
}

// Global page switching function
function switchPage(targetId) {
  const sections = document.querySelectorAll(".page-section");
  const navLinks = document.querySelectorAll(".nav-link");
  const targetSection = document.getElementById(targetId);

  if (!targetSection) return;

  // Deactivate all sections
  sections.forEach(section => {
    section.classList.remove("active");
  });

  // Deactivate all nav links
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("data-target") === targetId) {
      link.classList.add("active");
    }
  });

  // Activate target section with a small delay for smooth opacity transition
  targetSection.classList.add("active");
  
  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Attach switchPage to window object so inline HTML onclick handlers can access it
window.switchPage = switchPage;

/* ========================================================
   SUB-TABS SWITCHER (Budidaya & Manfaat Page)
   ======================================================== */
function initSubTabs() {
  const subTabs = document.querySelectorAll(".sub-tab");
  const tabPanes = document.querySelectorAll(".tab-pane");

  subTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetPaneId = tab.getAttribute("data-tab");

      // Deactivate all sub-tabs
      subTabs.forEach(t => t.classList.remove("active"));
      // Hide all panels
      tabPanes.forEach(pane => pane.classList.remove("active"));

      // Activate current sub-tab and panel
      tab.classList.add("active");
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) {
        targetPane.classList.add("active");
      }
    });
  });
}

/* ========================================================
   TESTIMONIAL / REVIEW SLIDER
   ======================================================== */
function initTestimonialSlider() {
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("prev-review-btn");
  const nextBtn = document.getElementById("next-review-btn");
  
  if (slides.length === 0) return;

  let currentSlide = 0;
  let autoPlayInterval;

  function showSlide(index) {
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    // Reset slides
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    // Activate active slide and dot
    slides[currentSlide].classList.add("active");
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add("active");
    }
  }

  // Event Listeners for controls
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      showSlide(currentSlide - 1);
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      showSlide(currentSlide + 1);
      resetAutoPlay();
    });
  }

  // Dots click events
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const slideIndex = parseInt(dot.getAttribute("data-slide"));
      showSlide(slideIndex);
      resetAutoPlay();
    });
  });

  // Auto-play feature
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000); // changes slides every 6 seconds
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  startAutoPlay();
}

/* ========================================================
   FAQ ACCORDION
   ======================================================== */
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach(question => {
    question.addEventListener("click", () => {
      const item = question.parentElement;
      const isActive = item.classList.contains("active");

      // Collapsing other open FAQ items (optional, makes it cleaner)
      const allItems = document.querySelectorAll(".faq-item");
      allItems.forEach(i => i.classList.remove("active"));

      // Expand clicked item if it was closed
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

/* ========================================================
   CONTACT FORM VALIDATION & SUCCESS TOAST
   ======================================================== */
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const toast = document.getElementById("toast");

  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("form-name");
    const emailInput = document.getElementById("form-email");
    const msgInput = document.getElementById("form-message");

    // Basic Input Validations
    let isValid = true;
    
    // Validate Name
    if (nameInput.value.trim() === "") {
      showFieldError(nameInput, "Nama lengkap harus diisi");
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // Validate Email
    if (emailInput.value.trim() === "") {
      showFieldError(emailInput, "Alamat email harus diisi");
      isValid = false;
    } else if (!validateEmailPattern(emailInput.value.trim())) {
      showFieldError(emailInput, "Masukkan format email yang valid");
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // Validate Message
    if (msgInput.value.trim() === "") {
      showFieldError(msgInput, "Pesan tidak boleh kosong");
      isValid = false;
    } else {
      clearFieldError(msgInput);
    }

    if (isValid) {
      // Simulate form submission success
      showToast();
      contactForm.reset();
    }
  });

  // Helper validation functions
  function validateEmailPattern(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showFieldError(inputElement, errorMessage) {
    inputElement.style.borderColor = "var(--danger)";
    inputElement.style.boxShadow = "0 0 0 4px rgba(217, 4, 41, 0.15)";
    
    // Add real-time user assistance placeholder or borders
    inputElement.placeholder = errorMessage;
  }

  function clearFieldError(inputElement) {
    inputElement.style.borderColor = "var(--border-light)";
    inputElement.style.boxShadow = "none";
  }

  function showToast() {
    if (!toast) return;
    toast.classList.add("show");

    // Hide toast after 4 seconds
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }
}

/* ========================================================
   MOBILE NAVBAR BURGER DRAWER
   ======================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navLinks = document.getElementById("nav-links");

  if (!hamburgerBtn || !navLinks) return;

  hamburgerBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    
    // Toggle hamburger icon appearance
    const icon = hamburgerBtn.querySelector("i");
    if (navLinks.classList.contains("open")) {
      icon.className = "fa-solid fa-xmark";
    } else {
      icon.className = "fa-solid fa-bars";
    }
  });
}
