/**
 * Manipulação do DOM, Filtros por Categoria e Busca em Tempo Real
 * Atividade Prática 4º Bimestre - Desenvolvimento Web Avançado
 * Alunos: Alexandre, Pedro Franchim, Marcus e Julio
 * Professor: Danilo Bezerra
 */

let activeCategory = 'all';
let searchQuery = '';
let currentSort = 'default';

// Inicialização da Página Principal
document.addEventListener('DOMContentLoaded', () => {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return; // Não estamos na index.html

  initFilters();
  initSearch();
  initSorting();
  applyFiltersAndRender();
});

// Configuração dos botões de filtro por categoria
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover classe active de todos
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Adicionar classe active ao clicado
      button.classList.add('active');

      activeCategory = button.getAttribute('data-category');
      applyFiltersAndRender();
    });
  });
}

// Configuração da busca em tempo real
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search-btn');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    
    if (clearBtn) {
      clearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
    }

    applyFiltersAndRender();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      searchInput.focus();
      applyFiltersAndRender();
    });
  }
}

// Configuração da ordenação (Preço/Relevância)
function initSorting() {
  const sortSelect = document.getElementById('sort-select');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFiltersAndRender();
  });
}

// Aplicar filtros e ordenar
function applyFiltersAndRender() {
  let filtered = [...products];

  // 1. Filtrar por Categoria
  if (activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
  }

  // 2. Filtrar por Busca (nome ou funcionalidade/descrição)
  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery)
    );
  }

  // 3. Ordenação
  if (currentSort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  renderProductsGrid(filtered);
  updateResultsCount(filtered.length);
}

// Renderizar cards no grid
function renderProductsGrid(items) {
  const grid = document.getElementById('products-grid');
  const emptyState = document.getElementById('no-results');

  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  grid.innerHTML = items.map(product => `
    <article class="product-card" data-category="${product.category}">
      <div class="product-card-badge">
        <span class="category-pill">${product.category}</span>
        <span class="rating-pill">★ ${product.rating.toFixed(1)}</span>
      </div>

      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
      </div>

      <div class="product-content">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-description">${product.description}</p>

        <div class="product-features">
          ${product.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
        </div>

        <div class="product-footer">
          <div class="price-container">
            <span class="price-label">Valor especial</span>
            <span class="product-price">${formatCurrency(product.price)}</span>
          </div>

          <button 
            type="button" 
            class="btn-add-cart" 
            onclick="addToCart(${product.id})"
            aria-label="Adicionar ${product.name} ao carrinho"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Adicionar
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// Atualizar contador de resultados
function updateResultsCount(count) {
  const countEl = document.getElementById('results-count');
  if (countEl) {
    countEl.textContent = `${count} ${count === 1 ? 'gadget encontrado' : 'gadgets encontrados'}`;
  }
}
