document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");
  const menuGrid = document.getElementById("menuGrid");

  if (!searchInput) {
    console.error("searchInput not found in HTML");
    return;
  }

function renderMenu(menuItems) {
  const menuGrid = document.getElementById("menuGrid");

  if (!menuGrid) {
    console.error("menuGrid not found");
    return;
  }

  menuGrid.innerHTML = menuItems.map(item => `
    <div class="menu-card">
      <img class="menu-image" src="${item.image_url}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <p>₱${item.price}</p>
    </div>
  `).join("");
}

async function loadMenu() {
  const res = await fetch("http://localhost:3000/api/menu");
  const data = await res.json();

  renderMenu(data.menu || []);
}

searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.trim();

  if (query === "") {
    loadMenu();
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/menu/search?q=${encodeURIComponent(query)}`);

    if (!res.ok) {
      console.error("API error:", res.status);
      return;
    }

    const data = await res.json();

    // SAFE fallback in case menu is missing
    renderMenu(data.menu || []);

  } catch (err) {
    console.error("Fetch failed:", err);
  }
  });

});