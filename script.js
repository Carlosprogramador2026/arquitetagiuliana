const whatsappNumber = "5511945942354";
const whatsappBase = `https://wa.me/${whatsappNumber}`;

window.addEventListener("load", () => {
  document.querySelector(".loader")?.classList.add("hidden");
});

const header = document.querySelector(".site-header");
const backToTop = document.querySelector(".back-to-top");
const parallaxItems = document.querySelectorAll("[data-parallax]");

function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 24);
  backToTop?.classList.toggle("visible", y > 720);

  parallaxItems.forEach((item) => {
    item.style.transform = `translateY(${y * 0.12}px)`;
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelector(".theme-toggle")?.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = entry.target;
      const finalValue = Number(target.dataset.count);
      const duration = 1600;
      const start = performance.now();

      function animateCounter(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        target.textContent = Math.floor(finalValue * eased);

        if (progress < 1) {
          requestAnimationFrame(animateCounter);
        } else {
          target.textContent = finalValue;
        }
      }

      requestAnimationFrame(animateCounter);
      counterObserver.unobserve(target);
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const testimonials = [...document.querySelectorAll(".testimonial")];
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");
let testimonialIndex = 0;

function showTestimonial(index) {
  testimonials.forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === index);
  });
}

function changeTestimonial(step) {
  testimonialIndex = (testimonialIndex + step + testimonials.length) % testimonials.length;
  showTestimonial(testimonialIndex);
}

prevBtn?.addEventListener("click", () => changeTestimonial(-1));
nextBtn?.addEventListener("click", () => changeTestimonial(1));
setInterval(() => changeTestimonial(1), 6200);

const contactForm = document.querySelector(".contact-form");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const message = [
    "Olá, visitei o site e gostaria de solicitar um orçamento.",
    "",
    `Nome: ${data.get("nome")}`,
    `Telefone: ${data.get("telefone")}`,
    `E-mail: ${data.get("email")}`,
    `Cidade: ${data.get("cidade")}`,
    `Mensagem: ${data.get("mensagem")}`
  ].join("\n");

  window.open(`${whatsappBase}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  contactForm.reset();
});

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
let cursorX = 0;
let cursorY = 0;
let ringX = 0;
let ringY = 0;

window.addEventListener("pointermove", (event) => {
  cursorX = event.clientX;
  cursorY = event.clientY;
  if (cursorDot) {
    cursorDot.style.left = `${cursorX}px`;
    cursorDot.style.top = `${cursorY}px`;
  }
});

function renderCursor() {
  ringX += (cursorX - ringX) * 0.16;
  ringY += (cursorY - ringY) * 0.16;

  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }

  requestAnimationFrame(renderCursor);
}
renderCursor();

document.querySelectorAll("a, button, .project-card, .feature-card").forEach((item) => {
  item.addEventListener("mouseenter", () => cursorRing?.style.setProperty("border-color", "rgba(0, 87, 255, 0.8)"));
  item.addEventListener("mouseleave", () => cursorRing?.style.setProperty("border-color", "rgba(212, 175, 55, 0.55)"));
});

document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.18}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

const canvas = document.getElementById("particles");
const ctx = canvas?.getContext("2d");
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

  const amount = Math.min(92, Math.floor(window.innerWidth / 18));
  particles = Array.from({ length: amount }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 2.2 + 0.6,
    speed: Math.random() * 0.45 + 0.12,
    alpha: Math.random() * 0.5 + 0.15
  }));
}

function drawParticles() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += Math.sin(particle.y * 0.012) * 0.18;

    if (particle.y < -10) {
      particle.y = window.innerHeight + 10;
      particle.x = Math.random() * window.innerWidth;
    }

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 175, 55, ${particle.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(drawParticles);
}

if (canvas && ctx) {
  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas);
}
