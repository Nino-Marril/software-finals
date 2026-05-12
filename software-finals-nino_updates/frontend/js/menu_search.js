const menuData = [
  // BEEF CATEGORY
  { 
    id: 1, 
    name: "Beef Tapa", 
    category: "beef", 
    price: 150, 
    desc: "Traditional Filipino cured beef served with a sweet and salty glaze.", 
    img: "https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&w=400" 
  },
  { 
    id: 2, 
    name: "Beef Caldereta", 
    category: "beef", 
    price: 160, 
    desc: "Hearty beef stew simmered in rich tomato sauce and liver spread.", 
    img: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=400&q=80" 
  },

  // PORK CATEGORY
  { 
    id: 3, 
    name: "Lechon Kawali", 
    category: "pork", 
    price: 150, 
    desc: "Crispy deep-fried pork belly that crackles with every single bite.", 
    img: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: 4, 
    name: "Pork Siomai", 
    category: "pork", 
    price: 80, 
    desc: "Steamed savory pork dumplings served with spicy chili garlic oil.", 
    img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=400&q=80" 
  },

  // CHICKEN CATEGORY
  { 
    id: 5, 
    name: "Chicken Adobo", 
    category: "chicken", 
    price: 120, 
    desc: "The classic Filipino favorite: chicken braised in soy sauce and vinegar.", 
    img: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: 6, 
    name: "Chicken Inasal", 
    category: "chicken", 
    price: 140, 
    desc: "Grilled chicken marinated in lemongrass, calamansi, and annatto oil.", 
    img: "https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=400" 
  },

  // EXTRA ITEMS
  { 
    id: 7, 
    name: "Special Batchoy", 
    category: "pork", 
    price: 130, 
    desc: "Iloilo's famous noodle soup with pork offal, crushed chicharon, and beef loin.", 
    img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80" 
  }
];

/**
 * Renders the menu cards into the grid
 */
function renderCards(data) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  grid.innerHTML = data.map(item => `
    <div class="col">
      <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden menu-card-hover">
        <img src="${item.image_url || item.img}" class="card-img-top" alt="${item.name}" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title fw-bold mb-0">${item.name}</h5>
            <span class="badge bg-primary-subtle text-primary rounded-pill px-3 text-capitalize">${item.category}</span>
          </div>
          <p class="card-text text-muted small flex-grow-1">${item.description || item.desc}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <span class="fs-5 fw-bold text-orange">₱${item.price}</span>
            <button class="btn btn-primary rounded-pill px-3 btn-sm" onclick="addToCart(${item.product_id || item.id})">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
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

  try {

    const response = await fetch("http://localhost:3000/api/products");
    const data = await response.json();

    if (data.success) {
      currentProducts = data.products;
      renderCards(currentProducts);
    }

  } catch (err) {

    // fallback if backend fails
    currentProducts = menuData;
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