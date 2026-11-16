const TAMANO_MAXIMO = 1200;

const TIPOS_PERMITIDOS = ['image/png', 'image/jpeg', 'image/webp'];

function cargarDesdeArchivo(archivo) {
    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
        mostrarError('Ese archivo no es una imagen PNG, JPG o WebP.');
        return;
    }

    const url = URL.createObjectURL(archivo);
    cargarImagen(url);
}

function cargarImagen(url) {
    const img = new Image();

    img.onload = function () {
        const imagenReducida = reducirImagen(img);
        URL.revokeObjectURL(url);
        imagenLista(imagenReducida);
    };

    img.onerror = function () {
        mostrarError('No se pudo abrir la imagen.');
    };

    img.src = url;
}

function reducirImagen(img) {
    let ancho = img.naturalWidth;
    let alto = img.naturalHeight;

    if (ancho > TAMANO_MAXIMO || alto > TAMANO_MAXIMO) {
        const escala = TAMANO_MAXIMO / Math.max(ancho, alto);
        ancho = Math.round(ancho * escala);
        alto = Math.round(alto * escala);
    }

    const canvas = document.createElement('canvas');
    canvas.width = ancho;
    canvas.height = alto;
    canvas.getContext('2d').drawImage(img, 0, 0, ancho, alto);

    return canvas;
}

function tieneFondo(imagen) {
    const ancho = imagen.width;
    const alto = imagen.height;
    const datos = imagen.getContext('2d').getImageData(0, 0, ancho, alto).data;

    let total = 0;
    let opacos = 0;

    for (let x = 0; x < ancho; x++) {
        total = total + 2;
        if (esOpaco(datos, ancho, x, 0)) {
            opacos++;
        }
        if (esOpaco(datos, ancho, x, alto - 1)) {
            opacos++;
        }
    }

    for (let y = 0; y < alto; y++) {
        total = total + 2;
        if (esOpaco(datos, ancho, 0, y)) {
            opacos++;
        }
        if (esOpaco(datos, ancho, ancho - 1, y)) {
            opacos++;
        }
    }

    return opacos / total > 0.5;
}

function esOpaco(datos, ancho, x, y) {
    const posicion = (y * ancho + x) * 4;
    const alfa = datos[posicion + 3];
    return alfa > 200;
}
