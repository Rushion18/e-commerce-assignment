async function fetchProducts(category = null) {
    let apiUrl = 'https://fakestoreapi.com/products';

    if (category) {
        apiUrl = `https://fakestoreapi.com/products/category/${category}`;
    }

    const response = await fetch(apiUrl);
    const products = await response.json();
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img class="product-image" src="${product.image}" alt="${product.title}">
            <h2 class="product-title">${product.title}</h2>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-category">${product.category}</p>
            <button onclick="showProductDetails(${product.id})">Details</button>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;

        productList.appendChild(productCard);
    });
}

// Fetch and display product details
async function fetchProductDetails(productId) {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    const product = await response.json();
    const productDetails = document.getElementById('product-details');
    productDetails.style.display = 'block';
    productDetails.innerHTML = `
        <h2>${product.title}</h2>
        <img class="product-image" src="${product.image}" alt="${product.title}">
        <p>${product.description}</p>
    `;
}

// Show product details when the user clicks on the product
function showProductDetails(productId) {
    fetchProductDetails(productId);
}

// Cart functionality
let cart = [];

function addToCart(productId) {
    const product = cart.find((item) => item.id === productId);

    if (product) {
        product.quantity++;
    } else {
        const productToAdd = { id: productId, quantity: 1 };
        cart.push(productToAdd);
    }

    updateCart();
}

function removeFromCart(productId) {
    const productIndex = cart.findIndex((item) => item.id === productId);

    if (productIndex >= 0) {
        cart[productIndex].quantity--;

        if (cart[productIndex].quantity === 0) {
            cart.splice(productIndex, 1);
        }
    }

    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let grandTotal = 0;

    cart.forEach((item) => {
        const product = products.find((product) => product.id === item.id);
        grandTotal += product.price * item.quantity;

        const cartItem = document.createElement('li');
        cartItem.innerHTML = `${product.title} x${item.quantity} $${(product.price * item.quantity).toFixed(2)}`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFromCart(item.id);
        cartItem.appendChild(removeButton);
        cartItems.appendChild(cartItem);
    });

    const grandTotalElement = document.getElementById('grand-total');
    grandTotalElement.textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
}


document.getElementById('all-products').addEventListener('click', () => fetchProducts());
document.getElementById('electronics').addEventListener('click', () => fetchProducts('electronics'));
document.getElementById('jewelery').addEventListener('click', () => fetchProducts('jewelery'));

// Add event listeners for cart buttons
document.getElementById('clear-cart').addEventListener('click', clearCart);

// Fetch and display all products initially
fetchProducts();



function updateQuantity(productId) {
    const input = document.getElementById(`quantity-${productId}`);
    return input ? parseInt(input.value) : 1;
}

function addToCart(productId) {
    const product = cart.find((item) => item.id === productId);

    if (product) {
        product.quantity += updateQuantity(productId);
    } else {
        const productToAdd = { id: productId, quantity: updateQuantity(productId) };
        cart.push(productToAdd);
    }

    updateCart();
}



// Update the quantity input fields when fetching products
function createProductCard(product) {
    // ... (existing content)

    productCard.innerHTML = `
        <!-- ... (existing content) -->
        <input type="number" min="1" value="1" id="quantity-${product.id}">
        <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;

    productList.appendChild(productCard);
}


// Inside the createProductCard function
const quantityInput = productCard.querySelector(`#quantity-${product.id}`);
quantityInput.addEventListener('input', () => {
    const productId = product.id;
    const product = cart.find((item) => item.id === productId);
    if (product) {
        product.quantity = updateQuantity(productId);
        updateCart();
    }
});
