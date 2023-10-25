// script.js
document.addEventListener("DOMContentLoaded", () => {
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const productsContainer = document.getElementById("products");
    const categories = document.querySelectorAll(".category");
    const cartSummary = document.querySelector(".cart-summary");
    const clearCartButton = document.getElementById("clear-cart");
    const apiUrl = 'https://fakestoreapi.com/products';
    let cart = [];
    
    // Fetch products from Fake Store API
    function fetchProducts(category) {
        let apiUrl = "https://fakestoreapi.com/products";
        if (category !== "all") {
            apiUrl += `/category/${category}`;
        }
        
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                displayProducts(data);
            });
    }

    // Display products in the product grid
    function displayProducts(products) {
        productsContainer.innerHTML = "";
        products.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}" />
                <h3>${product.title}</h3>
                <p>${product.category}</p>
                <p class="price">$${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    // Add product to the cart
    function addToCart(product) {
        cart.push(product);
        updateCart();
    }

    // Update cart information
    function updateCart() {
        const itemCount = cart.length;
        const total = cart.reduce((acc, product) => acc + product.price, 0);
        cartCount.textContent = itemCount;
        cartTotal.textContent = total.toFixed(2);
        renderCartItems();
    }

    // Render cart items
    function renderCartItems() {
        const cartItemsList = document.getElementById("cart-items");
        cartItemsList.innerHTML = "";
        cart.forEach((item) => {
            const cartItem = document.createElement("li");
            cartItem.innerHTML = `${item.title} - $${item.price}`;
            cartItemsList.appendChild(cartItem);
        });
        const grandTotal = cart.reduce((total, item) => total + item.price, 0);
        document.getElementById("cart-grand-total").textContent = grandTotal.toFixed(2);
    }

    // Clear Cart
    function clearCart() {
        cart = [];
        updateCart();
    }

    // Add event listeners for category buttons
    categories.forEach((category) => {
        category.addEventListener("click", (e) => {
            const selectedCategory = e.target.getAttribute("data-category");
            fetchProducts(selectedCategory);
        });
    });

    // Add to cart button functionality
    productsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            const productId = e.target.getAttribute("data-id");
            const product = products.find((p) => p.id == productId);
            if (product) {
                addToCart(product);
            }
        }
    });

    // Clear Cart Button
    clearCartButton.addEventListener("click", clearCart);

    // Initial fetch of all products
    fetchProducts("all");
});
