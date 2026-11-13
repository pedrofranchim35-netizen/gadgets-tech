# 🚀 Gadgets Tech — E-commerce & Catálogo Futurista

> **Atividade Prática • 4º Bimestre — Desenvolvimento Web Avançado**  
> **Professor:** Danilo Bezerra  
> **Integrantes do Grupo:** Alexandre, Pedro Franchim, Marcus e Julio  
> **Tecnologias:** HTML5 Semântico, CSS3 Puro (Grid & Flexbox), JavaScript Vanilla (DOM & LocalStorage). *Sem frameworks ou bibliotecas externas.*

---

## 📋 Sobre o Projeto

Aplicação web de comércio eletrônico com temática futurista desenvolvida para a entrega parcial do 4º Bimestre. O projeto conta com catálogo dinâmico de gadgets de alta tecnologia, filtragem por categorias, busca instantânea em tempo real e carrinho de compras interativo com persistência no navegador via `localStorage`.

### ⚡ Produtos do Catálogo Oficial

| Categoria | Nome do Produto | Funcionalidade Principal | Preço (BRL) |
| :--- | :--- | :--- | :--- |
| **Wearables** | VisionAR Glass | Exibição de GPS e tradução de idiomas em tempo real nas lentes. | R$ 3.499,00 |
| **Wearables** | PulseTouch Pro | Pulseira com feedback tátil e vibrações direcionais para games. | R$ 1.299,00 |
| **Wearables** | AuraRing Control | Anel inteligente para controle por gestos no ar. | R$ 1.899,00 |
| **Casa Inteligente** | HoloDesk AI | Assistente de mesa com projeção holográfica 3D interativa. | R$ 4.799,00 |
| **Casa Inteligente** | HydroSmart | Garrafa com esterilização UV-C e lembrete de hidratação. | R$ 549,00 |
| **Áudio Avançado** | Orbital Sound | Caixa de som flutuante com levitação magnética e indução. | R$ 2.199,00 |

---

## 📂 Arquitetura de Arquivos

```text
/
├── index.html              # Página principal e catálogo dos produtos
├── carrinho.html           # Visualização e confirmação do carrinho
├── ENTREGA_PARCIAL.txt     # Arquivo de envio solicitado pelo professor
├── README.md               # Documentação completa do projeto
├── css/
│   ├── style.css           # Estilos globais e layout responsivo
│   └── produtos.css        # Estilos dos cards, filtros, busca e carrinho
├── js/
│   ├── products.js         # Array de objetos com os dados dos gadgets
│   ├── main.js             # Manipulação do DOM (busca em tempo real e filtros)
│   └── cart.js             # Lógica do carrinho e suporte ao LocalStorage
└── assets/
    └── img/                # Imagens em vetor SVG dos gadgets futuristas e logo
```

---

## ✨ Funcionalidades Implementadas

1. **Semana 1: Estrutura & Responsividade**
   - Layout responsivo utilizando CSS Flexbox e CSS Grid.
   - Menu fixo no topo com contador de itens no carrinho em tempo real.
   - Design moderno com visual tech, degradês e efeitos visuais suaves.
   - Totalmente adaptável para celulares, tablets e computadores.

2. **Semana 2: Dinamismo & DOM**
   - Base de dados em JavaScript (`products.js`).
   - Renderização dinâmica dos cards de produtos via DOM em `main.js`.
   - Busca em tempo real com filtragem instantânea por título e descrição.
   - Filtros de categoria: *Todos*, *Wearables*, *Casa Inteligente* e *Áudio Avançado*.
   - Ordenação dinâmica por preço (menor/maior) e avaliação.

3. **Semana 3: Persistência & LocalStorage**
   - Adição e remoção de produtos no carrinho.
   - Controle de quantidade (+ e -) por item.
   - Cálculo automático do subtotal e total geral.
   - Persistência contínua usando a Web Storage API (`localStorage`).
   - Feedback visual imediato através de notificações flutuantes (Toasts).
   - Modal de simulação de finalização de pedido.

---

## 🌐 Como Publicar no GitHub Pages

1. Crie um novo repositório no seu GitHub (ex.: `gadgets-tech`).
2. Faça o upload ou clone estes arquivos na branch `main`:
   ```bash
   git init
   git add .
   git commit -m "feat: entrega parcial da atividade prática - 4 bimestre"
   git branch -M main
   git remote add origin https://github.com/[seu_usuario]/gadgets-tech.git
   git push -u origin main
   ```
3. No GitHub, acesse **Settings** > **Pages**.
4. Em **Branch**, selecione `main` e a pasta `/ (root)`. Clique em **Save**.
5. O link será gerado no formato: `https://[seu_usuario].github.io/gadgets-tech/`.
6. Preencha os links no arquivo `ENTREGA_PARCIAL.txt` e envie ao professor Danilo Bezerra!
