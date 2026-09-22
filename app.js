const meter = document.querySelector('.scroll-meter span');
const year = document.querySelector('#year');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

year.textContent = new Date().getFullYear();

const updateMeter = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  meter.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
};

window.addEventListener('scroll', updateMeter, { passive: true });
updateMeter();

const reveals = document.querySelectorAll('.reveal');
if (reducedMotion) {
  reveals.forEach((item) => item.classList.add('in-view'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  reveals.forEach((item) => revealObserver.observe(item));
}

const videos = document.querySelectorAll('video');
if (!reducedMotion) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.62) {
          entry.target.play().catch(() => {});
        } else {
          entry.target.pause();
        }
      });
    },
    { threshold: [0, 0.62, 1] }
  );
  videos.forEach((video) => videoObserver.observe(video));
}

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.lightbox;
    lightbox.showModal();
  });
});
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.querySelector('.copy-email').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(button.dataset.email);
    const original = button.textContent;
    button.textContent = 'Email copied ✓';
    window.setTimeout(() => { button.textContent = original; }, 1800);
  } catch {
    window.location.href = `mailto:${button.dataset.email}`;
  }
});
