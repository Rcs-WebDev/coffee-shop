/**
 * CAFE RAY - MAIN APPLICATION LOGIC
 * Features: SPA Routing, Local Storage DB, Shopping Cart, Customize Modal,
 * Multi-method Payment Simulation, Wallet Top-up, Loyalty System.
 */

// ==========================================
// 1. PRODUCT CATALOG DATA
// ==========================================
const MENU_DATA = [
    {
        id: "latte",
        name: "Caffè Latte",
        desc: "Espresso premium berpadu dengan susu segar yang di-steam halus dan lapisan tipis busa susu di atasnya.",
        price: 32000,
        rating: 4.8,
        category: "espresso",
        image: "assets/latte.png",
        badge: "Best Seller",
        customizable: true
    },
    {
        id: "cappuccino",
        name: "Cappuccino Classic",
        desc: "Keseimbangan sempurna antara espresso pekat, susu steam hangat, dan lapisan tebal foam susu cokelat bubuk.",
        price: 32000,
        rating: 4.7,
        category: "espresso",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=400&auto=format&fit=crop",
        badge: "",
        customizable: true
    },
    {
        id: "macchiato",
        name: "Caramel Macchiato",
        desc: "Kombinasi manis sirup vanila, susu hangat, espresso pekat, dan siraman saus karamel di atasnya.",
        price: 38000,
        rating: 4.9,
        category: "espresso",
        image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=400&auto=format&fit=crop",
        badge: "Best Seller",
        customizable: true
    },
    {
        id: "coldbrew-sig",
        name: "Signature Cold Brew",
        desc: "Kopi Arabika premium yang diseduh dingin secara perlahan selama 12 jam untuk rasa halus, ringan, dan tidak asam.",
        price: 28000,
        rating: 4.6,
        category: "coldbrew",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=400&auto=format&fit=crop",
        badge: "New",
        customizable: true
    },
    {
        id: "coldbrew-cream",
        name: "Vanilla Sweet Cream Cold Brew",
        desc: "Signature Cold Brew disajikan dingin dengan siraman krim manis vanila buatan rumah yang lembut.",
        price: 34000,
        rating: 4.9,
        category: "coldbrew",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&auto=format&fit=crop",
        badge: "Best Seller",
        customizable: true
    },
    {
        id: "matcha",
        name: "Kyoto Matcha Latte",
        desc: "Matcha bubuk murni kualitas tinggi dari Kyoto Jepang, dipadukan dengan susu segar hangat yang manis.",
        price: 35000,
        rating: 4.8,
        category: "noncoffee",
        image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=400&auto=format&fit=crop",
        badge: "",
        customizable: true
    },
    {
        id: "cocoa",
        name: "Dark Belgian Cocoa",
        desc: "Cokelat hitam Belgia premium yang dilelehkan bersama susu segar hangat untuk rasa cokelat yang pekat.",
        price: 34000,
        rating: 4.7,
        category: "noncoffee",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=400&auto=format&fit=crop",
        badge: "",
        customizable: true
    },
    {
        id: "croissant",
        name: "Golden Butter Croissant",
        desc: "Pastry Prancis klasik bermentega premium yang renyah dan berlapis di luar, namun lembut di dalam.",
        price: 24000,
        rating: 4.6,
        category: "snacks",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&auto=format&fit=crop",
        badge: "Freshly Baked",
        customizable: false
    },
    {
        id: "muffin",
        name: "Double Chocolate Muffin",
        desc: "Muffin cokelat super lembut dengan taburan choco chips melimpah di setiap gigitan.",
        price: 22000,
        rating: 4.5,
        category: "snacks",
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=400&auto=format&fit=crop",
        badge: "",
        customizable: false
    }
];

// Addons list for customizations
const ADDONS_DATA = [
    { id: "shot", name: "Extra Shot Espresso", price: 6000 },
    { id: "syrup", name: "Sirup Karamel/Vanila", price: 4000 },
    { id: "jelly", name: "Coffee Jelly", price: 5000 },
    { id: "cream", name: "Whipped Cream", price: 5000 }
];

// Promos List
const PROMO_DATA = [
    { code: "RAYNEW", name: "Diskon Member Baru", desc: "Diskon 20% untuk semua pembelian menu kopi tanpa minimum transaksi.", discountPercent: 20, minSpend: 0 },
    { code: "COFFEETIME", name: "Spesial Kopi Sore", desc: "Potongan harga langsung Rp15.000 dengan minimum pembelian Rp50.000.", discountValue: 15000, minSpend: 50000 },
    { code: "HEBAT30", name: "Hemat Bareng Ray", desc: "Diskon 30% (hingga Rp25.000) dengan minimum pembelian Rp70.000.", discountPercent: 30, maxDiscount: 25000, minSpend: 70000 }
];

// ==========================================
// 2. STATE MANAGEMENT & STORE
// ==========================================
let activePromo = null; // Kode promo yang sedang aktif
let currentUser = null;
let currentCart = [];
let currentSelectedItem = null; // Untuk modal kustomisasi
let qrisInterval = null; // Timer QRIS

// Helper functions for Local Storage
const storage = {
    getUsers: () => JSON.parse(localStorage.getItem("cafe_ray_users")) || [],
    saveUsers: (users) => localStorage.setItem("cafe_ray_users", JSON.stringify(users)),
    getActiveSession: () => JSON.parse(localStorage.getItem("cafe_ray_active_user")) || null,
    saveActiveSession: (user) => localStorage.setItem("cafe_ray_active_user", JSON.stringify(user)),
    clearActiveSession: () => localStorage.removeItem("cafe_ray_active_user")
};

// Formatting utilities
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// ==========================================
// 3. INITIALIZATION & USER ACTIONS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    // Check for active login session
    currentUser = storage.getActiveSession();

    // Bind global click/submit event handlers
    setupEventHandlers();

    if (currentUser) {
        // Load user cart
        currentCart = currentUser.cart || [];
        updateUserNavUI();
        showView("dashboard");
    } else {
        showView("auth");
        showAuthForm("login");
    }

    // Render product grids
    renderDashboardProducts();
    renderMenuProducts();
}

// User Navigation / UI Update
function updateUserNavUI() {
    const navProfile = document.getElementById("nav-profile");
    const burgerBtn = document.getElementById("burger-btn");
    const navLinks = document.querySelector(".nav-links");
    if (currentUser) {
        navProfile.style.display = "flex";
        if (burgerBtn) burgerBtn.style.display = "";
        document.getElementById("nav-username").innerText = currentUser.username;
        document.getElementById("nav-wallet-balance").innerText = formatRupiah(currentUser.balance || 0);
        updateCartBadge();

        // Update mobile user card info
        const mobUsername = document.getElementById("mobile-nav-username");
        if (mobUsername) mobUsername.innerText = currentUser.username;
        const mobWallet = document.getElementById("mobile-nav-wallet-balance");
        if (mobWallet) mobWallet.innerText = formatRupiah(currentUser.balance || 0);
    } else {
        navProfile.style.display = "none";
        if (burgerBtn) {
            burgerBtn.style.display = "none";
            burgerBtn.classList.remove("active");
        }
        if (navLinks) {
            navLinks.classList.remove("active");
        }
    }
}

// Setup Event Listeners
function setupEventHandlers() {
    // Auth Forms Submission
    document.getElementById("login-form").addEventListener("submit", handleLogin);
    document.getElementById("register-form").addEventListener("submit", handleRegister);

    // Navigation Links
    document.querySelectorAll("[data-target-view]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const target = btn.getAttribute("data-target-view");
            if (currentUser) {
                showView(target);
                // Close cart drawer if switching view
                closeCartDrawer();
                
                // Close mobile navigation menu
                const burgerBtn = document.getElementById("burger-btn");
                const navLinks = document.querySelector(".nav-links");
                if (burgerBtn) burgerBtn.classList.remove("active");
                if (navLinks) navLinks.classList.remove("active");
            } else {
                showAlert("error", "Silakan login terlebih dahulu untuk mengakses menu ini.", "auth");
            }
        });
    });

    // Burger Menu Toggle
    const burgerBtn = document.getElementById("burger-btn");
    const navLinks = document.querySelector(".nav-links");
    if (burgerBtn && navLinks) {
        burgerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            burgerBtn.classList.toggle("active");
            navLinks.classList.toggle("active");
        });
    }

    // Close burger menu when clicking outside
    document.addEventListener("click", (e) => {
        const burgerBtn = document.getElementById("burger-btn");
        const navLinks = document.querySelector(".nav-links");
        if (burgerBtn && navLinks && navLinks.classList.contains("active")) {
            if (!burgerBtn.contains(e.target) && !navLinks.contains(e.target)) {
                burgerBtn.classList.remove("active");
                navLinks.classList.remove("active");
            }
        }
    });

    // Cart Drawer Toggle
    document.getElementById("cart-toggle-btn").addEventListener("click", toggleCartDrawer);
    document.getElementById("close-cart-btn").addEventListener("click", closeCartDrawer);
    document.getElementById("cart-overlay").addEventListener("click", closeCartDrawer);

    // Customization Modal Close
    document.getElementById("close-custom-modal").addEventListener("click", closeCustomModal);

    // Profile Form Submission
    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
        profileForm.addEventListener("submit", handleProfileUpdate);
    }

    // CC Form card interaction (Flipping card mockup on CVV focus)
    const ccCvv = document.getElementById("cc-cvv");
    if (ccCvv) {
        ccCvv.addEventListener("focus", () => {
            document.querySelector(".cc-card-inner").classList.add("flipped");
        });
        ccCvv.addEventListener("blur", () => {
            document.querySelector(".cc-card-inner").classList.remove("flipped");
        });

        // Real-time card updates
        document.getElementById("cc-number").addEventListener("input", (e) => {
            let val = e.target.value.replace(/\D/g, '');
            // Format 16 digits
            val = val.substring(0, 16);
            let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
            e.target.value = formatted;
            document.getElementById("mock-card-number").innerText = formatted || "•••• •••• •••• ••••";
        });
        document.getElementById("cc-holder").addEventListener("input", (e) => {
            document.getElementById("mock-card-holder").innerText = e.target.value.toUpperCase() || "NAME SURNAME";
        });
        document.getElementById("cc-expiry").addEventListener("input", (e) => {
            let val = e.target.value.replace(/\D/g, '');
            val = val.substring(0, 4);
            if (val.length > 2) {
                val = val.substring(0, 2) + '/' + val.substring(2);
            }
            e.target.value = val;
            document.getElementById("mock-card-expiry").innerText = val || "MM/YY";
        });
        document.getElementById("cc-cvv").addEventListener("input", (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0, 3);
            e.target.value = val;
            document.getElementById("mock-card-cvv").innerText = val || "•••";
        });
    }

    // Top-up Preset Buttons
    document.querySelectorAll(".preset-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("selected-preset"));
            btn.classList.add("selected-preset");
            document.getElementById("topup-amount").value = btn.getAttribute("data-value");
        });
    });

    // Customization Selection Events (Sizes, Ice, Sweetness)
    document.querySelectorAll(".option-btn[data-type]").forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.getAttribute("data-type");
            document.querySelectorAll(`.option-btn[data-type="${type}"]`).forEach(b => b.classList.remove("selected-option"));
            btn.classList.add("selected-option");
            updateCustomModalPrice();
        });
    });
}

// ==========================================
// 4. AUTHENTICATION CONTROLLERS
// ==========================================
function showAuthForm(formType) {
    document.querySelectorAll(".auth-form-view").forEach(form => {
        form.classList.remove("active-form");
    });
    document.getElementById(`${formType}-form-view`).classList.add("active-form");
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value;

    const users = storage.getUsers();
    const user = users.find(u => u.email === email && u.password === pass);

    if (user) {
        currentUser = user;
        currentCart = user.cart || [];
        storage.saveActiveSession(user);
        updateUserNavUI();
        showAlert("success", "Login berhasil! Selamat datang kembali.", "auth");

        setTimeout(() => {
            showView("dashboard");
            // Reset form
            document.getElementById("login-form").reset();
        }, 1200);
    } else {
        showAlert("error", "Email atau password salah.", "auth");
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-password").value;

    const users = storage.getUsers();

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        showAlert("error", "Email sudah terdaftar. Silakan gunakan email lain.", "auth");
        return;
    }

    // Create new user profile
    const newUser = {
        id: "user_" + Date.now(),
        username,
        email,
        password: pass,
        balance: 150000, // Free Rp 150k Ray Wallet balance on sign-up to test buying!
        points: 50,      // Free 50 loyalty points on sign-up!
        cart: [],
        transactions: []
    };

    users.push(newUser);
    storage.saveUsers(users);

    showAlert("success", "Registrasi berhasil! Anda mendapatkan bonus saldo Rp150.000.", "auth");

    setTimeout(() => {
        // Auto-login after registration
        currentUser = newUser;
        currentCart = [];
        storage.saveActiveSession(newUser);
        updateUserNavUI();
        showView("dashboard");
        document.getElementById("register-form").reset();
    }, 1500);
}

function handleLogout() {
    if (currentUser) {
        // Save user cart to db before logout
        const users = storage.getUsers();
        const index = users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            users[index].cart = currentCart;
            users[index].balance = currentUser.balance;
            users[index].points = currentUser.points;
            users[index].transactions = currentUser.transactions;
            storage.saveUsers(users);
        }
        storage.clearActiveSession();
        currentUser = null;
        currentCart = [];
        updateUserNavUI();
        showView("auth");
        showAuthForm("login");
    }
}

// Alert Message Helper
function showAlert(type, message, formPrefix) {
    const alertBox = document.getElementById(`${formPrefix}-alert`);
    alertBox.className = `alert-message ${type}`;

    // SVG icons inside alerts
    let icon = "";
    if (type === "success") {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    }

    alertBox.innerHTML = `${icon} <span>${message}</span>`;
    alertBox.style.display = "flex";

    setTimeout(() => {
        alertBox.style.display = "none";
    }, 4000);
}

// ==========================================
// 5. VIEW NAVIGATION / ROUTING (SPA)
// ==========================================
function showView(viewId) {
    // Hide all views
    document.querySelectorAll(".view-section").forEach(view => {
        view.classList.remove("active-view");
    });

    // Remove active class from nav buttons
    document.querySelectorAll("[data-target-view]").forEach(btn => {
        btn.classList.remove("active");
    });

    // Handle Auth Special Redirection
    if (viewId === "auth" && currentUser) {
        viewId = "dashboard";
    }

    const activeView = document.getElementById(`${viewId}-view`);
    if (activeView) {
        activeView.classList.add("active-view");

        // Set nav button active
        const navBtn = document.querySelector(`[data-target-view="${viewId}"]`);
        if (navBtn) navBtn.classList.add("active");

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // View specific hooks
    if (viewId === "dashboard") {
        document.getElementById("dashboard-username").innerText = currentUser.username;
        document.getElementById("dash-wallet-amt").innerText = formatRupiah(currentUser.balance || 0);
        document.getElementById("dash-points").innerText = currentUser.points || 0;
    } else if (viewId === "checkout") {
        activePromo = null; // Reset promo on entering checkout
        const msgEl = document.getElementById("checkout-promo-msg");
        if (msgEl) {
            msgEl.style.display = "none";
            msgEl.className = "";
            msgEl.innerText = "";
        }
        const inputEl = document.getElementById("checkout-promo-input");
        if (inputEl) inputEl.value = "";
        renderCheckoutView();
    } else if (viewId === "promo") {
        renderPromoView();
    } else if (viewId === "history") {
        renderHistoryView();
    } else if (viewId === "profile") {
        document.getElementById("profile-name").value = currentUser.username;
        document.getElementById("profile-email").value = currentUser.email;
        document.getElementById("profile-phone").value = currentUser.phone || "";
        document.getElementById("profile-address").value = currentUser.address || "";
        document.getElementById("profile-password").value = currentUser.password;
    }
}

// ==========================================
// 6. DASHBOARD & MENU RENDERERS
// ==========================================
function renderDashboardProducts() {
    const featuredGrid = document.getElementById("featured-products-grid");
    featuredGrid.innerHTML = "";

    // Pick 3 popular/best seller products
    const featuredItems = MENU_DATA.filter(item => item.badge === "Best Seller").slice(0, 4);

    featuredItems.forEach(item => {
        featuredGrid.appendChild(createProductCard(item));
    });
}

function renderMenuProducts(category = "all", searchQuery = "") {
    const menuGrid = document.getElementById("menu-grid-items");
    menuGrid.innerHTML = "";

    let filtered = MENU_DATA;

    // Filter by Category Tab
    if (category !== "all") {
        filtered = filtered.filter(item => item.category === category);
    }

    // Filter by Search Query
    if (searchQuery) {
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (filtered.length === 0) {
        menuGrid.innerHTML = `
            <div class="glass" style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-muted);">
                <p>Tidak ada kopi yang sesuai pencarian Anda.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(item => {
        menuGrid.appendChild(createProductCard(item));
    });
}

// Create a coffee card element
function createProductCard(item) {
    const card = document.createElement("div");
    card.className = "glass glass-card coffee-card";

    let badgeHtml = item.badge ? `<span class="coffee-card-badge ${item.badge === 'Best Seller' ? 'badge-bestseller' : 'badge-new'}">${item.badge}</span>` : "";

    card.innerHTML = `
        <div class="coffee-card-img">
            ${badgeHtml}
            <div class="coffee-card-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>${item.rating}</span>
            </div>
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="coffee-card-content">
            <h3 class="coffee-card-title">${item.name}</h3>
            <p class="coffee-card-desc">${item.desc}</p>
            <div class="coffee-card-footer">
                <div class="coffee-card-price">
                    <span class="price-lbl">Harga</span>
                    <span class="price-val">${formatRupiah(item.price)}</span>
                </div>
                <button class="add-btn" aria-label="Tambah item" onclick="handleAddToCartClick('${item.id}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
        </div>
    `;
    return card;
}

// Handle switching categories
function filterMenuCategory(category, buttonEl) {
    document.querySelectorAll(".menu-tab-btn").forEach(btn => {
        btn.classList.remove("active-tab");
    });
    buttonEl.classList.add("active-tab");

    const searchVal = document.getElementById("search-menu-input").value;
    renderMenuProducts(category, searchVal);
}

// Handle search keyups
function searchMenu(query) {
    const activeTab = document.querySelector(".menu-tab-btn.active-tab");
    const category = activeTab ? activeTab.getAttribute("data-category") : "all";
    renderMenuProducts(category, query);
}

// ==========================================
// 7. CUSTOMIZATION MODAL & CART SYSTEM
// ==========================================
function handleAddToCartClick(itemId) {
    const item = MENU_DATA.find(i => i.id === itemId);
    if (!item) return;

    if (item.customizable) {
        openCustomModal(item);
    } else {
        // Direct add for non-customizable products (like snacks)
        addToCart(item, {
            size: "Regular",
            sweetness: "Normal",
            ice: "Normal",
            addons: [],
            extraCost: 0
        }, 1);

        // Show success alert in nav header or toast
        showNavToast(`Satu ${item.name} ditambahkan ke keranjang.`);
    }
}

function showNavToast(message) {
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.top = "90px";
    toast.style.right = "24px";
    toast.style.background = "rgba(181, 131, 76, 0.95)";
    toast.style.backdropFilter = "blur(8px)";
    toast.style.color = "#f7f3ed";
    toast.style.padding = "12px 24px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 8px 24px rgba(0,0,0,0.5)";
    toast.style.zIndex = "250";
    toast.style.fontFamily = "var(--font-heading)";
    toast.style.fontWeight = "600";
    toast.style.fontSize = "0.95rem";
    toast.style.animation = "fadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards";
    toast.innerText = message;

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-10px)";
        toast.style.transition = "all 0.4s";
        setTimeout(() => toast.remove(), 4000);
    }, 2500);
}

// Customization Modal Logic
function openCustomModal(item) {
    currentSelectedItem = item;

    document.getElementById("modal-item-img").src = item.image;
    document.getElementById("modal-item-title").innerText = item.name;
    document.getElementById("modal-item-desc").innerText = item.desc;

    // Reset options
    document.querySelectorAll(".option-btn[data-type]").forEach(btn => {
        if (btn.getAttribute("data-value") === "Regular" || btn.getAttribute("data-value") === "Normal") {
            btn.classList.add("selected-option");
        } else {
            btn.classList.remove("selected-option");
        }
    });

    // Render Addons
    const addonsGrid = document.getElementById("modal-addons-grid");
    addonsGrid.innerHTML = "";
    ADDONS_DATA.forEach(addon => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "addon-item";
        itemDiv.setAttribute("data-addon-id", addon.id);
        itemDiv.addEventListener("click", () => toggleAddonSelection(itemDiv, addon.price));

        itemDiv.innerHTML = `
            <div class="addon-info">
                <div class="addon-checkbox">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span class="addon-label">${addon.name}</span>
            </div>
            <span class="addon-price">+${formatRupiah(addon.price)}</span>
        `;
        addonsGrid.appendChild(itemDiv);
    });

    // Reset Quantity
    document.getElementById("modal-qty-val").innerText = "1";

    updateCustomModalPrice();
    document.getElementById("customization-modal").classList.add("active-modal");
}

function closeCustomModal() {
    document.getElementById("customization-modal").classList.remove("active-modal");
    currentSelectedItem = null;
}

function toggleAddonSelection(el, price) {
    el.classList.toggle("selected-addon");
    updateCustomModalPrice();
}

function updateCustomQty(change) {
    const qtyEl = document.getElementById("modal-qty-val");
    let currentQty = parseInt(qtyEl.innerText);
    currentQty += change;
    if (currentQty < 1) currentQty = 1;
    qtyEl.innerText = currentQty;

    updateCustomModalPrice();
}

// Calculate total price based on customizations and quantity
function calculateModalPrice() {
    if (!currentSelectedItem) return 0;

    let base = currentSelectedItem.price;
    let extra = 0;

    // Size Extra
    const selectedSize = document.querySelector('.option-btn[data-type="size"].selected-option')?.getAttribute("data-value");
    if (selectedSize === "Medium") extra += 4000;
    if (selectedSize === "Large") extra += 8000;

    // Addons Extra
    document.querySelectorAll(".addon-item.selected-addon").forEach(el => {
        const addonId = el.getAttribute("data-addon-id");
        const addon = ADDONS_DATA.find(a => a.id === addonId);
        if (addon) extra += addon.price;
    });

    const qty = parseInt(document.getElementById("modal-qty-val").innerText);
    return {
        unitPrice: base + extra,
        totalPrice: (base + extra) * qty,
        qty: qty,
        customs: {
            size: selectedSize,
            sweetness: document.querySelector('.option-btn[data-type="sweetness"].selected-option')?.getAttribute("data-value"),
            ice: document.querySelector('.option-btn[data-type="ice"].selected-option')?.getAttribute("data-value"),
            addons: Array.from(document.querySelectorAll(".addon-item.selected-addon")).map(el => {
                const add = ADDONS_DATA.find(a => a.id === el.getAttribute("data-addon-id"));
                return add ? add.name : "";
            }).filter(Boolean),
            extraCost: extra
        }
    };
}

function updateCustomModalPrice() {
    const calculations = calculateModalPrice();
    document.getElementById("modal-total-price").innerText = formatRupiah(calculations.totalPrice);
}

function handleAddCustomToCart() {
    const calcs = calculateModalPrice();
    if (!calcs) return;

    addToCart(currentSelectedItem, calcs.customs, calcs.qty);
    closeCustomModal();
    showNavToast(`${calcs.qty} ${currentSelectedItem.name} masuk keranjang.`);
}

// Add item to cart state and synchronize
function addToCart(item, customizations, qty) {
    // Generate unique signature for cart comparison
    const addonSig = customizations.addons.sort().join('|');
    const itemSig = `${item.id}-${customizations.size}-${customizations.sweetness}-${customizations.ice}-${addonSig}`;

    const existingIndex = currentCart.findIndex(cartItem => cartItem.sig === itemSig);

    if (existingIndex !== -1) {
        currentCart[existingIndex].qty += qty;
        currentCart[existingIndex].totalPrice = currentCart[existingIndex].qty * (item.price + customizations.extraCost);
    } else {
        currentCart.push({
            sig: itemSig,
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            extraCost: customizations.extraCost,
            unitPrice: item.price + customizations.extraCost,
            totalPrice: qty * (item.price + customizations.extraCost),
            qty: qty,
            customs: customizations
        });
    }

    syncCartWithSession();
    updateCartBadge();
    renderCartDrawerItems();
}

function updateCartQty(itemSig, change) {
    const index = currentCart.findIndex(i => i.sig === itemSig);
    if (index === -1) return;

    currentCart[index].qty += change;
    if (currentCart[index].qty < 1) {
        currentCart.splice(index, 1);
    } else {
        currentCart[index].totalPrice = currentCart[index].qty * currentCart[index].unitPrice;
    }

    syncCartWithSession();
    updateCartBadge();
    renderCartDrawerItems();
}

function removeCartItem(itemSig) {
    currentCart = currentCart.filter(i => i.sig !== itemSig);
    syncCartWithSession();
    updateCartBadge();
    renderCartDrawerItems();
}

function updateCartBadge() {
    const totalQty = currentCart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById("cart-badge");
    badge.innerText = totalQty;
    badge.style.display = totalQty > 0 ? "flex" : "none";
}

function syncCartWithSession() {
    if (currentUser) {
        currentUser.cart = currentCart;
        storage.saveActiveSession(currentUser);

        // Sync to registered user database
        const users = storage.getUsers();
        const index = users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            users[index].cart = currentCart;
            storage.saveUsers(users);
        }
    }
}

// Drawer Toggle
function toggleCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    drawer.classList.toggle("active-drawer");
    overlay.classList.toggle("active-overlay");
    if (drawer.classList.contains("active-drawer")) {
        renderCartDrawerItems();
    }
}

function closeCartDrawer() {
    document.getElementById("cart-drawer").classList.remove("active-drawer");
    document.getElementById("cart-overlay").classList.remove("active-overlay");
}

// Render Drawer Cart Items
function renderCartDrawerItems() {
    const container = document.getElementById("cart-items-container");
    container.innerHTML = "";

    if (currentCart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <p>Keranjang Anda kosong.<br>Pilih kopi Cafe Ray favorit Anda di menu.</p>
            </div>
        `;
        document.getElementById("cart-subtotal").innerText = formatRupiah(0);
        document.getElementById("cart-checkout-btn").disabled = true;
        return;
    }

    let subtotal = 0;
    currentCart.forEach(item => {
        subtotal += item.totalPrice;
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item-card";

        let customText = `Size: ${item.customs.size}`;
        if (item.customs.sweetness !== "Normal") customText += `, Sweet: ${item.customs.sweetness}`;
        if (item.customs.ice !== "Normal") customText += `, Ice: ${item.customs.ice}`;
        if (item.customs.addons.length > 0) customText += `<br>+ ${item.customs.addons.join(", ")}`;

        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-top">
                    <div>
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-customizations">${customText}</p>
                    </div>
                    <button class="cart-item-delete" onclick="removeCartItem('${item.sig}')" aria-label="Hapus item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
                <div class="cart-item-bottom">
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateCartQty('${item.sig}', -1)">-</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" onclick="updateCartQty('${item.sig}', 1)">+</button>
                    </div>
                    <span class="cart-item-price">${formatRupiah(item.totalPrice)}</span>
                </div>
            </div>
        `;
        container.appendChild(itemDiv);
    });

    document.getElementById("cart-subtotal").innerText = formatRupiah(subtotal);
    document.getElementById("cart-checkout-btn").disabled = false;
}

// ==========================================
// 8. CHECKOUT & PAYMENT SIMULATOR
// ==========================================
function getCartFinancials() {
    let subtotal = currentCart.reduce((sum, item) => sum + item.totalPrice, 0);

    let discount = 0;
    if (activePromo && subtotal >= (activePromo.minSpend || 0)) {
        if (activePromo.discountPercent) {
            discount = Math.round(subtotal * (activePromo.discountPercent / 100));
            if (activePromo.maxDiscount && discount > activePromo.maxDiscount) {
                discount = activePromo.maxDiscount;
            }
        } else if (activePromo.discountValue) {
            discount = activePromo.discountValue;
        }
    }

    let discountedSubtotal = subtotal - discount;
    if (discountedSubtotal < 0) discountedSubtotal = 0;

    let tax = Math.round(discountedSubtotal * 0.10); // PPN 10%
    let serviceCharge = Math.round(discountedSubtotal * 0.05); // Servis 5%
    let total = discountedSubtotal + tax + serviceCharge;
    let pointsAwarded = Math.round(total / 1000); // 1 point per 1k IDR

    return { subtotal, discount, tax, serviceCharge, total, pointsAwarded };
}

function renderCheckoutView() {
    const list = document.getElementById("checkout-summary-list");
    list.innerHTML = "";

    if (currentCart.length === 0) {
        list.innerHTML = `<p style="color: var(--text-muted);">Keranjang belanja kosong.</p>`;
        document.getElementById("pay-btn").disabled = true;
        return;
    }

    currentCart.forEach(item => {
        let customText = `Size: ${item.customs.size}`;
        if (item.customs.sweetness !== "Normal") customText += `, Sweet: ${item.customs.sweetness}`;
        if (item.customs.ice !== "Normal") customText += `, Ice: ${item.customs.ice}`;
        if (item.customs.addons.length > 0) customText += ` + ${item.customs.addons.join(", ")}`;

        const div = document.createElement("div");
        div.className = "checkout-summary-item";
        div.innerHTML = `
            <div>
                <span class="name">${item.name} <span style="color: var(--accent-gold);">x${item.qty}</span></span>
                <span class="customs">${customText}</span>
            </div>
            <span class="price">${formatRupiah(item.totalPrice)}</span>
        `;
        list.appendChild(div);
    });

    const fin = getCartFinancials();
    document.getElementById("chk-subtotal").innerText = formatRupiah(fin.subtotal);

    const promoRow = document.getElementById("chk-promo-row");
    const promoVal = document.getElementById("chk-promo-val");
    if (fin.discount > 0) {
        promoRow.style.display = "flex";
        promoVal.innerText = `-${formatRupiah(fin.discount)}`;
    } else {
        promoRow.style.display = "none";
    }

    document.getElementById("chk-tax").innerText = formatRupiah(fin.tax);
    document.getElementById("chk-service").innerText = formatRupiah(fin.serviceCharge);
    document.getElementById("chk-total").innerText = formatRupiah(fin.total);
    document.getElementById("chk-points-earn").innerText = `+${fin.pointsAwarded} Poin Poin Loyalitas`;

    // Reset payment active state
    setPaymentMethod('wallet');
    document.getElementById("pay-btn").disabled = false;
}

// Payment Choice switching
function setPaymentMethod(method) {
    document.querySelectorAll(".payment-method-btn").forEach(btn => {
        btn.classList.remove("active-method");
    });
    document.getElementById(`pay-btn-${method}`).classList.add("active-method");

    document.querySelectorAll(".payment-detail-panel").forEach(panel => {
        panel.classList.remove("active-panel");
    });
    document.getElementById(`payment-panel-${method}`).classList.add("active-panel");

    // Clear QRIS timers if running
    if (qrisInterval) {
        clearInterval(qrisInterval);
        qrisInterval = null;
    }

    const fin = getCartFinancials();

    if (method === 'wallet') {
        const walletBal = currentUser.balance || 0;
        document.getElementById("checkout-wallet-bal").innerText = formatRupiah(walletBal);

        const warning = document.getElementById("wallet-insufficient-msg");
        if (walletBal < fin.total) {
            warning.style.display = "block";
            document.getElementById("pay-btn").disabled = true;
        } else {
            warning.style.display = "none";
            document.getElementById("pay-btn").disabled = false;
        }
    } else if (method === 'qris') {
        startQRISCountdown();
        document.getElementById("pay-btn").disabled = false;
    } else if (method === 'card') {
        document.getElementById("pay-btn").disabled = false;
    }
}

// QRIS Countdown Timer
function startQRISCountdown() {
    let timeLeft = 180; // 3 minutes
    const countdownEl = document.getElementById("qris-countdown-timer");

    qrisInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        countdownEl.innerText = `${minutes}:${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(qrisInterval);
            countdownEl.innerText = "EXPIRED";
            document.getElementById("pay-btn").disabled = true;
        }
        timeLeft--;
    }, 1000);
}

// Trigger payment process
function processPayment() {
    const activeMethod = document.querySelector(".payment-method-btn.active-method")?.id.replace("pay-btn-", "");
    const financials = getCartFinancials();

    // Additional Validation for credit card
    if (activeMethod === "card") {
        const num = document.getElementById("cc-number").value.trim();
        const holder = document.getElementById("cc-holder").value.trim();
        const exp = document.getElementById("cc-expiry").value.trim();
        const cvv = document.getElementById("cc-cvv").value.trim();

        if (num.length < 19 || !holder || exp.length < 5 || cvv.length < 3) {
            alert("Silakan lengkapi data kartu kredit Anda.");
            return;
        }
    }

    // Ray Wallet validation check
    if (activeMethod === "wallet") {
        if (currentUser.balance < financials.total) {
            alert("Saldo Ray Wallet tidak mencukupi.");
            return;
        }
    }

    // Show processing screen overlay
    const overlay = document.getElementById("payment-processing-overlay");
    const spinner = document.getElementById("proc-spinner");
    const checkmark = document.getElementById("proc-checkmark-wrapper");
    const statusText = document.getElementById("proc-status-text");

    statusText.innerText = "Memproses Pembayaran...";
    spinner.style.display = "block";
    checkmark.style.display = "none";
    overlay.classList.add("active-proc");

    setTimeout(() => {
        // Successful deduction / simulation after 2 seconds
        spinner.style.display = "none";
        checkmark.style.display = "block";
        statusText.innerText = "Pembayaran Sukses!";

        // Apply changes
        if (activeMethod === "wallet") {
            currentUser.balance -= financials.total;
        }

        // Add loyalty points
        currentUser.points += financials.pointsAwarded;

        // Save order to history
        const orderId = `RAY-${Math.floor(100000 + Math.random() * 900000)}`;
        const now = new Date();
        const formattedDate = now.toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
        });

        const newOrder = {
            id: orderId,
            date: formattedDate,
            items: currentCart.map(item => `${item.name} x${item.qty}`).join(", "),
            totalPrice: financials.total,
            points: financials.pointsAwarded,
            paymentMethod: activeMethod.toUpperCase(),
            status: "Dalam Antrean", // Initial state
            timestamp: now.getTime()
        };

        currentUser.transactions = currentUser.transactions || [];
        currentUser.transactions.unshift(newOrder);

        // Reset cart and promo
        currentCart = [];
        activePromo = null;
        syncCartWithSession();
        updateCartBadge();
        updateUserNavUI();

        // Clear QRIS timer
        if (qrisInterval) {
            clearInterval(qrisInterval);
            qrisInterval = null;
        }

        // Simulating barista workflow progress
        simulateBaristaStatus(orderId);

        setTimeout(() => {
            overlay.classList.remove("active-proc");
            showView("history");
        }, 1500);

    }, 2000);
}

// Simulates real-time preparation of the coffee!
function simulateBaristaStatus(orderId) {
    // Transition 1: 'Dalam Antrean' -> 'Sedang Dibuat' (after 15 seconds)
    setTimeout(() => {
        updateOrderStatus(orderId, "Sedang Dibuat");
    }, 15000);

    // Transition 2: 'Sedang Dibuat' -> 'Siap Diambil' (after 30 seconds)
    setTimeout(() => {
        updateOrderStatus(orderId, "Siap Diambil");
    }, 30000);
}

function updateOrderStatus(orderId, newStatus) {
    // Check if user is logged in
    const users = storage.getUsers();

    // Scan all users to find order
    users.forEach(user => {
        if (user.transactions) {
            const order = user.transactions.find(o => o.id === orderId);
            if (order) {
                order.status = newStatus;

                // If it is the current logged-in user, update memory
                if (currentUser && currentUser.id === user.id) {
                    currentUser.transactions = user.transactions;
                    storage.saveActiveSession(currentUser);
                    // If history view is currently open, re-render it
                    if (document.getElementById("history-view").classList.contains("active-view")) {
                        renderHistoryView();
                    }
                }
            }
        }
    });

    storage.saveUsers(users);
}

// ==========================================
// 9. TRANSACTION HISTORY CONTROLLER
// ==========================================
function renderHistoryView() {
    const list = document.getElementById("history-items-list");
    list.innerHTML = "";

    const txs = currentUser.transactions || [];

    if (txs.length === 0) {
        list.innerHTML = `
            <div class="empty-history-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <p>Belum ada riwayat pemesanan.<br>Silakan pesan secangkir kopi Cafe Ray pertama Anda!</p>
            </div>
        `;
        return;
    }

    txs.forEach(tx => {
        const card = document.createElement("div");
        card.className = "glass glass-card history-card";

        let statusClass = "status-queue";
        if (tx.status === "Sedang Dibuat") statusClass = "status-preparing";
        if (tx.status === "Siap Diambil") statusClass = "status-completed";

        card.innerHTML = `
            <div class="history-card-left">
                <div class="history-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 8 0v1a4 4 0 0 1-4 4h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
                </div>
                <div class="history-info-details">
                    <h3>ID Pesanan: #${tx.id}</h3>
                    <p style="color: var(--text-muted); margin-bottom: 4px;">${tx.date} • ${tx.paymentMethod}</p>
                    <p style="color: var(--text-secondary);">${tx.items}</p>
                </div>
            </div>
            <div class="history-card-right">
                <div class="history-price">
                    <div>${formatRupiah(tx.totalPrice)}</div>
                    <div style="font-size: 0.75rem; color: var(--accent-gold); font-weight: 500;">+${tx.points} Poin</div>
                </div>
                <span class="history-status-badge ${statusClass}">${tx.status}</span>
            </div>
        `;
        list.appendChild(card);
    });
}

// ==========================================
// 10. WALLET TOP UP CONTROLLERS
// ==========================================
function openTopupModal() {
    // Reset values
    document.querySelectorAll(".preset-btn").forEach(btn => btn.classList.remove("selected-preset"));
    document.getElementById("topup-amount").value = "";
    document.getElementById("topup-modal").classList.add("active-modal");
}

function closeTopupModal() {
    document.getElementById("topup-modal").classList.remove("active-modal");
}

function processTopup() {
    const amtInput = document.getElementById("topup-amount").value;
    const amount = parseInt(amtInput);

    if (isNaN(amount) || amount <= 0) {
        alert("Masukkan jumlah pengisian saldo yang valid.");
        return;
    }

    // Top up balance simulation
    currentUser.balance = (currentUser.balance || 0) + amount;

    // Save to databases
    storage.saveActiveSession(currentUser);
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        users[index].balance = currentUser.balance;
        storage.saveUsers(users);
    }

    updateUserNavUI();

    // If checkout view is active and we just topped up, re-render financials & validation
    if (document.getElementById("checkout-view").classList.contains("active-view")) {
        renderCheckoutView();
    }

    // If dashboard is active, re-render balance
    if (document.getElementById("dashboard-view").classList.contains("active-view")) {
        document.getElementById("dash-wallet-amt").innerText = formatRupiah(currentUser.balance);
    }

    closeTopupModal();
    alert(`Top-up sukses! Saldo berhasil ditambahkan sebesar ${formatRupiah(amount)}.`);
}

// ==========================================
// 11. USER PROFILE CONTROLLER
// ==========================================
function handleProfileUpdate(e) {
    e.preventDefault();
    const name = document.getElementById("profile-name").value.trim();
    const phone = document.getElementById("profile-phone").value.trim();
    const address = document.getElementById("profile-address").value.trim();
    const password = document.getElementById("profile-password").value;

    currentUser.username = name;
    currentUser.phone = phone;
    currentUser.address = address;
    currentUser.password = password;

    // Sync to active user session
    storage.saveActiveSession(currentUser);

    // Sync to registered user database
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        users[index].username = name;
        users[index].phone = phone;
        users[index].address = address;
        users[index].password = password;
        storage.saveUsers(users);
    }

    updateUserNavUI();
    showAlert("success", "Profil Anda berhasil diperbarui!", "profile");
}

// ==========================================
// 12. PROMO & COUPON CONTROLLER
// ==========================================
function renderPromoView() {
    const grid = document.getElementById("promos-list-grid");
    grid.innerHTML = "";

    PROMO_DATA.forEach(promo => {
        const card = document.createElement("div");
        card.className = "glass glass-card coffee-card";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.padding = "24px";
        card.style.justifyContent = "space-between";

        let discountText = "";
        if (promo.discountPercent) {
            discountText = `${promo.discountPercent}% OFF`;
        } else if (promo.discountValue) {
            discountText = `-${formatRupiah(promo.discountValue)}`;
        }

        card.innerHTML = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                    <span class="coffee-card-badge badge-bestseller" style="position: static; font-size: 1.1rem; padding: 6px 12px;">${discountText}</span>
                    <span style="font-size: 0.75rem; color: var(--accent-gold); font-weight: 700; text-transform: uppercase;">Kode: ${promo.code}</span>
                </div>
                <h3 class="coffee-card-title" style="margin-bottom: 8px;">${promo.name}</h3>
                <p class="coffee-card-desc" style="margin-bottom: 20px; font-size: 0.9rem; -webkit-line-clamp: 3;">${promo.desc}</p>
            </div>
            <div style="border-top: 1px dashed var(--glass-border); padding-top: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                <div style="font-size: 0.8rem; color: var(--text-muted);">
                    Min. Belanja: <span style="color: var(--text-secondary); font-weight: 600;">${formatRupiah(promo.minSpend)}</span>
                </div>
                <button class="btn-primary" id="copy-btn-${promo.code}" onclick="copyPromoCode('${promo.code}')" style="padding: 8px 16px; font-size: 0.85rem; border-radius: var(--radius-sm); font-weight: 600; box-shadow: none;">
                    Salin Kode
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function copyPromoCode(code) {
    const btn = document.getElementById(`copy-btn-${code}`);

    // Clipboard API Copy
    navigator.clipboard.writeText(code).then(() => {
        // Visual feedback on button
        const originalText = btn.innerText;
        btn.innerText = "Tersalin!";
        btn.style.background = "var(--accent-success)";
        btn.style.borderColor = "var(--accent-success)";

        showNavToast(`Kode kupon "${code}" disalin ke clipboard.`);

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "";
            btn.style.borderColor = "";
        }, 2000);
    }).catch(err => {
        console.error("Gagal menyalin kode: ", err);
        alert(`Gagal menyalin kode otomatis. Kode kupon Anda: ${code}`);
    });
}

function applyPromoCode() {
    const inputEl = document.getElementById("checkout-promo-input");
    const msgEl = document.getElementById("checkout-promo-msg");
    const code = inputEl.value.trim().toUpperCase();

    if (!code) {
        msgEl.style.display = "block";
        msgEl.className = "alert-message error";
        msgEl.style.padding = "8px 12px";
        msgEl.innerHTML = "Silakan masukkan kode promo.";
        activePromo = null;
        renderCheckoutView();
        return;
    }

    const matched = PROMO_DATA.find(p => p.code === code);

    if (!matched) {
        msgEl.style.display = "block";
        msgEl.className = "alert-message error";
        msgEl.style.padding = "8px 12px";
        msgEl.innerHTML = "Kode promo tidak valid.";
        activePromo = null;
        renderCheckoutView();
        return;
    }

    const financials = getCartFinancials(); // gets subtotal first
    if (financials.subtotal < matched.minSpend) {
        msgEl.style.display = "block";
        msgEl.className = "alert-message error";
        msgEl.style.padding = "8px 12px";
        msgEl.innerHTML = `Minimal belanja untuk promo ini adalah ${formatRupiah(matched.minSpend)}.`;
        activePromo = null;
        renderCheckoutView();
        return;
    }

    // Success applying coupon code
    activePromo = matched;
    renderCheckoutView(); // Re-render totals with discount

    // Dynamic Wallet Check re-run
    const updatedFin = getCartFinancials();
    const activeMethod = document.querySelector(".payment-method-btn.active-method")?.id.replace("pay-btn-", "");
    if (activeMethod === "wallet") {
        setPaymentMethod("wallet");
    }

    msgEl.style.display = "block";
    msgEl.className = "alert-message success";
    msgEl.style.padding = "8px 12px";

    let benefitText = "";
    if (matched.discountPercent) benefitText = `Diskon ${matched.discountPercent}%`;
    if (matched.discountValue) benefitText = `Potongan ${formatRupiah(matched.discountValue)}`;

    msgEl.innerHTML = `Kupon <strong>${matched.code}</strong> berhasil digunakan! (${benefitText})`;
}
