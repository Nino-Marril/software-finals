const menuData = [
  {
    id: 1,
    name: "Pork Siomai",
    category: "pork",
    description: "Juicy steamed pork siomai served with chili garlic sauce.",
    price: 45.00,
    stock: 100,
    image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf"
  },
  {
    id: 2,
    name: "Chicken Rice Bowl",
    category: "chicken",
    description: "Warm rice bowl with chicken toppings and savory sauce.",
    price: 99.00,
    stock: 80,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"
  },
  {
    id: 3,
    name: "Special Batchoy",
    category: "pork",
    description: "Hot noodle soup with pork, egg, and flavorful broth.",
    price: 85.00,
    stock: 50,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624"
  },
  {
    id: 4,
    name: "Iced Tea",
    category: "drinks",
    description: "Refreshing house-blend iced tea.",
    price: 35.00,
    stock: 120,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc"
  },
  {
    id: 5,
    name: "Pork Siomai",
    category: "pork",
    description: "Juicy steamed pork siomai served with chili garlic sauce.",
    price: 45.00,
    stock: 100,
    image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf"
  },
  {
    id: 6,
    name: "Chicken Rice Bowl",
    category: "chicken",
    description: "Warm rice bowl with chicken toppings and savory sauce.",
    price: 99.00,
    stock: 80,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"
  },
  {
    id: 7,
    name: "Special Batchoy",
    category: "pork",
    description: "Hot noodle soup with pork, egg, and flavorful broth.",
    price: 85.00,
    stock: 50,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624"
  },
  {
    id: 8,
    name: "Iced Tea",
    category: "drinks",
    description: "Refreshing house-blend iced tea.",
    price: 35.00,
    stock: 120,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc"
  },
  {
    id: 9,
    name: "Fish Fillet",
    category: "fish",
    description: "Crispy golden-brown white fish fillet served with tartar sauce.",
    price: 120.00,
    stock: 60,
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975"
  },
  {
    id: 10,
    name: "Fried Bangus",
    category: "fish",
    description: "Crispy fried milkfish marinated in vinegar, garlic, and peppercorns.",
    price: 150.00,
    stock: 40,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    id: 11,
    name: "Grilled Tilapia",
    category: "fish",
    description: "Freshly grilled tilapia seasoned with herbs and spices.",
    price: 135.00,
    stock: 45,
    image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6"
  },
  {
    id: 12,
    name: "Sinigang na Isda",
    category: "fish",
    description: "Traditional Filipino sour soup with fish and fresh local vegetables.",
    price: 165.00,
    stock: 30,
    image: "https://images.unsplash.com/photo-1626509135522-646d6767233e"
  }
];
/**
 * Renders the menu cards into the grid
 */
function renderCards(data) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  if (!data || data.length === 0) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="text-center text-muted py-5">
          <h5 class="fw-bold">No items found</h5>
          <p class="mb-0">Try a different search or category.</p>
        </div>
      </div>`;
    return;
  }

  grid.innerHTML = data.map(item => {
    const id = item.product_id || item.id;
    const price = Number(item.price || 0).toFixed(2);
    const image = item.image_url || item.image || item.img
      || `https://picsum.photos/seed/paldo-${id || item.name}/640/400`;
    const category = item.category || 'menu';
    const description = item.description || item.desc || '';
    return `
    <div class="col">
      <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden menu-card-hover">
        <img src="${image}" onerror="this.onerror=null;this.src='https://picsum.photos/seed/paldo-${id || 'fallback'}/640/400';" class="card-img-top" alt="${item.name}" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title fw-bold mb-0">${item.name}</h5>
            <span class="badge bg-primary-subtle text-primary rounded-pill px-3 text-capitalize">${category}</span>
          </div>
          <p class="card-text text-muted small flex-grow-1">${description}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <span class="fs-5 fw-bold text-orange">₱${price}</span>
            <button class="btn btn-primary rounded-pill px-3 btn-sm" onclick="addToCart(${id})">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

/**
 * Updates the cart badge count in the navbar
 */
function updateCartBadge(cartItems = []) {
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.innerText = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

/**
 * Adds an item to the localStorage cart
 */
// frontend/js/menu_search.js

async function addToCart(id) {
  try {
    const response = await fetch("http://localhost:3000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ← ADD THIS
      body: JSON.stringify({ product_id: id, quantity: 1 }),
    });

    if (response.ok) {
      await syncCartFromDB();
    } else if (response.status === 401) {
      alert("Please login to save your cart!");
    }
  } catch (err) {
    console.error("Database sync failed:", err);
  }
}

async function syncCartFromDB() {
  try {
    const response = await fetch("http://localhost:3000/api/cart", {
      credentials: "include", // ← ADD THIS
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('paldo_cart', JSON.stringify(data.cartItems));
      updateCartBadge(data.cartItems);
    }
  } catch (err) {
    console.log("Could not sync cart.");
  }
}

/**
 * Filters the displayed menu by category
 */
function filterMenu(category, element) {
  const buttons = document.querySelectorAll('.btn-outline-primary');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (element) {
    element.classList.add('active');
  }

  const filtered = category === 'all' 
    ? menuData 
    : menuData.filter(item => item.category === category);
  
  renderCards(filtered);
}

/**
 * Initialization on page load
 */
// Update your DOMContentLoaded in menu_search.js
document.addEventListener('DOMContentLoaded', async () => {

  let currentProducts = [];
  const category = (window.MENU_CATEGORY || "").toLowerCase().trim();
  const apiUrl = category
    ? `http://localhost:3000/api/products?category=${encodeURIComponent(category)}`
    : "http://localhost:3000/api/products";

  try {

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.success) {
      currentProducts = data.products;
      renderCards(currentProducts);
    }

  } catch (err) {

    // fallback if backend fails
    currentProducts = category
      ? menuData.filter(item => item.category === category)
      : menuData;
    renderCards(currentProducts);

  }

  // SEARCH FUNCTIONALITY
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {

    searchInput.addEventListener("input", () => {

      const value = searchInput.value.toLowerCase();

      const filteredProducts = currentProducts.filter(item =>

        item.name.toLowerCase().includes(value) ||

        (item.description || item.desc)
          .toLowerCase()
          .includes(value)

      );

      renderCards(filteredProducts);

    });

  }

  syncCartFromDB();

});