const fs = require('fs');
const path = require('path');

function mostrarEstructura(dir, nivel = 0) {
  const archivos = fs.readdirSync(dir);
  archivos.forEach(archivo => {
    const ruta = path.join(dir, archivo);
    const indentacion = '│   '.repeat(nivel);
    const esCarpeta = fs.statSync(ruta).isDirectory();
    console.log(`${indentacion}${esCarpeta ? '📁' : '📄'} ${archivo}`);
    if (esCarpeta) {
      mostrarEstructura(ruta, nivel + 1);
    }
  });
}

mostrarEstructura('.');
