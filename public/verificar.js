async function verificarAcceso() {
  try {
    const res = await fetch('https://api-tienda-online-production.up.railway.app/check-access');
    if (!res.ok) {
      // Si el backend devuelve 403
      const data = await res.json();
      mostrarPantallaDenegado(data.message);
      return false;
    }

    const data = await res.json();
    if (!data.authorized) {
      mostrarPantallaDenegado(data.message);
      return false;
    }

    console.log('✅ Acceso permitido');
    return true;

  } catch (error) {
    console.error('Error al verificar acceso:', error);
    mostrarPantallaDenegado('Error de conexión con el servidor.');
    return false;
  }
}

function mostrarPantallaDenegado(mensaje) {
  document.body.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center;">
      <i class="fas fa-ban fa-5x mb-3 text-danger"></i>
      <h1>Acceso Denegado</h1>
      <p style="color:#666;font-size:1.2rem;">${mensaje}</p>
    </div>
  `;
}