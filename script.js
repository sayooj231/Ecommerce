const products = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 2999,
    img: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg"
  },
  {
    id: 2,
    name: "Smartwatch",
    price: 8999,
    img: "https://images.pexels.com/photos/2861929/pexels-photo-2861929.jpeg"
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 15599,
    img: "https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg"
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 3499,
    img: "https://images.pexels.com/photos/19090/pexels-photo.jpg"
  },
  {
    id: 5,
    name: "Backpack",
    price: 1799,
    img: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg"
  }
];

let cart = [];

const productList = document.getElementById("product-list");
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");

// 🛒 Update Cart Count
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalItems;
}

// 🛍️ Display Products
function displayProducts(productsArray) {
  productList.innerHTML = "";
  productsArray.map(product => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card product-card h-100 shadow-sm">
        <img src="${product.img}" class="card-img-top" alt="${product.name}" />
        <div class="card-body text-center">
          <h5 class="card-title fw-bold">${product.name}</h5>
          <p class="card-text text-muted">₹${product.price}</p>
          <button class="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    `;
    productList.appendChild(card);

    // 🖱️ Click image to open details modal
    card.querySelector("img").addEventListener("click", () => showProductDetails(product));
    
    // 🛒 Add to cart button
    const addButton = card.querySelector("button");
    addButton.addEventListener("click", () => {
      const existing = cart.find(p => p.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      updateCartCount();
    });
    
  });
}

// 🛍️ Render Cart Items
function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("cart-total").textContent = "Total: ₹0";
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="d-flex justify-content-between align-items-center border-bottom py-2">
      <div>
        <strong>${item.name}</strong><br>₹${item.price}
      </div>
      <div class="d-flex align-items-center">
        <button class="btn btn-sm btn-outline-secondary me-1" onclick="changeQuantity(${item.id}, -1)">−</button>
        <span>${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary ms-1" onclick="changeQuantity(${item.id}, 1)">+</button>
      </div>
      <div>Subtotal: ₹${item.price * item.quantity}</div>
      <button class="btn btn-sm btn-danger ms-3" onclick="removeItem(${item.id})">Remove</button>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cart-total").textContent = `Total: ₹${total}`;
}

// 🔄 Quantity Change
function changeQuantity(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }
  updateCartCount();
  renderCart();
}

// ❌ Remove Item
function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  updateCartCount();
  renderCart();
}

// 🛒 Open Cart Modal
document.getElementById("cart-button").addEventListener("click", () => {
  renderCart();
  const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
  cartModal.show();
});

// 💰 Checkout Button
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  alert(`Thank you for shopping with NeoKart!\nYour total is ₹${total}.\nProceeding to checkout...`);
  cart = [];
  updateCartCount();
  renderCart();
});

// 🔍 Search Button
const btn = document.getElementById("btn1");
const searchinput = document.getElementById("searchinput");

// 🧾 Show Product Details in Modal
function showProductDetails(product) {
  document.getElementById("modal-img").src = product.img;
  document.getElementById("modal-name").textContent = product.name;
  document.getElementById("modal-price").textContent = `₹${product.price}`;
  document.getElementById("modal-desc").textContent = "High-quality product, carefully selected for NeoKart customers.";
  
  // Handle Add to Cart button inside modal
  const addBtn = document.getElementById("modal-add");
  addBtn.onclick = () => {
    const existing = cart.find(p => p.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    alert(`${product.name} added to your cart!`);
  };

  const productModal = new bootstrap.Modal(document.getElementById("productModal"));
  productModal.show();
}


displayProducts(products);

// Filter products when search is clicked
btn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchText = searchinput.value.toLowerCase().trim();
  const filtered = products.filter(p => p.name.toLowerCase().includes(searchText));
  displayProducts(filtered);

  if (filtered.length === 0) {
    productList.innerHTML = `<p class="text-danger fs-5 text-center">No products found!</p>`;
  }
});
