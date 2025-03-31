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


  /////////
  // Auto-format credit card input
const cardInput = document.getElementById("cardNumber");
cardInput.addEventListener("input", (e) => {
  let val = e.target.value.replace(/\D/g, "").substring(0, 16); // max 16 digits
  let formatted = val.replace(/(.{4})/g, "$1 ").trim();
  e.target.value = formatted;
});

// Enter key to move to next input
const inputs = document.querySelectorAll("input");
inputs.forEach((input, index) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = inputs[index + 1];
      if (next) next.focus();
    }
  });
});

// Submit with loading and confirmation
document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("confirmation").classList.add("hidden");

  setTimeout(() => {
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("confirmation").classList.remove("hidden");
  }, 2000); // simulate 2 seconds processing
});


///////
  const currencySelect = document.getElementById('currency-select');
  const prices = document.querySelectorAll('.price');

  currencySelect.addEventListener('change', () => {
    const currency = currencySelect.value;

    prices.forEach(priceEl => {
      const usdValue = parseFloat(priceEl.getAttribute('data-usd'));

      if (currency === 'AED') {
        const converted = (usdValue * 3.66).toFixed(2);
        priceEl.textContent = `د.إ ${converted}`;
      } else {
        priceEl.textContent = `$${usdValue.toFixed(2)}`;
      }
    });
  });

  function performSearch() {
    const input = document.getElementById("searchInput");
    const query = input.value.trim().toLowerCase();

    console.log("Searching for:", query); // 🐞 Debug output

    const routes = {
      science: "science.html",
      technology: "technology.html",
      engineering: "engineering.html",
      mathematics: "mathematics.html"
    };

    for (let keyword in routes) {
      if (query.includes(keyword)) {
        console.log("Redirecting to:", routes[keyword]); // 🐞
        window.location.href = routes[keyword];
        return;
      }
    }

    alert("No results found.");
  }

  // Trigger search on Enter
  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("searchInput");

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        performSearch();
      }
    });
  });

  /*trial*/
  function loadCartItems() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const cartKey = user ? `cart-${user.email}` : "activeCart";
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  
    const tbody = document.getElementById("cartItems");
    tbody.innerHTML = ""; // Clear previous rows
  
    let total = 0;
  
    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
  
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="item-info">
          <img src="${item.image || 'placeholder.png'}" alt="${item.name}" style="width:50px;height:50px;margin-right:10px;" />
          <div>
            <p class="item-title">${item.name}</p>
            ${item.code ? `<p>Item#: ${item.code}</p>` : ""}
            ${item.options ? `<p><strong>Options:</strong> ${item.options}</p>` : ""}
          </div>
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)"></td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><button onclick="removeItemFromCart(${index})" class="delete-btn">Delete</button></td>
      `;
      tbody.appendChild(row);
    });
  
    document.getElementById("subtotal").textContent = `$${total.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
  }
  

  function removeItemFromCart(index) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const cartKey = user ? `cart-${user.email}` : "activeCart";
  
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    cart.splice(index, 1); // Remove 1 item at index
    localStorage.setItem(cartKey, JSON.stringify(cart));
  
    loadCartItems(); // Refresh table
  }
  