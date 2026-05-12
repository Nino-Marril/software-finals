document.addEventListener("DOMContentLoaded", () => {
  fetch("html/navbar.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar-placeholder").innerHTML = data;
      highlightActivePage();
      refreshCartBadge();
    })
    .catch(error => console.error("Error loading the navbar:", error));
});

function updateCartBadgeFromItems(cartItems = []) {
  const badge = document.getElementById("cart-count");
  if (!badge) return;

  const count = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  badge.innerText = count;
  badge.style.display = count > 0 ? "inline-block" : "none";
}

async function refreshCartBadge() {
  try {
    const response = await fetch("http://localhost:3000/api/cart", {
      credentials: "include",
    });

    if (!response.ok) {
      updateCartBadgeFromItems([]);
      return;
    }

    const data = await response.json();
    updateCartBadgeFromItems(data.cartItems || []);
  } catch (error) {
    console.error("Could not refresh cart badge:", error);
  }
}

window.updateCartBadgeFromItems = updateCartBadgeFromItems;
window.refreshCartBadge = refreshCartBadge;

function highlightActivePage() {
  const path = window.location.pathname;
  const page = path.split("/").pop();

  let activeEl = null;

  if (page === "menu.html") {
    activeEl = document.getElementById("nav-all");
  } else if (page === "fish_list.html") {
    activeEl = document.getElementById("nav-fish");
  } else if (page === "chicken.html") {
    activeEl = document.getElementById("nav-chicken");
  } else if (page === "pork.html") {
    activeEl = document.getElementById("nav-pork");
  } else if (page === "beef.html") {
    activeEl = document.getElementById("nav-beef");
  } else if (page === "cart.html") {
    activeEl = document.getElementById("nav-cart");
  }

  if (activeEl) {
    activeEl.classList.add("active", "fw-bold");
  }
}