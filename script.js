// Initialize cart array
let cart = [];

// Theme Toggle
const themeToggle = document.querySelector(".theme-toggle");
const body = document.body;

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle");
  const logo = document.getElementById("logo");
  const body = document.body;

  themeToggle.addEventListener("click", () => {
    const isDarkMode = body.getAttribute("data-theme") === "dark";

    if (isDarkMode) {
      body.setAttribute("data-theme", "light");
      logo.src = "/resources/rndlogo2.png"; // Light mode logo
    } else {
      body.setAttribute("data-theme", "dark");
      logo.src = "/resources/rndlogo1.png"; // Dark mode logo
    }
  });
  // Shopping cart initialization
  const cartContainer = document.querySelector(".cart-container");
  cartContainer.style.display = "none"; // Hide cart initially
  initializeCart();
});
// Cart Functions
function initializeCart() {
  const buyButtons = document.querySelectorAll(".product-btn");
  buyButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}
function addToCart(event) {
  const productCard = event.target.closest(".product-card");
  const productName = productCard.querySelector("h3").textContent;
  const priceText =
    productCard.querySelector("p strong").parentElement.textContent;
  const productPrice = parseFloat(priceText.match(/\d+\.\d+/)[0]);

  const existingItem = cart.find((item) => item.name === productName);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name: productName,
      price: productPrice,
      quantity: 1,
    });
  }

  updateCartDisplay();
  showNotification(`Added ${productName} to cart`);
}

function updateCartDisplay() {
  const cartItems = document.querySelector(".cart-items");
  const cartContainer = document.querySelector(".cart-container");
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.style.display = "none";
    // Remove checkout button if present
    let oldBtn = cartContainer.querySelector(".checkout-btn");
    if (oldBtn) oldBtn.remove();
    return;
  }

  cartContainer.style.display = "block";

  cart.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
      <span>${item.name}</span>
      <div class="quantity-controls">
        <button class="quantity-btn minus" data-product="${
          item.name
        }">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn plus" data-product="${item.name}">+</button>
        <span>₹${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;

    const minusBtn = itemElement.querySelector(".minus");
    const plusBtn = itemElement.querySelector(".plus");

    minusBtn.addEventListener("click", () => updateQuantity(item.name, -1));
    plusBtn.addEventListener("click", () => updateQuantity(item.name, 1));

    cartItems.appendChild(itemElement);
  });

  updateTotal();

  // Remove old checkout button if present
  let oldBtn = cartContainer.querySelector(".checkout-btn");
  if (oldBtn) oldBtn.remove();

  // Add checkout button
  let checkoutBtn = document.createElement("button");
  checkoutBtn.className = "checkout-btn";
  checkoutBtn.textContent = "Checkout";
  checkoutBtn.addEventListener("click", handleCheckout);
  cartContainer.appendChild(checkoutBtn);
}

function handleCheckout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  // Save cart as JSON and redirect
  localStorage.setItem("checkoutData", JSON.stringify(cart));
  window.location.href = "checkout.html"; // <-- Use relative path
}

function updateQuantity(productName, change) {
  const item = cart.find((item) => item.name === productName);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.name !== productName);
      showNotification(`Removed ${productName} from cart`);
    }
    updateCartDisplay();
  }
}

function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cart-total").textContent = total.toFixed(2);
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const icon = themeToggle.querySelector("i");
  if (body.classList.contains("dark-mode")) {
    icon.classList.replace("fa-moon", "fa-sun");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
  }
});

// Mobile Menu Toggle
const mobileMenu = document.querySelector(".mobile-menu");
const navLinks = document.querySelector(".nav-links");

mobileMenu.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".mobile-menu") && !e.target.closest(".nav-links")) {
    navLinks.classList.remove("active");
  }
});

// Hero Background Slider
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function nextSlide() {
  // Remove active class from current slide
  slides[currentSlide].classList.remove("active");
  // Calculate next slide index
  currentSlide = (currentSlide + 1) % slides.length;
  // Add active class to next slide
  slides[currentSlide].classList.add("active");
}

// Change slide every 3 seconds
setInterval(nextSlide, 5000);

// Product Carousel
const carousel = document.querySelector(".carousel");
let isDown = false;
let startX;
let scrollLeft;

carousel.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener("mouseleave", () => {
  isDown = false;
});

carousel.addEventListener("mouseup", () => {
  isDown = false;
});

carousel.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 2;
  carousel.scrollLeft = scrollLeft - walk;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    target.scrollIntoView({
      behavior: "smooth",
    });
    // Close mobile menu after clicking a link
    navLinks.classList.remove("active");
  });
});
