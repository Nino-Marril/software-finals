async function loadCart() {
  const tableBody = document.getElementById('cartTableBody');
  const emptyMsg = document.getElementById('emptyCartMsg');

  try {
    const response = await fetch("http://localhost:3000/api/cart", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();
    const cart = data.cartItems || [];

    if (cart.length === 0) {
      tableBody.innerHTML = '';
      emptyMsg.classList.remove('d-none');
      updateTotals(0);
      return;
    }

    emptyMsg.classList.add('d-none');
    let totalAmount = 0;

    tableBody.innerHTML = cart.map(item => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;
      return `
        <tr>
          <td><p class="mb-0 fw-bold">${item.name}</p></td>
          <td>₱${item.price}</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-sm btn-outline-secondary rounded-circle"
                onclick="changeQty(${item.cart_id}, -1)">-</button>
              <span>${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary rounded-circle"
                onclick="changeQty(${item.cart_id}, 1)">+</button>
            </div>
          </td>
          <td class="fw-bold">₱${itemTotal}</td>
          <td>
            <button class="btn btn-sm text-danger"
              onclick="removeItem(${item.cart_id})">Remove</button>
          </td>
        </tr>`;
    }).join('');

    updateTotals(totalAmount);
  } catch (err) {
    console.error("Failed to load cart:", err);
  }
}

// In cart.js — updated changeQty and removeItem
async function changeQty(cartId, delta) {
  await fetch(`http://localhost:3000/api/cart/${cartId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ delta }),
  });
  loadCart();
}

async function removeItem(cartId) {
  await fetch(`http://localhost:3000/api/cart/${cartId}`, {
    method: "DELETE",
    credentials: "include",
  });
  loadCart();
}

function updateTotals(total) {
  document.getElementById('subtotal').innerText = `₱${total}`;
  document.getElementById('grandTotal').innerText = `₱${total}`;
}

function checkout() {
  const rows = document.querySelectorAll('#cartTableBody tr');
  if (rows.length === 0) return alert("Your cart is empty!");
  alert("Thank you for your order! Checkout functionality coming soon.");
}

document.addEventListener('DOMContentLoaded', loadCart);