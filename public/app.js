const API = "http://localhost:3000";

// --- Elementos ---
const formLogin = document.getElementById("formLogin");
const sessionContainer = document.getElementById("sessionContainer");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

// Modal notificación
const notificacionModalEl = document.getElementById("notificacionModal");
const notificacionModal = new bootstrap.Modal(notificacionModalEl);
const notificacionBody = document.getElementById("notificacionBody");

// --- BOTÓN SESIÓN ---
function actualizarBotonSesion() {
  const token = localStorage.getItem("token");

  if (token) {
    btnSesion.textContent = "Cerrar sesión";
    btnSesion.className = "btn btn-danger";
    btnSesion.removeAttribute("data-bs-toggle");
    btnSesion.removeAttribute("data-bs-target");

    btnSesion.onclick = () => {
      localStorage.removeItem("token");
      actualizarBotonSesion();
      cargarCategorias();
    };
  } else {
    btnSesion.textContent = "Iniciar sesión";
    btnSesion.className = "btn btn-primary";
    btnSesion.setAttribute("data-bs-toggle", "modal");
    btnSesion.setAttribute("data-bs-target", "#loginModal");
    btnSesion.onclick = null;
  }
}

// --- LOGIN ---
formLogin.addEventListener("submit", async e => {
  e.preventDefault();
  const usuario = document.getElementById("usuarioLogin").value.trim();
  const password = document.getElementById("passwordLogin").value.trim();

  try {
    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password })
    });

    if (!res.ok) throw new Error("Usuario o contraseña incorrecta");

    const data = await res.json();
    localStorage.setItem("token", data.token);
    bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
    mostrarNotificacion("Sesión iniciada con éxito");
    actualizarBotonSesion();
    cargarCategorias();
  } catch (err) {
    mostrarNotificacion(err.message);
  }
});

// --- CATEGORÍAS Y PRODUCTOS ---
async function cargarCategorias() {
  const res = await fetch(`${API}/categorias`);
  const categorias = await res.json();
  const menu = document.getElementById('categoriasMenu');
  menu.innerHTML = '';

  const btnTodos = document.createElement('button');
  btnTodos.className = "btn btn-outline-primary me-2";
  btnTodos.textContent = "Todos";
  btnTodos.addEventListener('click', () => {
    actualizarBotonesCategorias(null);
    cargarProductos();
  });
  menu.appendChild(btnTodos);

  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = "btn btn-outline-primary me-2";
    btn.textContent = cat.nombre;
    btn.dataset.id = cat.id;
    btn.addEventListener('click', () => {
      actualizarBotonesCategorias(cat.id);
      cargarProductos(cat.id);
    });
    menu.appendChild(btn);
  });

  const token = localStorage.getItem("token");
  if (token) {
    const btnGestionar = document.createElement('button');
    btnGestionar.className = "btn btn-success float-end";
    btnGestionar.textContent = "Gestionar";
    btnGestionar.addEventListener('click', () => {
      window.location.href = "usuarios.html";
    });
    menu.appendChild(btnGestionar);
  }
}

function actualizarBotonesCategorias(selectedId) {
  const botones = document.querySelectorAll('#categoriasMenu button');
  botones.forEach(btn => {
    if (btn.textContent === "Gestionar") return;
    const id = btn.dataset.id ? parseInt(btn.dataset.id) : null;
    btn.className = (selectedId === id || (selectedId === null && btn.textContent === "Todos")) ? "btn btn-primary me-2" : "btn btn-outline-primary me-2";
  });
}

async function cargarProductos(categoriaId) {
  let url = `${API}/productos`;
  if (categoriaId) url += `?categoria_id=${categoriaId}`;

  const res = await fetch(url);
  const productos = await res.json();
  const list = document.getElementById('productosList');
  list.innerHTML = '';

  for (const prod of productos) {
    let imgUrl = "";
    try {
      const resImg = await fetch(`${API}/imagenes/${prod.id}`);
      const imagenes = await resImg.json();
      if (imagenes.length > 0) imgUrl = imagenes[0].url;
    } catch {}

    const col = document.createElement('div');
    col.className = "col-md-4 mb-3";
    col.innerHTML = `
      <div class="card h-100">
        ${imgUrl ? `<img src="${imgUrl}" class="card-img-top" alt="${prod.nombre}">` : ''}
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text">S/. ${prod.precio}</p>
          <button class="btn btn-primary mt-auto verDetalleBtn">Ver detalle</button>
        </div>
      </div>
    `;
    col.querySelector('.verDetalleBtn').addEventListener('click', () => verDetalle(prod.id));
    list.appendChild(col);
  }
}

async function verDetalle(productoId) {
  const res = await fetch(`${API}/productos`);
  const productos = await res.json();
  const producto = productos.find(p => p.id === productoId);
  if (!producto) return;

  let imagenes = [];
  try {
    const rImg = await fetch(`${API}/imagenes/${productoId}`);
    imagenes = await rImg.json();
  } catch {}

  let html = `<h4>${producto.nombre}</h4><p>Precio: S/. ${producto.precio}</p><div class="d-flex flex-wrap">`;
  imagenes.forEach(img => html += `<img src="${img.url}" class="img-fluid me-2 mb-2" style="max-height:150px;">`);
  html += `</div>`;

  document.getElementById('detalleModalBody').innerHTML = html;
  new bootstrap.Modal(document.getElementById('detalleModal')).show();
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  actualizarBotonSesion();
  cargarCategorias();
  cargarProductos();
});

