/* =========================================================
   D' NIÑAS
   script.js

   Funciones:

   1. Catálogo de productos
   2. Filtros
   3. Buscador
   4. Categorías
   5. Ofertas
   6. Carrito
   7. LocalStorage
   8. WhatsApp
   9. Modo oscuro
   10. Menú móvil
   11. Año automático
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const WHATSAPP_NUMBER = "5491122334455";


/* =========================================================
   PRODUCTOS
   ========================================================= */

const PRODUCTS = [

  {
    id: 1,
    name: "Vestido Floral Midi",
    audience: "Mujer",
    category: "Vestidos",
    price: 38900,
    oldPrice: 46900,
    image: "https://picsum.photos/seed/dn-product-1/600/750",
    badge: "Oferta"
  },

  {
    id: 2,
    name: "Vestido Gala Infantil",
    audience: "Niñas",
    category: "Vestidos",
    price: 29900,
    image: "https://picsum.photos/seed/dn-product-2/600/750",
    badge: "Nuevo"
  },

  {
    id: 3,
    name: "Vestido Lino Natural",
    audience: "Mujer",
    category: "Vestidos",
    price: 33900,
    image: "https://picsum.photos/seed/dn-product-3/600/750",
    badge: null
  },

  {
    id: 4,
    name: "Vestido Acampanado",
    audience: "Adolescentes",
    category: "Vestidos",
    price: 41900,
    oldPrice: 49900,
    image: "https://picsum.photos/seed/dn-product-4/600/750",
    badge: "Oferta"
  },

  {
    id: 5,
    name: "Top Cropped Canalé",
    audience: "Adolescentes",
    category: "Tops",
    price: 12900,
    image: "https://picsum.photos/seed/dn-product-5/600/750",
    badge: "Más vendido"
  },

  {
    id: 6,
    name: "Blusa Elegante",
    audience: "Mujer",
    category: "Tops",
    price: 27900,
    image: "https://picsum.photos/seed/dn-product-6/600/750",
    badge: null
  },

  {
    id: 7,
    name: "Top con Volados",
    audience: "Niñas",
    category: "Tops",
    price: 15900,
    oldPrice: 19900,
    image: "https://picsum.photos/seed/dn-product-7/600/750",
    badge: "Oferta"
  },

  {
    id: 8,
    name: "Remera Básica Algodón",
    audience: "Niñas",
    category: "Tops",
    price: 9900,
    image: "https://picsum.photos/seed/dn-product-8/600/750",
    badge: null
  },

  {
    id: 9,
    name: "Cartera de Mano",
    audience: "Mujer",
    category: "Accesorios",
    price: 22900,
    image: "https://picsum.photos/seed/dn-product-9/600/750",
    badge: "Nuevo"
  },

  {
    id: 10,
    name: "Pañuelo de Seda",
    audience: "Mujer",
    category: "Accesorios",
    price: 8900,
    oldPrice: 11900,
    image: "https://picsum.photos/seed/dn-product-10/600/750",
    badge: "Oferta"
  },

  {
    id: 11,
    name: "Aros Delicados",
    audience: "Adolescentes",
    category: "Accesorios",
    price: 6900,
    image: "https://picsum.photos/seed/dn-product-11/600/750",
    badge: "Más vendido"
  },

  {
    id: 12,
    name: "Cinturón Clásico",
    audience: "Mujer",
    category: "Accesorios",
    price: 9900,
    image: "https://picsum.photos/seed/dn-product-12/600/750",
    badge: null
  }

];


/* =========================================================
   UTILIDADES
   ========================================================= */

function formatPrice(price) {

  return price.toLocaleString(
    "es-AR",
    {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }
  );

}


/* =========================================================
   ELEMENTOS DEL DOM
   ========================================================= */

const productGrid =
  document.getElementById("productGrid");

const emptyResults =
  document.getElementById("emptyResults");

const filterButtons =
  document.querySelectorAll(".filter-btn");

const productSearch =
  document.getElementById("productSearch");

const categoryCards =
  document.querySelectorAll(".category-card");


/* =========================================================
   ESTADO DEL CATÁLOGO
   ========================================================= */

let currentFilter = "todos";

let currentSearch = "";


/* =========================================================
   CREAR TARJETA DE PRODUCTO
   ========================================================= */

function createProductCard(product) {

  const card =
    document.createElement("article");

  card.className = "product-card";

  const oldPriceHTML =
    product.oldPrice
      ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>`
      : "";


  const badgeHTML =
    product.badge
      ? `<span class="product-badge">${product.badge}</span>`
      : "";


  card.innerHTML = `

    <div class="product-card__image">

      <img
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
      >

      ${badgeHTML}

    </div>


    <div class="product-card__body">

      <p class="product-category">
        ${product.audience} · ${product.category}
      </p>

      <h3>
        ${product.name}
      </h3>


      <div class="product-price">

        <span class="price">
          ${formatPrice(product.price)}
        </span>

        ${oldPriceHTML}

      </div>


      <button
        class="add-to-cart"
        data-id="${product.id}"
        type="button"
      >
        Añadir al carrito
      </button>

    </div>

  `;


  const addButton =
    card.querySelector(".add-to-cart");


  addButton.addEventListener(
    "click",
    () => {

      addToCart(product.id);

      addButton.textContent =
        "Añadido ✓";

      addButton.classList.add(
        "is-added"
      );


      setTimeout(() => {

        addButton.textContent =
          "Añadir al carrito";

        addButton.classList.remove(
          "is-added"
        );

      }, 1000);

    }
  );


  return card;

}


/* =========================================================
   FILTRAR PRODUCTOS
   ========================================================= */

function getFilteredProducts() {

  return PRODUCTS.filter(product => {

    const matchesFilter =
      currentFilter === "todos"

      ||

      (
        currentFilter === "Ofertas"
        &&
        product.oldPrice
      )

      ||

      product.audience === currentFilter

      ||

      product.category === currentFilter;


    const searchText =
      currentSearch
        .toLowerCase()
        .trim();


    const matchesSearch =
      !searchText

      ||

      product.name
        .toLowerCase()
        .includes(searchText)

      ||

      product.audience
        .toLowerCase()
        .includes(searchText)

      ||

      product.category
        .toLowerCase()
        .includes(searchText);


    return (
      matchesFilter &&
      matchesSearch
    );

  });

}


/* =========================================================
   RENDERIZAR PRODUCTOS
   ========================================================= */

function renderProducts() {

  productGrid.innerHTML = "";


  const products =
    getFilteredProducts();


  if (products.length === 0) {

    emptyResults.hidden = false;

    return;

  }


  emptyResults.hidden = true;


  products.forEach(product => {

    productGrid.appendChild(
      createProductCard(product)
    );

  });

}


/* =========================================================
   FILTROS
   ========================================================= */

function setFilter(filter) {

  currentFilter = filter;


  filterButtons.forEach(button => {

    button.classList.toggle(
      "is-active",
      button.dataset.filter === filter
    );

  });


  renderProducts();

}


/* =========================================================
   EVENTOS DE FILTROS
   ========================================================= */

filterButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      setFilter(
        button.dataset.filter
      );

    }
  );

});


/* =========================================================
   BUSCADOR
   ========================================================= */

productSearch.addEventListener(
  "input",
  event => {

    currentSearch =
      event.target.value;

    renderProducts();

  }
);


/* =========================================================
   CATEGORÍAS
   ========================================================= */

categoryCards.forEach(card => {

  card.addEventListener(
    "click",
    () => {

      const category =
        card.dataset.category;


      setFilter(category);


      document
        .getElementById("catalogo")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );

});


/* =========================================================
   OFERTAS
   ========================================================= */

const offersButton =
  document.getElementById("offersButton");


offersButton.addEventListener(
  "click",
  () => {

    setFilter("Ofertas");


    document
      .getElementById("catalogo")
      .scrollIntoView({
        behavior: "smooth"
      });

  }
);


/* =========================================================
   CARRITO
   ========================================================= */

let cart =
  JSON.parse(
    localStorage.getItem("dninas_cart")
  ) || [];


const cartToggle =
  document.getElementById("cartToggle");

const cartDrawer =
  document.getElementById("cartDrawer");

const cartOverlay =
  document.getElementById("cartOverlay");

const closeCart =
  document.getElementById("closeCart");

const cartItems =
  document.getElementById("cartItems");

const cartTotal =
  document.getElementById("cartTotal");

const cartCount =
  document.getElementById("cartCount");

const clearCartButton =
  document.getElementById("clearCartBtn");

const checkoutButton =
  document.getElementById("checkoutBtn");


/* =========================================================
   GUARDAR CARRITO
   ========================================================= */

function saveCart() {

  localStorage.setItem(
    "dninas_cart",
    JSON.stringify(cart)
  );

}


/* =========================================================
   AGREGAR AL CARRITO
   ========================================================= */

function addToCart(productId) {

  const existing =
    cart.find(
      item => item.id === productId
    );


  if (existing) {

    existing.qty += 1;

  } else {

    cart.push({
      id: productId,
      qty: 1
    });

  }


  saveCart();

  renderCart();

  openCart();

}


/* =========================================================
   CAMBIAR CANTIDAD
   ========================================================= */

function updateQuantity(
  productId,
  change
) {

  const item =
    cart.find(
      item => item.id === productId
    );


  if (!item) return;


  item.qty += change;


  if (item.qty <= 0) {

    cart =
      cart.filter(
        item => item.id !== productId
      );

  }


  saveCart();

  renderCart();

}


/* =========================================================
   ELIMINAR PRODUCTO
   ========================================================= */

function removeFromCart(productId) {

  cart =
    cart.filter(
      item => item.id !== productId
    );


  saveCart();

  renderCart();

}


/* =========================================================
   RENDER CARRITO
   ========================================================= */

function renderCart() {

  cartItems.innerHTML = "";


  let total = 0;

  let totalItems = 0;


  if (cart.length === 0) {

    cartItems.innerHTML = `

      <p class="cart-empty">
        Tu carrito está vacío.
      </p>

    `;

  }


  cart.forEach(item => {

    const product =
      PRODUCTS.find(
        product => product.id === item.id
      );


    if (!product) return;


    const subtotal =
      product.price * item.qty;


    total += subtotal;

    totalItems += item.qty;


    const cartItem =
      document.createElement("div");


    cartItem.className =
      "cart-item";


    cartItem.innerHTML = `

      <img
        src="${product.image}"
        alt="${product.name}"
      >


      <div>

        <h4>
          ${product.name}
        </h4>

        <p class="cart-item__price">
          ${formatPrice(product.price)}
        </p>


        <div class="cart-item__controls">

          <button
            class="qty-btn"
            data-action="decrease"
            data-id="${product.id}"
            type="button"
          >
            −
          </button>


          <span>
            ${item.qty}
          </span>


          <button
            class="qty-btn"
            data-action="increase"
            data-id="${product.id}"
            type="button"
          >
            +
          </button>


          <button
            class="remove-item"
            data-action="remove"
            data-id="${product.id}"
            type="button"
          >
            Eliminar
          </button>

        </div>

      </div>

    `;


    cartItems.appendChild(
      cartItem
    );

  });


  cartTotal.textContent =
    formatPrice(total);


  cartCount.textContent =
    totalItems;

}


/* =========================================================
   CONTROLES DEL CARRITO
   ========================================================= */

cartItems.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest("button");


    if (!button) return;


    const productId =
      Number(button.dataset.id);


    const action =
      button.dataset.action;


    if (action === "increase") {

      updateQuantity(
        productId,
        1
      );

    }


    if (action === "decrease") {

      updateQuantity(
        productId,
        -1
      );

    }


    if (action === "remove") {

      removeFromCart(
        productId
      );

    }

  }
);


/* =========================================================
   ABRIR CARRITO
   ========================================================= */

function openCart() {

  cartDrawer.classList.add(
    "is-open"
  );

  cartOverlay.classList.add(
    "is-open"
  );

  document.body.classList.add(
    "cart-open"
  );

}


/* =========================================================
   CERRAR CARRITO
   ========================================================= */

function closeCartDrawer() {

  cartDrawer.classList.remove(
    "is-open"
  );

  cartOverlay.classList.remove(
    "is-open"
  );

  document.body.classList.remove(
    "cart-open"
  );

}


cartToggle.addEventListener(
  "click",
  openCart
);


closeCart.addEventListener(
  "click",
  closeCartDrawer
);


cartOverlay.addEventListener(
  "click",
  closeCartDrawer
);


/* =========================================================
   VACIAR CARRITO
   ========================================================= */

clearCartButton.addEventListener(
  "click",
  () => {

    if (cart.length === 0) return;


    const confirmed =
      confirm(
        "¿Querés vaciar el carrito?"
      );


    if (!confirmed) return;


    cart = [];

    saveCart();

    renderCart();

  }
);


/* =========================================================
   CHECKOUT WHATSAPP
   ========================================================= */

checkoutButton.addEventListener(
  "click",
  () => {

    if (cart.length === 0) {

      alert(
        "Tu carrito está vacío."
      );

      return;

    }


    let message =
      "Hola, quiero realizar este pedido:%0A%0A";


    let total = 0;


    cart.forEach(item => {

      const product =
        PRODUCTS.find(
          product => product.id === item.id
        );


      if (!product) return;


      const subtotal =
        product.price * item.qty;


      total += subtotal;


      message +=
        `• ${product.name} x${item.qty} — ${formatPrice(subtotal)}%0A`;

    });


    message +=
      `%0ATotal: ${formatPrice(total)}`;


    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


    window.open(
      whatsappURL,
      "_blank"
    );

  }
);


/* =========================================================
   FORMULARIO DE CONTACTO
   ========================================================= */

const contactForm =
  document.getElementById(
    "contactForm"
  );


contactForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const name =
      document.getElementById(
        "contactName"
      ).value.trim();


    const phone =
      document.getElementById(
        "contactPhone"
      ).value.trim();


    const message =
      document.getElementById(
        "contactMessage"
      ).value.trim();


    const text =
      `Hola, soy ${name}.%0A%0A` +
      `Teléfono: ${phone || "No indicado"}%0A%0A` +
      `Consulta: ${message}`;


    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;


    window.open(
      whatsappURL,
      "_blank"
    );


    contactForm.reset();

  }
);


/* =========================================================
   MODO OSCURO
   ========================================================= */

const darkModeToggle =
  document.getElementById(
    "darkModeToggle"
  );


const savedTheme =
  localStorage.getItem(
    "dninas_theme"
  );


if (savedTheme === "dark") {

  document.body.classList.add(
    "dark"
  );

  darkModeToggle.textContent =
    "☀";

}


darkModeToggle.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "dark"
    );


    const isDark =
      document.body.classList.contains(
        "dark"
      );


    localStorage.setItem(
      "dninas_theme",
      isDark
        ? "dark"
        : "light"
    );


    darkModeToggle.textContent =
      isDark
        ? "☀"
        : "☾";

  }
);


/* =========================================================
   MENÚ MÓVIL
   ========================================================= */

const menuToggle =
  document.getElementById(
    "menuToggle"
  );

const nav =
  document.getElementById(
    "nav"
  );


menuToggle.addEventListener(
  "click",
  () => {

    const isOpen =
      nav.classList.toggle(
        "is-open"
      );


    menuToggle.setAttribute(
      "aria-expanded",
      isOpen
    );

  }
);


/* Cerrar menú al seleccionar una opción */

nav.querySelectorAll("a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        nav.classList.remove(
          "is-open"
        );

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }
    );

  });


/* =========================================================
   AÑO AUTOMÁTICO
   ========================================================= */

document.getElementById(
  "year"
).textContent =
  new Date().getFullYear();


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

renderProducts();

renderCart();
