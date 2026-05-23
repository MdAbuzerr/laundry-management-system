document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initClock();
  initBubbles();
  initMobileNav();
  initRestorationSlider();
  initPricingToggle();
  initBookingWizard();
  initChat();
});

function initClock() {
  const target = document.getElementById("live-system-time");
  if (!target) return;

  const render = () => {
    target.textContent = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date()) + " IST";
  };

  render();
  setInterval(render, 1000);
}

function initBubbles() {
  const field = document.getElementById("bubble-field");
  if (!field) return;

  const count = window.matchMedia("(max-width: 640px)").matches ? 16 : 28;

  for (let i = 0; i < count; i += 1) {
    const bubble = document.createElement("span");
    const size = 8 + Math.random() * 38;
    bubble.className = "bubble";
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.opacity = String(0.16 + Math.random() * 0.22);
    bubble.style.animationDuration = `${12 + Math.random() * 18}s`;
    bubble.style.animationDelay = `${Math.random() * 10}s`;
    bubble.style.setProperty("--drift", `${-40 + Math.random() * 80}px`);
    field.appendChild(bubble);
  }
}

function initMobileNav() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const drawer = document.getElementById("mobile-nav-drawer");
  if (!toggle || !drawer) return;

  toggle.addEventListener("click", () => {
    drawer.classList.toggle("hidden");
  });

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => drawer.classList.add("hidden"));
  });
}

function initRestorationSlider() {
  const slider = document.getElementById("restoration-slider");
  const overlay = document.getElementById("after-overlay");
  const handle = document.getElementById("slider-handle");
  if (!slider || !overlay || !handle) return;

  let dragging = false;

  const setPosition = (clientX) => {
    const rect = slider.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    overlay.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
    handle.style.left = `${percent}%`;
  };

  slider.addEventListener("pointerdown", (event) => {
    dragging = true;
    slider.setPointerCapture(event.pointerId);
    setPosition(event.clientX);
  });

  slider.addEventListener("pointermove", (event) => {
    if (dragging) setPosition(event.clientX);
  });

  slider.addEventListener("pointerup", () => {
    dragging = false;
  });

  slider.addEventListener("pointercancel", () => {
    dragging = false;
  });
}

function initPricingToggle() {
  const toggle = document.getElementById("pricing-tier-toggle");
  const dot = toggle?.querySelector(".toggle-dot");
  const standard = document.getElementById("label-standard");
  const express = document.getElementById("label-express");
  if (!toggle || !dot) return;

  const prices = {
    "price-shirts": [149, 239],
    "price-bridal": [2500, 4000],
    "price-sneakers": [950, 1520],
    "price-bedding": [199, 319],
    "price-sarees": [350, 560],
    "price-curtains": [299, 479]
  };

  let isExpress = false;

  const render = () => {
    Object.entries(prices).forEach(([id, values]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = `₹${values[isExpress ? 1 : 0].toLocaleString("en-IN")} onwards`;
    });

    dot.style.transform = isExpress ? "translateX(24px)" : "translateX(0)";
    toggle.classList.toggle("bg-vibes-cyan", isExpress);
    standard?.classList.toggle("text-vibes-gray", isExpress);
    express?.classList.toggle("text-white", isExpress);
  };

  toggle.addEventListener("click", () => {
    isExpress = !isExpress;
    render();
  });
}

function initBookingWizard() {
  const panes = Array.from(document.querySelectorAll(".booking-step-pane"));
  const next = document.getElementById("booking-next-btn");
  const back = document.getElementById("booking-back-btn");
  const indicator = document.getElementById("step-indicator-text");
  const progress = document.getElementById("step-progress-bar");
  const warning = document.getElementById("booking-warning-banner");
  const warningText = document.getElementById("booking-warning-text");
  const estimate = document.getElementById("booking-rate-est");
  const expressToggle = document.getElementById("booking-express-toggle");
  const expressBadge = document.getElementById("booking-express-badge");
  const timeInput = document.getElementById("booking-time-input");
  const serviceButtons = Array.from(document.querySelectorAll(".service-selection-btn"));
  if (!panes.length || !next || !back) return;

  const baseRates = {
    "dry-cleaning": 450,
    "sneaker-spa": 950,
    "wash-fold": 299
  };

  let step = 0;
  let service = "dry-cleaning";

  const showWarning = (message) => {
    if (!warning || !warningText) return;
    warningText.textContent = message;
    warning.classList.remove("hidden");
    warning.classList.add("flex");
  };

  const hideWarning = () => {
    warning?.classList.add("hidden");
    warning?.classList.remove("flex");
  };

  const updateEstimate = () => {
    const base = baseRates[service] || 450;
    const amount = expressToggle?.checked ? Math.round(base * 1.6) : base;
    if (estimate) estimate.textContent = `₹${amount.toLocaleString("en-IN")}`;
    expressBadge?.classList.toggle("hidden", !expressToggle?.checked);
  };

  const render = () => {
    panes.forEach((pane, index) => pane.classList.toggle("hidden", index !== step));
    if (indicator) indicator.textContent = `Step ${step + 1} of ${panes.length}`;
    if (progress) progress.style.width = `${((step + 1) / panes.length) * 100}%`;
    back.disabled = step === 0;
    back.classList.toggle("opacity-40", step === 0);
    next.querySelector("span").textContent = step === panes.length - 1 ? "Submit Request" : "Continue";
    hideWarning();
  };

  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      serviceButtons.forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      service = button.dataset.service || service;
      updateEstimate();
    });
  });

  expressToggle?.addEventListener("change", updateEstimate);

  next.addEventListener("click", () => {
    if (step === 1 && !timeInput?.value) {
      showWarning("Please select your preferred collection time.");
      return;
    }

    if (step < panes.length - 1) {
      step += 1;
      render();
      return;
    }

    showWarning("Demo booking submitted. Connect this button to your backend or WhatsApp flow.");
  });

  back.addEventListener("click", () => {
    if (step > 0) {
      step -= 1;
      render();
    }
  });

  updateEstimate();
  render();
}

function initChat() {
  const launcher = document.getElementById("chat-launcher");
  const overlay = document.getElementById("chat-terminal-overlay");
  const close = document.getElementById("chat-close-btn");
  const form = document.getElementById("chat-input-form");
  const input = document.getElementById("chat-text-input");
  const logs = document.getElementById("chat-logs");
  if (!launcher || !overlay || !close || !form || !input || !logs) return;

  const responses = [
    {
      keys: ["rate", "rates", "price", "pricing"],
      text: "Rates start at ₹149 for shirts, ₹950 for sneaker spa, and ₹2,500 for couture bridal pieces. Express adds roughly 60%."
    },
    {
      keys: ["zone", "zones", "area", "service"],
       text: "Active zones include Central Delhi, South Delhi, Gurugram, Noida, Indirapuram, and nearby premium NCR corridors."
    },
    {
      keys: ["weather", "rain", "monsoon"],
      text: "Monsoon routing is stable. Delays can trigger dispatch credits in the Vibes 2.0 flow."
    },
    {
      keys: ["status", "order", "track"],
      text: "Demo order #VIBE-921 is in transit with a simulated ETA of 14 minutes."
    }
  ];

  const addMessage = (text, type) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${type}`;
    bubble.textContent = text;
    logs.appendChild(bubble);
    logs.scrollTop = logs.scrollHeight;
  };

  const getReply = (message) => {
    const lower = message.toLowerCase();
    return responses.find((item) => item.keys.some((key) => lower.includes(key)))?.text ||
      "I can help with rates, zones, weather routing, and order status. Try one of those keywords.";
  };

  launcher.addEventListener("click", () => overlay.classList.toggle("hidden"));
  close.addEventListener("click", () => overlay.classList.add("hidden"));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    addMessage(message, "user");
    input.value = "";
    window.setTimeout(() => addMessage(getReply(message), "bot"), 350);
  });
}