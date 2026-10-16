/* ========================================
   1. PRODUCT DATA
======================================== */

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 45000,
    image: "images/wireless-headphones.jpg",
  },
  {
    id: 2,
    name: "Classic Sneakers",
    category: "Fashion",
    price: 65000,
    image: "images/sneakers.jpg",
  },
  {
    id: 3,
    name: "Modern Table Lamp",
    category: "Home & Living",
    price: 28000,
    image: "images/table-lamp.jpg",
  },
  {
    id: 4,
    name: "Skincare Set",
    category: "Beauty",
    price: 18000,
    image: "images/skincare-products.jpg",
  },
  {
    id: 5,
    name: "Smart Watch",
    category: "Electronics",
    price: 85000,
    image: "images/smartwatch.jpg",
  },
  {
    id: 6,
    name: "Everyday Backpack",
    category: "Fashion",
    price: 32000,
    image: "images/backpack.jpg",
  },
  {
    id: 7,
    name: "Coffee Maker",
    category: "Home & Living",
    price: 52000,
    image: "images/coffee-maker.jpg",
  },
  {
    id: 8,
    name: "Reusable Water Bottle",
    category: "Home & Living",
    price: 12000,
    image: "images/water-bottle.jpg",
  },
];

/* ========================================
   2. SELECT HTML ELEMENTS
======================================== */

// Products
const productContainer = document.querySelector(".product-container");
const productResultCount = document.querySelector(".product-result-count");
const sortSelect = document.querySelector(".sort-select");

// Mobile navigation
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

// Cart
const cartButton = document.querySelector(".cart-button");
const cartCount = document.querySelector(".cart-count");
const cartPanel = document.querySelector(".cart-panel");
const cartOverlay = document.querySelector(".cart-overlay");
const closeCartButton = document.querySelector(".close-cart");
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartHeadingCount = document.querySelector(".cart-heading-count");
const checkoutButton = document.querySelector(".checkout-button");
const continueShoppingButton = document.querySelector(".continue-shopping");

/* ========================================
   3. STATE AND HELPERS
======================================== */

let cart = [];
let currentSort = "featured";

function formatPrice(price) {
  return `₦${price.toLocaleString("en-NG")}`;
}

/* ========================================
   4. RENDER PRODUCTS
======================================== */

function renderProducts() {
  let displayedProducts = [...products];

  if (currentSort === "price-low") {
    displayedProducts.sort((a, b) => a.price - b.price);
  }

  if (currentSort === "price-high") {
    displayedProducts.sort((a, b) => b.price - a.price);
  }

  if (currentSort === "name") {
    displayedProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  productResultCount.textContent = displayedProducts.length;

  if (displayedProducts.length === 0) {
    productContainer.innerHTML = `
      <p class="empty-products">No products are available.</p>
    `;
    return;
  }

  productContainer.innerHTML = displayedProducts
    .map((product) => {
      return `
        <article class="product-card">
          <div class="product-image">
            <img
              src="${product.image}"
              alt="${product.name}"
              loading="lazy"
            />

            <span class="product-badge">Featured</span>
          </div>

          <div class="product-info">
            <p class="product-category">${product.category}</p>

            <h3 class="product-name">${product.name}</h3>

            <p class="product-price">${formatPrice(product.price)}</p>

            <button
              class="add-to-cart-button"
              type="button"
              data-product-id="${product.id}"
            >
              Add to Cart
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

/* ========================================
   5. SORT PRODUCTS
======================================== */

sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  renderProducts();
});

/* ========================================
   6. UPDATE CART COUNT
======================================== */

function updateCartCount() {
  const totalItems = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  cartCount.textContent = totalItems;
  cartHeadingCount.textContent = `(${totalItems})`;
}

/* ========================================
   7. ADD PRODUCTS TO CART
======================================== */

productContainer.addEventListener("click", (event) => {
  const addButton = event.target.closest(".add-to-cart-button");

  if (!addButton) {
    return;
  }

  const productId = Number(addButton.dataset.productId);

  const selectedProduct = products.find((product) => {
    return product.id === productId;
  });

  if (!selectedProduct) {
    return;
  }

  const existingProduct = cart.find((item) => {
    return item.id === productId;
  });

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...selectedProduct,
      quantity: 1,
    });
  }

  updateCartCount();
  renderCart();

  const originalText = addButton.textContent;
  addButton.textContent = "Added!";

  window.setTimeout(() => {
    if (addButton.isConnected) {
      addButton.textContent = originalText;
    }
  }, 800);
});

/* ========================================
   8. RENDER CART
======================================== */

function renderCart() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty.</p>
        <span>Add something you love to get started.</span>
      </div>
    `;

    cartTotal.textContent = formatPrice(0);
    checkoutButton.disabled = true;
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map((item) => {
      return `
        <article class="cart-item">
          <img
            class="cart-item-image"
            src="${item.image}"
            alt="${item.name}"
          />

          <div class="cart-item-info">
            <p class="cart-item-category">${item.category}</p>
            <h3>${item.name}</h3>
            <p class="cart-item-price">${formatPrice(item.price)}</p>
          </div>

          <div class="cart-item-actions">
            <div class="quantity-control">
              <button
                class="quantity-button"
                type="button"
                data-action="decrease"
                data-product-id="${item.id}"
                aria-label="Decrease quantity of ${item.name}"
                ${item.quantity === 1 ? "disabled" : ""}
              >−</button>

              <span class="quantity-value">${item.quantity}</span>

              <button
                class="quantity-button"
                type="button"
                data-action="increase"
                data-product-id="${item.id}"
                aria-label="Increase quantity of ${item.name}"
              >+</button>
            </div>

            <button
              class="remove-item-button"
              type="button"
              data-action="remove"
              data-product-id="${item.id}"
            >
              Remove
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  cartTotal.textContent = formatPrice(subtotal);
  checkoutButton.disabled = false;
}

/* ========================================
   9. CHANGE QUANTITY OR REMOVE PRODUCTS
======================================== */

cartItemsContainer.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");

  if (!actionButton) {
    return;
  }

  const productId = Number(actionButton.dataset.productId);
  const action = actionButton.dataset.action;

  const selectedItem = cart.find((item) => {
    return item.id === productId;
  });

  if (!selectedItem) {
    return;
  }

  if (action === "increase") {
    selectedItem.quantity += 1;
  }

  if (action === "decrease" && selectedItem.quantity > 1) {
    selectedItem.quantity -= 1;
  }

  if (action === "remove") {
    cart = cart.filter((item) => item.id !== productId);
  }

  updateCartCount();
  renderCart();
});

/* ========================================
   10. OPEN AND CLOSE CART
======================================== */

function openCart() {
  closeMenu();

  cartPanel.classList.add("active");
  cartOverlay.classList.add("active");

  cartPanel.inert = false;
  cartPanel.setAttribute("aria-hidden", "false");
  cartButton.setAttribute("aria-expanded", "true");

  document.body.classList.add("cart-open");

  closeCartButton.focus();
}

function closeCart() {
  cartPanel.classList.remove("active");
  cartOverlay.classList.remove("active");

  cartPanel.inert = true;
  cartPanel.setAttribute("aria-hidden", "true");
  cartButton.setAttribute("aria-expanded", "false");

  document.body.classList.remove("cart-open");

  cartButton.focus();
}

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
continueShoppingButton.addEventListener("click", closeCart);

/* ========================================
   11. MOBILE HAMBURGER MENU
======================================== */

function closeMenu() {
  navLinks.classList.remove("active");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("active");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});

/* ========================================
   12. KEYBOARD SUPPORT
======================================== */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (cartPanel.classList.contains("active")) {
      closeCart();
    } else {
      closeMenu();
    }
  }
});

/* ========================================
   13. CHECKOUT PLACEHOLDER
======================================== */

checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    return;
  }

  alert(
    "Checkout is a prototype feature. Real order processing and payment integration have not been connected yet.",
  );
});

/* ========================================
   14. INITIALIZE PAGE
======================================== */

document.querySelector(".current-year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
updateCartCount();
