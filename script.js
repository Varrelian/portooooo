// ===== script.js =====

// ===== CAROUSEL SERTIFIKAT DENGAN TOMBOL =====
const carousel = document.getElementById('carouselContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let isDragging = false;
let startX = 0;
let currentTranslateX = 0;
let prevTranslateX = 0;
let autoSlideInterval = null;
const slideSpeed = 0.6;
const pauseOnHover = true;

const totalItems = carousel.querySelectorAll('.sertifikat-item').length;
const originalItems = totalItems / 2;
let itemWidth = 0;
let containerWidth = 0;

// Update ukuran
function updateSizes() {
  const items = carousel.querySelectorAll('.sertifikat-item');
  if (items.length === 0) return;
  itemWidth = items[0].offsetWidth + 30;
  containerWidth = carousel.parentElement.clientWidth;
}

// Auto-slide
function startAutoSlide() {
  if (autoSlideInterval) return;
  autoSlideInterval = setInterval(() => {
    if (!isDragging) {
      currentTranslateX -= slideSpeed;
      const maxScroll = (itemWidth * originalItems) - containerWidth;
      if (Math.abs(currentTranslateX) >= maxScroll + itemWidth) {
        carousel.style.transition = 'none';
        currentTranslateX = 0;
        setTranslateX(currentTranslateX);
        void carousel.offsetHeight;
        carousel.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      } else {
        setTranslateX(currentTranslateX);
      }
    }
  }, 16);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = null;
}

function setTranslateX(value) {
  carousel.style.transform = `translateX(${value}px)`;
  prevTranslateX = value;
}

// Pindah ke slide tertentu
function goToSlide(index) {
  stopAutoSlide();
  const targetPos = -(index * itemWidth);
  const maxScroll = (itemWidth * originalItems) - containerWidth;
  let newPos = Math.max(Math.min(targetPos, 0), -maxScroll);
  
  carousel.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  currentTranslateX = newPos;
  setTranslateX(newPos);
  
  if (Math.abs(newPos) >= maxScroll) {
    setTimeout(() => {
      carousel.style.transition = 'none';
      currentTranslateX = 0;
      setTranslateX(0);
      void carousel.offsetHeight;
      carousel.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 500);
  }
  
  setTimeout(() => {
    if (!isDragging) startAutoSlide();
  }, 3000);
}

// Navigasi dengan tombol
function nextSlide() {
  updateSizes();
  const currentPos = Math.abs(prevTranslateX);
  const currentIndex = Math.round(currentPos / itemWidth);
  const nextIndex = currentIndex + 1;
  
  if (nextIndex >= originalItems) {
    goToSlide(0);
  } else {
    goToSlide(nextIndex);
  }
}

function prevSlide() {
  updateSizes();
  const currentPos = Math.abs(prevTranslateX);
  const currentIndex = Math.round(currentPos / itemWidth);
  const prevIndex = currentIndex - 1;
  
  if (prevIndex < 0) {
    const maxScroll = (itemWidth * originalItems) - containerWidth;
    const lastIndex = originalItems - 1;
    goToSlide(lastIndex);
  } else {
    goToSlide(prevIndex);
  }
}

// Event listeners tombol
nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  nextSlide();
});

prevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  prevSlide();
});

// Drag
carousel.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  carousel.style.cursor = 'grabbing';
  carousel.style.transition = 'none';
  stopAutoSlide();
});

carousel.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const diff = e.clientX - startX;
  currentTranslateX = prevTranslateX + diff;
  const maxScroll = (itemWidth * originalItems) - containerWidth;
  if (currentTranslateX > 0) currentTranslateX = 0;
  if (currentTranslateX < -maxScroll - itemWidth) currentTranslateX = -maxScroll - itemWidth;
  setTranslateX(currentTranslateX);
});

carousel.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    carousel.style.cursor = 'grab';
    carousel.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    snapToNearest();
    setTimeout(() => {
      if (!isDragging) startAutoSlide();
    }, 3000);
  }
});

carousel.addEventListener('mouseleave', () => {
  if (isDragging) {
    isDragging = false;
    carousel.style.cursor = 'grab';
    carousel.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    snapToNearest();
    setTimeout(() => {
      if (!isDragging) startAutoSlide();
    }, 3000);
  }
});

// Snap ke terdekat
function snapToNearest() {
  updateSizes();
  if (itemWidth === 0) return;
  
  const currentPos = Math.abs(prevTranslateX);
  const nearestIndex = Math.round(currentPos / itemWidth);
  let targetPos = -(nearestIndex * itemWidth);
  const maxScroll = (itemWidth * originalItems) - containerWidth;
  targetPos = Math.max(Math.min(targetPos, 0), -maxScroll);
  
  currentTranslateX = targetPos;
  setTranslateX(targetPos);
  
  if (Math.abs(currentTranslateX) >= maxScroll) {
    setTimeout(() => {
      carousel.style.transition = 'none';
      currentTranslateX = 0;
      setTranslateX(0);
      void carousel.offsetHeight;
      carousel.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 500);
  }
}

// Hover pause
if (pauseOnHover) {
  const wrapper = carousel.parentElement;
  wrapper.addEventListener('mouseenter', stopAutoSlide);
  wrapper.addEventListener('mouseleave', () => {
    if (!isDragging) startAutoSlide();
  });
}

// Init
function initCarousel() {
  updateSizes();
  setTranslateX(0);
  startAutoSlide();
}

window.addEventListener('load', () => {
  setTimeout(initCarousel, 100);
});

// ===== HAMBURGER TOGGLE =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', function() {
  this.classList.toggle('active');
  navMenu.classList.toggle('open');
});

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

// ===== FADE-IN SCROLL =====
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { 
  threshold: 0.2, 
  rootMargin: "0px 0px -30px 0px" 
};

const appearOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      appearOnScroll.unobserve(entry.target);
    }
  });
}, appearOptions);

faders.forEach(fader => { 
  appearOnScroll.observe(fader); 
});

// ===== RESIZE =====
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateSizes();
    if (!isDragging) {
      snapToNearest();
    }
  }, 200);
});