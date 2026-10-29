/**
 * PAMS MART — INTERACTIVE APPLICATION SCRIPT
 * Manages Catalog, Categories, Search, Cart, Checkout, and Routing.
 */

// ==================== PRODUCT DATABASE (From User Mockup Photos) ====================
const PAMS_PRODUCTS = [
  // --- CHOCOLATE (Mockup Sheet 2) ---
  {
    id: "kitkat",
    name: "KIT KAT",
    category: "chocolate",
    categoryTitle: "Chocolate",
    price: 20,
    image: "assets/images/kitkat.jpg",
    description: "Crisp wafer fingers enrobed in smooth milk chocolate. Have a break!",
    badge: "Bestseller"
  },
  {
    id: "snickers",
    name: "SNICKERS",
    category: "chocolate",
    categoryTitle: "Chocolate",
    price: 45,
    image: "assets/images/snickers.jpg",
    description: "Rich milk chocolate packed with roasted peanuts, caramel, and nougat.",
    badge: "Energizing"
  },
  {
    id: "dairymilk",
    name: "DAIRY MILK",
    category: "chocolate",
    categoryTitle: "Chocolate",
    price: 40,
    image: "assets/images/dairymilk.jpg",
    description: "Cadbury Dairy Milk Silk with decadent, silky melted chocolate goodness.",
    badge: "Velvety"
  },

  // --- SELF-CARE (Mockup Sheet 3) ---
  {
    id: "facewash",
    name: "FACEWASH",
    category: "self-care",
    categoryTitle: "Self-Care",
    price: 135,
    image: "assets/images/strawberry_facewash.jpg",
    description: "Lakmé Blush & Glow Strawberry Gel Face Wash for radiant and fresh skin.",
    badge: "Glowing"
  },
  {
    id: "lipbalm",
    name: "LIP BALM",
    category: "self-care",
    categoryTitle: "Self-Care",
    price: 750,
    image: "assets/images/laneige_lip_balm.jpg",
    description: "Laneige Lip Glowy Balm Berry flavor for smooth, hydrating petal-soft lips.",
    badge: "Premium"
  },
  {
    id: "sunscreen",
    name: "SUNSCREEN",
    category: "self-care",
    categoryTitle: "Self-Care",
    price: 499,
    image: "assets/images/watermelon_sunscreen.jpg",
    description: "Dot & Key Watermelon Cooling Sunscreen SPF 50+ PA+++ with hyaluronic acid.",
    badge: "SPF 50+"
  },

  // --- DRINKS (Mockup Sheet 4) ---
  {
    id: "strawberry-milk",
    name: "STRAWBERRY MILK",
    category: "drinks",
    categoryTitle: "Drinks",
    price: 50,
    image: "assets/images/strawberry_milk.jpg",
    description: "Fresh and creamy Korean strawberry flavored sweet milk drink in carton.",
    badge: "Kawaii"
  },
  {
    id: "banana-milk",
    name: "BANANA MILK",
    category: "drinks",
    categoryTitle: "Drinks",
    price: 140,
    image: "assets/images/banana_milk.jpg",
    description: "Binggrae Korean authentic sweet banana flavored milk bottle.",
    badge: "Imported"
  },
  {
    id: "coca-cola",
    name: "COCA COLA",
    category: "drinks",
    categoryTitle: "Drinks",
    price: 45,
    image: "assets/images/pink_coca_cola.jpg",
    description: "Special edition Hello Kitty Pink Coca-Cola soda can. Refreshing fizz!",
    badge: "Limited"
  },

  // --- SNACKS (Mockup Catalog Sheet 1) ---
  {
    id: "potato-chips",
    name: "POTATO CHIPS",
    category: "snacks",
    categoryTitle: "Snacks",
    price: 30,
    image: "assets/images/potato_chips.jpg",
    description: "Crispy kettle-cooked golden potato chips tossed with sea salt.",
    badge: "Crunchy"
  },
  {
    id: "nacho-cheese",
    name: "NACHO CHEESE",
    category: "snacks",
    categoryTitle: "Snacks",
    price: 50,
    image: "assets/images/nacho_cheese.jpg",
    description: "Crispy corn tortilla chips paired with warm creamy cheddar cheese dip.",
    badge: "Cheesy"
  },
  {
    id: "pringles",
    name: "PRINGLES",
    category: "snacks",
    categoryTitle: "Snacks",
    price: 110,
    image: "assets/images/pringles.jpg",
    description: "Iconic stacked Sour Cream & Onion potato crisps canister.",
    badge: "Pop & Snack"
  }
];

const CATEGORY_METADATA = {
  "chocolate": {
    name: "CHOCOLATE",
    tagline: "Finest confectionery, crispy wafer bars & velvety dairy silk.",
    themeClass: "theme-chocolate"
  },
  "self-care": {
    name: "SELF-CARE",
    tagline: "Gentle cleansers, fruity lip balms & cooling SPF protection.",
    themeClass: "theme-self-care"
  },
  "drinks": {
    name: "DRINKS",
    tagline: "Chilled Korean milk cartons & cute sparkling beverages.",
    themeClass: "theme-drinks"
  },
  "snacks": {
    name: "SNACKS",
    tagline: "Crunchy potato crisps, loaded nachos & savory goodies.",
    themeClass: "theme-snacks"
  }
};

// ==================== APP STATE ====================
let cart = [];
try {
  const savedCart = localStorage.getItem("pams_mart_cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
} catch (e) {
  console.warn("Could not read cart from localStorage", e);
}

// ==================== DOM ELEMENTS ====================
const views = {
  home: document.getElementById("view-home"),
  catalog: document.getElementById("view-catalog"),
  category: document.getElementById("view-category"),
  search: document.getElementById("view-search")
};

const navLinks = document.querySelectorAll(".nav-link");
const cartBadge = document.getElementById("cart-item-count");
const dockCartCounter = document.getElementById("dock-cart-counter");
const catCartCount = document.getElementById("cat-cart-count");

const cartDrawer = document.getElementById("cart-drawer");
const cartBackdrop = document.getElementById("cart-backdrop");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartSubtotalPrice = document.getElementById("cart-subtotal-price");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartCheckoutBtn = document.getElementById("cart-checkout-btn");

const checkoutBackdrop = document.getElementById("checkout-backdrop");
const checkoutItemsSummary = document.getElementById("checkout-items-summary");
const checkoutSubmitTotal = document.getElementById("checkout-submit-total");
const simpleCheckoutForm = document.getElementById("simple-checkout-form");

const successBackdrop = document.getElementById("success-backdrop");
const successOrderId = document.getElementById("success-order-id");
const successItemsDetails = document.getElementById("success-items-details");

const globalSearchInput = document.getElementById("global-search-input");
const clearSearchBtn = document.getElementById("clear-search-btn");
const heroSearchInput = document.getElementById("hero-search-input");
const heroSearchGo = document.getElementById("hero-search-go");

// ==================== NAVIGATION & ROUTING ====================
function handleRoute() {
  const hash = window.location.hash.slice(1).toLowerCase().trim() || "home";

  if (hash.startsWith("category/")) {
    const catName = hash.split("/")[1];
    renderCategoryPage(catName);
    switchView("category");
    updateNavHighlight(catName);
  } else if (CATEGORY_METADATA[hash]) {
    renderCategoryPage(hash);
    switchView("category");
    updateNavHighlight(hash);
  } else if (hash.startsWith("search")) {
    const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const q = params.get("q") || "";
    performSearch(q);
    switchView("search");
    updateNavHighlight("");
  } else if (hash === "catalog") {
    switchView("catalog");
    updateNavHighlight("catalog");
  } else {
    switchView("home");
    updateNavHighlight("home");
  }

  // Scroll to top of content smoothly
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function switchView(viewName) {
  Object.keys(views).forEach(key => {
    if (views[key]) {
      if (key === viewName) {
        views[key].style.display = "block";
        views[key].classList.add("active-view");
      } else {
        views[key].style.display = "none";
        views[key].classList.remove("active-view");
      }
    }
  });
}

function updateNavHighlight(activeIdentifier) {
  navLinks.forEach(link => {
    const navVal = link.getAttribute("data-nav");
    if (navVal === activeIdentifier) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ==================== RENDER HOME AISLES ====================
function renderHomeAisles() {
  const grid = document.getElementById("home-aisles-grid");
  if (!grid) return;

  const aisleData = [
    { cat: "chocolate", title: "CHOCOLATE", count: "3 items", img: "assets/images/kitkat.jpg" },
    { cat: "self-care", title: "SELF-CARE", count: "3 items", img: "assets/images/strawberry_facewash.jpg" },
    { cat: "drinks", title: "DRINKS", count: "3 items", img: "assets/images/strawberry_milk.jpg" },
    { cat: "snacks", title: "SNACKS", count: "3 items", img: "assets/images/potato_chips.jpg" }
  ];

  grid.innerHTML = aisleData.map(item => `
    <div class="aisle-preview-card" data-cat="${item.cat}" id="aisle-card-${item.cat}">
      <div class="aisle-thumb-box">
        <img src="${item.img}" alt="${item.title} aisle preview" loading="lazy">
      </div>
      <h3 class="aisle-title">${item.title}</h3>
      <p class="aisle-item-count">${item.count}</p>
      <button class="aisle-btn-explore" aria-label="Shop ${item.title}">Browse Aisle &rarr;</button>
    </div>
  `).join("");

  grid.querySelectorAll(".aisle-preview-card").forEach(card => {
    card.addEventListener("click", () => {
      const cat = card.getAttribute("data-cat");
      window.location.hash = cat;
    });
  });
}

// ==================== RENDER CATEGORY PAGE ====================
function renderCategoryPage(categoryKey) {
  const meta = CATEGORY_METADATA[categoryKey] || CATEGORY_METADATA["chocolate"];
  const pageWrapper = document.getElementById("category-page-wrapper");
  const titleEl = document.getElementById("active-category-title");
  const taglineEl = document.getElementById("category-tagline");
  const listEl = document.getElementById("products-showcase-list");

  if (!pageWrapper || !titleEl || !taglineEl || !listEl) return;

  // Apply theme class
  pageWrapper.className = `category-page-container ${meta.themeClass}`;
  titleEl.textContent = meta.name;
  taglineEl.textContent = meta.tagline;

  const items = PAMS_PRODUCTS.filter(p => p.category === categoryKey);

  listEl.innerHTML = items.map(product => {
    const inCartItem = cart.find(c => c.id === product.id);
    const inCartQty = inCartItem ? inCartItem.qty : 0;

    return `
      <article class="product-item-card" id="product-card-${product.id}" data-id="${product.id}">
        <div class="product-img-frame">
          <img src="${product.image}" alt="${product.name}" class="product-thumb" loading="lazy">
        </div>
        
        <div class="product-info-box">
          <span class="product-category-chip">${product.badge}</span>
          <h2 class="product-name">${product.name}</h2>
          <p class="product-desc">${product.description}</p>
        </div>

        <div class="product-buy-controls">
          <div class="product-price-badge">
            <span class="product-price-val">₹${product.price}</span>
          </div>

          ${inCartQty > 0 ? `
            <div class="card-qty-controller" id="qty-ctrl-${product.id}">
              <button class="qty-btn btn-dec" data-id="${product.id}" aria-label="Decrease quantity of ${product.name}">−</button>
              <span class="qty-count" id="qty-count-${product.id}">${inCartQty}</span>
              <button class="qty-btn btn-inc" data-id="${product.id}" aria-label="Increase quantity of ${product.name}">+</button>
            </div>
          ` : `
            <button class="btn-add-to-cart" id="add-btn-${product.id}" data-id="${product.id}" aria-label="Add ${product.name} to cart">
              <span>+ Add to Cart</span>
            </button>
          `}
        </div>
      </article>
    `;
  }).join("");

  attachProductCardEvents(listEl);
}

// ==================== SEARCH FUNCTIONALITY ====================
function performSearch(query) {
  const cleanQ = query.trim().toLowerCase();
  const searchResultsTitle = document.getElementById("search-results-title");
  const searchTermDisplay = document.getElementById("search-term-display");
  const listEl = document.getElementById("search-results-list");
  const emptyState = document.getElementById("search-empty-state");

  if (!listEl) return;

  if (searchTermDisplay) {
    searchTermDisplay.textContent = cleanQ;
  }

  if (!cleanQ) {
    listEl.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  const results = PAMS_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(cleanQ) || 
    p.description.toLowerCase().includes(cleanQ) ||
    p.category.toLowerCase().includes(cleanQ)
  );

  if (results.length === 0) {
    listEl.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
  } else {
    if (emptyState) emptyState.style.display = "none";
    listEl.innerHTML = results.map(product => {
      const inCartItem = cart.find(c => c.id === product.id);
      const inCartQty = inCartItem ? inCartItem.qty : 0;

      return `
        <article class="product-item-card" id="search-card-${product.id}" data-id="${product.id}">
          <div class="product-img-frame">
            <img src="${product.image}" alt="${product.name}" class="product-thumb" loading="lazy">
          </div>
          
          <div class="product-info-box">
            <span class="product-category-chip">${product.categoryTitle} • ${product.badge}</span>
            <h2 class="product-name">${product.name}</h2>
            <p class="product-desc">${product.description}</p>
          </div>

          <div class="product-buy-controls">
            <div class="product-price-badge">
              <span class="product-price-val">₹${product.price}</span>
            </div>

            ${inCartQty > 0 ? `
              <div class="card-qty-controller">
                <button class="qty-btn btn-dec" data-id="${product.id}" aria-label="Decrease quantity of ${product.name}">−</button>
                <span class="qty-count">${inCartQty}</span>
                <button class="qty-btn btn-inc" data-id="${product.id}" aria-label="Increase quantity of ${product.name}">+</button>
              </div>
            ` : `
              <button class="btn-add-to-cart" id="search-add-btn-${product.id}" data-id="${product.id}" aria-label="Add ${product.name} to cart">
                <span>+ Add to Cart</span>
              </button>
            `}
          </div>
        </article>
      `;
    }).join("");

    attachProductCardEvents(listEl);
  }
}

// ==================== PRODUCT CARD INTERACTION EVENTS ====================
function attachProductCardEvents(container) {
  // Add to cart buttons
  container.querySelectorAll(".btn-add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      addToCart(id, 1);
    });
  });

  // Quantity controllers (+ and -)
  container.querySelectorAll(".btn-inc").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      changeCartQuantity(id, 1);
    });
  });

  container.querySelectorAll(".btn-dec").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      changeCartQuantity(id, -1);
    });
  });
}

// ==================== CART MANAGEMENT ====================
function saveCart() {
  try {
    localStorage.setItem("pams_mart_cart", JSON.stringify(cart));
  } catch (e) {
    console.warn("Storage error", e);
  }
  updateCartUI();
}

function addToCart(productId, quantity = 1) {
  const product = PAMS_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: quantity
    });
  }

  saveCart();
  showToast(`Added ${product.name} to Basket! 🛍️`);
  refreshActiveProductCards();
}

function changeCartQuantity(productId, delta) {
  const itemIndex = cart.findIndex(c => c.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].qty += delta;
    if (cart[itemIndex].qty <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  saveCart();
  refreshActiveProductCards();
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.id !== productId);
  saveCart();
  refreshActiveProductCards();
  showToast("Item removed from basket");
}

function clearCart() {
  cart = [];
  saveCart();
  refreshActiveProductCards();
  showToast("Basket cleared");
}

function refreshActiveProductCards() {
  // If category view is open, re-render to update quantity selectors
  if (views.category.style.display !== "none") {
    const hash = window.location.hash.slice(1).toLowerCase().trim();
    if (CATEGORY_METADATA[hash]) {
      renderCategoryPage(hash);
    }
  }
  // If search view is open
  if (views.search.style.display !== "none") {
    const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
    performSearch(params.get("q") || "");
  }
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Update badges
  if (cartBadge) cartBadge.textContent = totalCount;
  if (dockCartCounter) dockCartCounter.textContent = totalCount;
  if (catCartCount) catCartCount.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;

  // Update Drawer items
  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-message">
          <span class="cart-empty-icon">🛒</span>
          <p>Your basket is currently empty.</p>
          <p style="font-size:0.8rem; margin-top:6px;">Browse our aisles to add delicious treats!</p>
        </div>
      `;
      if (cartCheckoutBtn) cartCheckoutBtn.disabled = true;
    } else {
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-row" id="cart-row-${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-row-thumb">
          <div class="cart-row-info">
            <span class="cart-row-title">${item.name}</span>
            <span class="cart-row-price">₹${item.price} &times; ${item.qty} = ₹${item.price * item.qty}</span>
          </div>
          <div class="cart-row-controls">
            <button class="cart-qty-btn cart-btn-dec" data-id="${item.id}" aria-label="Decrease quantity of ${item.name}">−</button>
            <span class="cart-qty-num">${item.qty}</span>
            <button class="cart-qty-btn cart-btn-inc" data-id="${item.id}" aria-label="Increase quantity of ${item.name}">+</button>
            <button class="cart-remove-btn" data-id="${item.id}" title="Remove item" aria-label="Remove ${item.name} from cart">🗑️</button>
          </div>
        </div>
      `).join("");

      if (cartCheckoutBtn) cartCheckoutBtn.disabled = false;

      // Attach drawer events
      cartItemsContainer.querySelectorAll(".cart-btn-inc").forEach(b => {
        b.addEventListener("click", () => changeCartQuantity(b.getAttribute("data-id"), 1));
      });
      cartItemsContainer.querySelectorAll(".cart-btn-dec").forEach(b => {
        b.addEventListener("click", () => changeCartQuantity(b.getAttribute("data-id"), -1));
      });
      cartItemsContainer.querySelectorAll(".cart-remove-btn").forEach(b => {
        b.addEventListener("click", () => removeFromCart(b.getAttribute("data-id")));
      });
    }
  }

  // Update Subtotal and Total
  if (cartSubtotalPrice) cartSubtotalPrice.textContent = `₹${subtotal}`;
  if (cartTotalPrice) cartTotalPrice.textContent = `₹${subtotal}`;
  if (checkoutSubmitTotal) checkoutSubmitTotal.textContent = `₹${subtotal}`;
}

// Open / Close Cart Drawer
function openCartDrawer() {
  if (cartDrawer && cartBackdrop) {
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    cartBackdrop.style.display = "block";
    cartBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeCartDrawer() {
  if (cartDrawer && cartBackdrop) {
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    cartBackdrop.style.display = "none";
    cartBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

// ==================== CHECKOUT MODAL ====================
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast("Your basket is empty!");
    return;
  }
  closeCartDrawer();

  if (checkoutBackdrop && checkoutItemsSummary) {
    checkoutItemsSummary.innerHTML = cart.map(item => `
      <div class="summary-item-line">
        <span>${item.name} &times; ${item.qty}</span>
        <strong>₹${item.price * item.qty}</strong>
      </div>
    `).join("");

    checkoutBackdrop.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function closeCheckoutModal() {
  if (checkoutBackdrop) {
    checkoutBackdrop.style.display = "none";
    document.body.style.overflow = "";
  }
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const address = document.getElementById("cust-address").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill in all required delivery details.");
    return;
  }

  // Generate simulated order confirmation
  const orderNum = "PAM-" + Math.floor(10000 + Math.random() * 90000);
  const purchasedItems = [...cart];
  const orderTotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  // Clear cart
  clearCart();
  closeCheckoutModal();

  // Show Success Modal
  if (successBackdrop && successOrderId && successItemsDetails) {
    successOrderId.textContent = `Order #${orderNum}`;
    successItemsDetails.innerHTML = `
      <p style="margin-bottom:8px; font-weight:700;">Delivering to: ${name} (${phone})</p>
      <p style="color:#64748b; margin-bottom:12px;">${address}</p>
      <div style="border-top:1px dashed #cbd5e1; padding-top:8px;">
        ${purchasedItems.map(i => `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>${i.name} &times; ${i.qty}</span><span>₹${i.price * i.qty}</span></div>`).join("")}
        <div style="display:flex; justify-content:space-between; font-weight:bold; margin-top:6px; border-top:1px solid #cbd5e1; padding-top:4px;"><span>Total Paid</span><span>₹${orderTotal}</span></div>
      </div>
    `;
    successBackdrop.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function closeSuccessModal() {
  if (successBackdrop) {
    successBackdrop.style.display = "none";
    document.body.style.overflow = "";
    window.location.hash = "home";
  }
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-item";
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}

// ==================== INITIALIZATION & EVENT LISTENERS ====================
document.addEventListener("DOMContentLoaded", () => {
  // Render home aisles
  renderHomeAisles();
  updateCartUI();
  handleRoute();

  // Listen to hash changes
  window.addEventListener("hashchange", handleRoute);

  // Catalog Cards Click Events
  document.querySelectorAll(".catalog-category-card").forEach(card => {
    card.addEventListener("click", () => {
      const cat = card.getAttribute("data-category");
      window.location.hash = cat;
    });
    // Keyboard accessibility Enter / Space
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const cat = card.getAttribute("data-category");
        window.location.hash = cat;
      }
    });
  });

  // Hero Actions
  const heroExploreBtn = document.getElementById("hero-explore-btn");
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener("click", () => {
      window.location.hash = "catalog";
    });
  }

  // Global Search input
  if (globalSearchInput) {
    globalSearchInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (clearSearchBtn) {
        clearSearchBtn.style.display = val ? "block" : "none";
      }
      if (val.length >= 2) {
        window.location.hash = `search?q=${encodeURIComponent(val)}`;
      }
    });

    globalSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = globalSearchInput.value.trim();
        if (val) {
          window.location.hash = `search?q=${encodeURIComponent(val)}`;
        }
      }
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      if (globalSearchInput) {
        globalSearchInput.value = "";
        clearSearchBtn.style.display = "none";
        window.location.hash = "catalog";
      }
    });
  }

  // Hero Search input
  if (heroSearchGo && heroSearchInput) {
    const doHeroSearch = () => {
      const val = heroSearchInput.value.trim();
      if (val) {
        if (globalSearchInput) globalSearchInput.value = val;
        window.location.hash = `search?q=${encodeURIComponent(val)}`;
      }
    };
    heroSearchGo.addEventListener("click", doHeroSearch);
    heroSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doHeroSearch();
    });
  }

  // Search Reset to Catalog
  const btnSearchReset = document.getElementById("btn-search-reset-catalog");
  if (btnSearchReset) {
    btnSearchReset.addEventListener("click", () => {
      window.location.hash = "catalog";
    });
  }

  // Cart Drawer open/close
  const openCartBtn = document.getElementById("open-cart-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const catalogDockCartBtn = document.getElementById("catalog-dock-cart-btn");
  const catSmallCartBtn = document.getElementById("cat-small-cart-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");

  if (openCartBtn) openCartBtn.addEventListener("click", openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCartDrawer);
  if (catalogDockCartBtn) catalogDockCartBtn.addEventListener("click", openCartDrawer);
  if (catSmallCartBtn) catSmallCartBtn.addEventListener("click", openCartDrawer);
  if (clearCartBtn) clearCartBtn.addEventListener("click", clearCart);

  // Quick Checkout triggers
  if (cartCheckoutBtn) cartCheckoutBtn.addEventListener("click", openCheckoutModal);
  
  const catQuickCheckoutBtn = document.getElementById("cat-quick-checkout-btn");
  if (catQuickCheckoutBtn) {
    catQuickCheckoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Your basket is empty. Please add items first! 🛒");
      } else {
        openCheckoutModal();
      }
    });
  }

  // Checkout modal controls
  const closeCheckoutBtn = document.getElementById("close-checkout-btn");
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener("click", closeCheckoutModal);
  if (checkoutBackdrop) {
    checkoutBackdrop.addEventListener("click", (e) => {
      if (e.target === checkoutBackdrop) closeCheckoutModal();
    });
  }

  if (simpleCheckoutForm) {
    simpleCheckoutForm.addEventListener("submit", handleCheckoutSubmit);
  }

  // Success modal controls
  const btnSuccessClose = document.getElementById("btn-success-close");
  if (btnSuccessClose) btnSuccessClose.addEventListener("click", closeSuccessModal);
  if (successBackdrop) {
    successBackdrop.addEventListener("click", (e) => {
      if (e.target === successBackdrop) closeSuccessModal();
    });
  }

  // Return buttons
  const btnCatBackHome = document.getElementById("btn-cat-back-home");
  if (btnCatBackHome) {
    btnCatBackHome.addEventListener("click", () => {
      window.location.hash = "home";
    });
  }

  // Mobile menu toggle
  const mobileToggleBtn = document.getElementById("mobile-toggle-btn");
  const navMenu = document.getElementById("nav-menu");
  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener("click", () => {
      navMenu.classList.toggle("mobile-open");
      const isExpanded = navMenu.classList.contains("mobile-open");
      mobileToggleBtn.setAttribute("aria-expanded", isExpanded);
    });

    // Close on link click
    navMenu.querySelectorAll(".nav-link").forEach(l => {
      l.addEventListener("click", () => {
        navMenu.classList.remove("mobile-open");
        mobileToggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Window control buttons fun micro-interaction
  const btnWinClose = document.getElementById("btn-window-close");
  const btnWinMin = document.getElementById("btn-window-min");
  const btnWinMax = document.getElementById("btn-window-max");

  if (btnWinClose) {
    btnWinClose.addEventListener("click", () => {
      showToast("Pams Mart is always open for you! 💕");
    });
  }
  if (btnWinMin) {
    btnWinMin.addEventListener("click", () => {
      showToast("Minimized to tray ✨");
    });
  }
  if (btnWinMax) {
    btnWinMax.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }
});
