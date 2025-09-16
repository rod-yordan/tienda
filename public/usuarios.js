const API = "http://localhost:3000";
const token = localStorage.getItem("token");

// --- Redirección si no hay sesión ---
if (!token) {
  window.location.href = "index.html";
} 

// --- Elementos ---
const tbody = document.getElementById("tbodyProductos");
const formAgregar = document.getElementById("formAgregar");
const selectCategoria = document.getElementById("agregarCategoria");
const formCategoria = document.getElementById("formCategoria");
const nuevaCategoria = document.getElementById("nuevaCategoria");
const formImagen = document.getElementById("formImagen");
const selectCategoriaImagen = document.getElementById("categoriaImagen");
const selectProductoImagen = document.getElementById("productoImagen");
const urlImagen = document.getElementById("urlImagen");
const btnEliminarCategoria = document.getElementById("btnEliminarCategoria");
const btnAgregarCategoria = document.getElementById("btnAgregarCategoria");
const btnAgregarProducto = document.getElementById("btnAgregarProducto");
const btnAgregarImagen = document.getElementById("btnAgregarImagen");

// --- Control de acceso ---
if (!token) {
  btnAgregarCategoria.disabled = true;
  btnAgregarProducto.disabled = true;
  btnAgregarImagen.disabled = true;
  btnEliminarCategoria.disabled = true;
}

// --- Modal eliminar categoría ---
const eliminarCategoriaModalEl = document.getElementById("eliminarCategoriaModal");
const eliminarCategoriaModal = new bootstrap.Modal(eliminarCategoriaModalEl);
const categoriaAEliminarSelect = document.getElementById("categoriaAEliminar");
const confirmarEliminarCategoriaBtn = document.getElementById("confirmarEliminarCategoriaBtn");

// --- Modal confirmación ---
function crearModalConfirmacion(mensaje, callback) {
  const modalHTML = `
    <div class="modal fade" id="confirmModal" tabindex="-1">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center">
            <p>${mensaje}</p>
            <button class="btn btn-danger me-2" id="confirmSi">Sí</button>
            <button class="btn btn-secondary" id="confirmNo">No</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  const modalEl = document.getElementById("confirmModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  modalEl.querySelector("#confirmSi").addEventListener("click", () => {
    callback();
    modal.hide();
    modalEl.remove();
  });
  modalEl.querySelector("#confirmNo").addEventListener("click", () => {
    modal.hide();
    modalEl.remove();
  });
}

// --- Productos ---
let productosGlobal = [];

async function cargarProductos() {
  const res = await fetch(`${API}/productos`);
  const productos = await res.json();
  productosGlobal = productos;
  tbody.innerHTML = "";
  productos.forEach((prod, i) => {
    const tr = document.createElement("tr");
    tr.style.backgroundColor = i % 2 === 0 ? "#ffffff" : "#e0f7fa";
    tr.innerHTML = `
      <td>${prod.id}</td>
      <td>${prod.nombre}</td>
      <td>S/. ${prod.precio}</td>
      <td>${prod.categoria}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2 editarBtn">Editar</button>
        <button class="btn btn-danger btn-sm eliminarBtn">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);

    const editarBtn = tr.querySelector(".editarBtn");
    const eliminarBtn = tr.querySelector(".eliminarBtn");

    if (!token) {
      editarBtn.disabled = true;
      eliminarBtn.disabled = true;
    } else {
      editarBtn.addEventListener("click", () => abrirEditar(prod));
      eliminarBtn.addEventListener("click", () => eliminarProducto(prod.id));
    }
  });
}

// --- Categorías ---
async function cargarCategorias() {
  const res = await fetch(`${API}/categorias`);
  const categorias = await res.json();

  // Agregar producto
  selectCategoria.innerHTML = "";
  categorias.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.nombre;
    selectCategoria.appendChild(opt);
  });

  // Eliminar categoría
  categoriaAEliminarSelect.innerHTML = "";
  categorias.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.nombre;
    categoriaAEliminarSelect.appendChild(opt);
  });

  // Imagen
  selectCategoriaImagen.innerHTML = '<option value="">--Selecciona--</option>';
  categorias.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.nombre;
    opt.textContent = cat.nombre;
    selectCategoriaImagen.appendChild(opt);
  });

  // Editar
  const selectEditarCategoria = document.getElementById("editarCategoria");
  selectEditarCategoria.innerHTML = "";
  categorias.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.nombre;
    selectEditarCategoria.appendChild(opt);
  });
}

// --- Abrir modal de edición ---
function abrirEditar(prod) {
  const editarNombre = document.getElementById("editarNombre");
  const editarPrecio = document.getElementById("editarPrecio");
  const editarCategoria = document.getElementById("editarCategoria");

  editarNombre.value = prod.nombre;
  editarPrecio.value = prod.precio;
  editarCategoria.value = prod.categoria_id;

  const editarModalEl = document.getElementById("editarModal");
  const editarModal = new bootstrap.Modal(editarModalEl);
  editarModal.show();

  const formEditar = document.getElementById("formEditar");

  // Evitar listeners duplicados
  formEditar.onsubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Debe iniciar sesión");

    const nombre = editarNombre.value;
    const precio = parseFloat(editarPrecio.value);
    const categoria_id = parseInt(editarCategoria.value);

    try {
      await fetch(`${API}/productos/${prod.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, precio, categoria_id })
      });

      editarModal.hide();
      cargarProductos();
      cargarCategorias();
    } catch (err) {
      alert("Error al actualizar el producto");
      console.error(err);
    }
  };
}

// --- Agregar producto ---
formAgregar.addEventListener("submit", async e => {
  e.preventDefault();
  if (!token) return alert("Debe iniciar sesión");

  const nombre = document.getElementById("agregarNombre").value;
  const precio = parseFloat(document.getElementById("agregarPrecio").value);
  const categoria_id = parseInt(selectCategoria.value);

  await fetch(`${API}/productos`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ nombre, precio, categoria_id })
  });

  formAgregar.reset();
  bootstrap.Modal.getInstance(document.getElementById("agregarModal")).hide();
  cargarProductos();
  cargarCategorias();
});

// --- Agregar categoría ---
formCategoria.addEventListener("submit", async e => {
  e.preventDefault();
  if (!token) return alert("Debe iniciar sesión");

  await fetch(`${API}/categorias`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ nombre: nuevaCategoria.value })
  });

  nuevaCategoria.value = "";
  bootstrap.Modal.getInstance(document.getElementById("categoriaModal")).hide();
  cargarCategorias();
});

// --- Agregar imagen ---
selectCategoriaImagen.addEventListener("change", () => {
  const catSeleccionada = selectCategoriaImagen.value;
  const productosFiltrados = productosGlobal.filter(p => p.categoria === catSeleccionada);

  selectProductoImagen.innerHTML = '<option value="">--Selecciona producto--</option>';
  productosFiltrados.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.nombre;
    selectProductoImagen.appendChild(opt);
  });
});

formImagen.addEventListener("submit", async e => {
  e.preventDefault();
  if (!token) return alert("Debe iniciar sesión");

  await fetch(`${API}/imagenes`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ producto_id: parseInt(selectProductoImagen.value), url: urlImagen.value })
  });

  urlImagen.value = "";
  selectCategoriaImagen.value = "";
  selectProductoImagen.innerHTML = '<option value="">--Selecciona categoría primero--</option>';
  bootstrap.Modal.getInstance(document.getElementById("imagenModal")).hide();
});

// --- Eliminar producto ---
function eliminarProducto(id) {
  crearModalConfirmacion("¿Desea eliminar este producto?", async () => {
    await fetch(`${API}/productos/${id}`, { 
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    cargarProductos();
  });
}

// --- Eliminar categoría ---
btnEliminarCategoria.addEventListener("click", () => {
  if (!token) return alert("Debe iniciar sesión");
  eliminarCategoriaModal.show();
});

confirmarEliminarCategoriaBtn.addEventListener("click", async () => {
  const catId = categoriaAEliminarSelect.value;
  if (!catId) return alert("Debe seleccionar una categoría");

  crearModalConfirmacion("¿Desea eliminar esta categoría?", async () => {
    await fetch(`${API}/categorias/${catId}`, { 
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    cargarCategorias();
    cargarProductos();
  });

  eliminarCategoriaModal.hide();
});

// --- Inicializar ---
cargarProductos();
cargarCategorias();
