/**
 * Gerenciamento do Carrinho de Compras (LocalStorage)
 * Atividade Prática 4º Bimestre - Desenvolvimento Web Avançado
 * Alunos: Alexandre, Pedro Franchim, Marcus e Julio
 * Professor: Danilo Bezerra
 */

const CART_STORAGE_KEY = 'gadgets_tech_cart';

// Obter carrinho do LocalStorage
function getCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Erro ao ler carrinho do localStorage', e);
    return [];
  }
}

// Salvar carrinho no LocalStorage
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
  } catch (e) {
    console.error('Erro ao salvar carrinho no localStorage', e);
  }
}

// Adicionar produto ao carrinho
function addToCart(productId, quantity = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`"${product.name}" adicionado ao carrinho!`);
}

// Alterar quantidade (+1 ou -1)
function updateQuantity(productId, delta) {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
      showToast('Item removido do carrinho.', 'info');
    }
    saveCart(cart);
    if (typeof renderCartPage === 'function') {
      renderCartPage();
    }
  }
}

// Remover produto do carrinho
function removeFromCart(productId) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  const name = item ? item.name : 'Produto';

  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  showToast(`"${name}" removido do carrinho.`, 'info');

  if (typeof renderCartPage === 'function') {
    renderCartPage();
  }
}

// Limpar todo o carrinho
function clearCart() {
  if (confirm('Deseja realmente esvaziar todo o seu carrinho?')) {
    saveCart([]);
    showToast('Carrinho esvaziado.', 'info');
    if (typeof renderCartPage === 'function') {
      renderCartPage();
    }
  }
}

// Calcular total do carrinho
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Quantidade total de itens
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Atualizar contador no menu principal
function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const count = getCartItemCount();

  badges.forEach(badge => {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.add('has-items');
    } else {
      badge.classList.remove('has-items');
    }
  });
}

// Toast de Notificação
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
    <span class="toast-text">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Animação de entrada
  setTimeout(() => toast.classList.add('visible'), 10);

  // Auto-remover após 3 segundos
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Renderização da Página de Carrinho (carrinho.html)
function renderCartPage() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSummaryContainer = document.getElementById('cart-summary-container');
  const emptyCartContainer = document.getElementById('empty-cart-container');
  const totalItemsCount = document.getElementById('total-items-count');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');

  if (!cartItemsContainer) return; // Não estamos na página do carrinho

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsContainer.style.display = 'none';
    if (cartSummaryContainer) cartSummaryContainer.style.display = 'none';
    if (emptyCartContainer) emptyCartContainer.style.display = 'block';
    return;
  }

  cartItemsContainer.style.display = 'flex';
  if (cartSummaryContainer) cartSummaryContainer.style.display = 'block';
  if (emptyCartContainer) emptyCartContainer.style.display = 'none';

  // Renderizar cada linha do carrinho
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      
      <div class="cart-item-info">
        <span class="cart-item-category">${item.category}</span>
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-price-unit">${formatCurrency(item.price)} cada</p>
      </div>

      <div class="cart-item-quantity">
        <button type="button" class="qty-btn" onclick="updateQuantity(${item.id}, -1)" aria-label="Diminuir quantidade">−</button>
        <span class="qty-display">${item.quantity}</span>
        <button type="button" class="qty-btn" onclick="updateQuantity(${item.id}, 1)" aria-label="Aumentar quantidade">+</button>
      </div>

      <div class="cart-item-subtotal">
        <span class="subtotal-label">Subtotal:</span>
        <span class="subtotal-val">${formatCurrency(item.price * item.quantity)}</span>
      </div>

      <button type="button" class="btn-remove-item" onclick="removeFromCart(${item.id})" title="Remover item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  `).join('');

  // Atualizar resumo de valores
  const total = getCartTotal();
  const itemCount = getCartItemCount();

  if (totalItemsCount) totalItemsCount.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`;
  if (subtotalEl) subtotalEl.textContent = formatCurrency(total);
  if (totalEl) totalEl.textContent = formatCurrency(total);
}

// Finalização do Pedido (Simulação)
function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Seu carrinho está vazio!', 'info');
    return;
  }

  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.add('active');
    // Salvar backup ou limpar após confirmação
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartBadge();
  } else {
    alert(`🎉 Pedido confirmado com sucesso!\nValor Total: ${formatCurrency(getCartTotal())}\nObrigado pela preferência!`);
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartBadge();
    window.location.href = 'index.html';
  }
}

// Inicialização automática ao carregar qualquer página
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  if (document.getElementById('cart-items-container')) {
    renderCartPage();
  }
});
