// ===== Utility Functions =====
function getCurrentPage() {
  return window.location.pathname.split("/").pop().split(".")[0].toLowerCase();
}

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

function getCart(user) {
  if (user && user.email) {
    return JSON.parse(localStorage.getItem(`cart-${user.email}`)) || [];
  }
  return JSON.parse(localStorage.getItem("activeCart")) || [];
}

function saveCart(cart, user) {
  if (user && user.email) {
    localStorage.setItem(`cart-${user.email}`, JSON.stringify(cart));
  } else {
    localStorage.setItem("activeCart", JSON.stringify(cart));
  }
}

// ===== Add to Cart Function =====
function addToCart(productName, price, imageUrl = '', code = '', options = '') {
  const user = getLoggedInUser();
  const cart = getCart(user);

  // Check if item already exists → increment quantity
  const existing = cart.find(item => item.name === productName && item.options === options);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name: productName, price, image: imageUrl, quantity: 1, code, options });
  }

  saveCart(cart, user);
  alert(`${productName} has been added to your cart.`);
}

// ===== Nav Highlighting =====
function highlightActiveNav() {
  const currentPage = getCurrentPage();
  document.querySelectorAll(".nav-item").forEach(item => {
    const section = item.getAttribute("data-name")?.toLowerCase();
    if (section === currentPage) {
      item.classList.add("active");
    }
  });
}

// ===== Auth UI Update =====
function updateNavUI() {
  const user = getLoggedInUser();
  const topRight = document.querySelector(".top-right");
  if (user && topRight) {
    topRight.innerHTML = `
      Welcome, ${user.username} 
      <a href="#" onclick="logout()">Logout</a>
    `;
  }
}

// ===== Logout Function =====
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// ===== On Page Load =====
window.addEventListener("DOMContentLoaded", () => {
  updateNavUI();
  highlightActiveNav();
});

window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("csmsLoggedInUser"));

  if (user) {
    const topRight = document.getElementById("userStatus");
    topRight.innerHTML = `
      Welcome, <strong>${user.firstName}</strong> 
      &nbsp; | <a href="#" onclick="logout()">Logout</a>
    `;
  }
});

  function logout() {
    localStorage.removeItem("csmsLoggedInUser");
    window.location.href = "signin.html";
  }

  function toggleDescription(card) {
    const desc = card.querySelector('.product-description');
    desc.classList.toggle('visible');
  }

  function addToCart(productName, price, imageUrl = '', code = '', options = '') {
    const cart = JSON.parse(localStorage.getItem("activeCart")) || [];

    // Check if product is already in the cart
    const existingItem = cart.find(item => item.name === productName && item.options === options);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: productName,
        price,
        image: imageUrl,
        quantity: 1,
        code,
        options
      });
    }

    localStorage.setItem("activeCart", JSON.stringify(cart));
    alert(`✅ "${productName}" added to your cart.`);
  }

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("activeCart")) || [];
    const cartItems = document.getElementById("cartItems");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, i) => {
      const price = parseFloat(item.price);
      const qty = item.quantity || 1;
      const subtotal = price * qty;
      total += subtotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="item-info">
          <img src="${item.image || 'placeholder.png'}" alt="Product">
          <div>
            <p class="item-title">${item.name}</p>
            <p>Item#: ${item.code || 'N/A'}</p>
            <p><strong>Options:</strong> ${item.options || 'Standard'}</p>
          </div>
        </td>
        <td>$${price.toFixed(2)}</td>
        <td><input type="number" value="${qty}" min="1" onchange="updateQty(${i}, this.value)" /></td>
        <td>$${subtotal.toFixed(2)}</td>
      `;
      cartItems.appendChild(row);
    });

    subtotalEl.textContent = `$${total.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  function updateQty(index, newQty) {
    const cart = JSON.parse(localStorage.getItem("activeCart")) || [];
    cart[index].quantity = parseInt(newQty);
    localStorage.setItem("activeCart", JSON.stringify(cart));
    loadCart();
  }

  function clearCart() {
    localStorage.removeItem("activeCart");
    loadCart();
  }

  // Load the cart on page load
  loadCart();