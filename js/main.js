const estado = {
    imagen: null,
    cubos: [],
    caja: null,
    tamano: 6,
    lado: 6,
    efecto: 'remolino',
    duracion: 4,
    colorFondo: '#ffffff',
    avance: 0,
    reproduciendo: false
};

const lienzo = document.getElementById('lienzo');
const escenario = document.getElementById('escenario');
const botonReproducir = document.getElementById('reproducir');
const barraAvance = document.getElementById('avance');

function imagenLista(imagen) {
    let conFondo;
    try {
        conFondo = tieneFondo(imagen);
    } catch (error) {
        mostrarError('No se pudo leer la imagen. Abre la página con Live Server en vez de doble clic.');
        return;
    }

    estado.imagen = imagen;

    document.getElementById('error').hidden = true;
    document.getElementById('vacio').hidden = true;
    document.getElementById('aviso-fondo').hidden = !conFondo;

    detener();
    prepararTodo();
    cambiarAvance(0);
}

function mostrarError(texto) {
    const error = document.getElementById('error');
    error.textContent = texto;
    error.hidden = false;
}

function prepararTodo() {
    lienzo.width = Math.floor(escenario.clientWidth / 2) * 2;
    lienzo.height = Math.floor(escenario.clientHeight / 2) * 2;

    if (estado.imagen === null) {
        dibujar();
        return;
    }

    estado.caja = calcularCaja();

    const resultado = crearCubos(estado.imagen, estado.caja, estado.tamano);
    estado.cubos = resultado.cubos;
    estado.lado = resultado.lado;

    calcularTiempos(estado.cubos, estado.efecto);

    document.getElementById('cantidad').textContent = estado.cubos.length;

    const notaTamano = document.getElementById('nota-tamano');
    if (estado.lado > estado.tamano) {
        notaTamano.textContent = 'Salían demasiados cubos, así que se usaron de ' + estado.lado + ' px para que no se ponga lento.';
        notaTamano.hidden = false;
    } else {
        notaTamano.hidden = true;
    }

    dibujar();
}

function calcularCaja() {
    const anchoMaximo = lienzo.width * 0.7;
    const altoMaximo = lienzo.height * 0.6;

    const escala = Math.min(anchoMaximo / estado.imagen.width, altoMaximo / estado.imagen.height);
    const ancho = Math.round(estado.imagen.width * escala);
    const alto = Math.round(estado.imagen.height * escala);

    return {
        x: Math.round((lienzo.width - ancho) / 2),
        y: Math.round(lienzo.height * 0.85 - alto),
        ancho: ancho,
        alto: alto
    };
}

function cambiarAvance(valor) {
    estado.avance = valor;
    barraAvance.value = Math.round(valor * 1000);
    document.getElementById('avance-texto').textContent = Math.round(valor * 100);
    dibujar();
}

let tiempoAnterior = 0;

function reproducir() {
    if (estado.imagen === null) {
        return;
    }

    if (estado.avance >= 1) {
        cambiarAvance(0);
    }

    estado.reproduciendo = true;
    botonReproducir.textContent = 'Pausar';
    tiempoAnterior = performance.now();
    requestAnimationFrame(siguienteCuadro);
}

function detener() {
    estado.reproduciendo = false;
    botonReproducir.textContent = 'Reproducir';
}

function siguienteCuadro(tiempoActual) {
    if (!estado.reproduciendo) {
        return;
    }

    const segundos = (tiempoActual - tiempoAnterior) / 1000;
    tiempoAnterior = tiempoActual;

    let nuevoAvance = estado.avance + segundos / estado.duracion;

    if (nuevoAvance >= 1) {
        nuevoAvance = 1;
        detener();
    }

    cambiarAvance(nuevoAvance);

    if (estado.reproduciendo) {
        requestAnimationFrame(siguienteCuadro);
    }
}

document.getElementById('archivo').addEventListener('change', function (evento) {
    const archivo = evento.target.files[0];
    if (archivo) {
        cargarDesdeArchivo(archivo);
    }
});

document.getElementById('ejemplo').addEventListener('change', function (evento) {
    if (evento.target.value !== '') {
        cargarImagen(evento.target.value);
    }
});

document.getElementById('efecto').addEventListener('change', function (evento) {
    estado.efecto = evento.target.value;
    calcularTiempos(estado.cubos, estado.efecto);
    dibujar();
});

document.getElementById('tamano').addEventListener('input', function (evento) {
    estado.tamano = Number(evento.target.value);
    document.getElementById('tamano-texto').textContent = estado.tamano;
    prepararTodo();
});

document.getElementById('duracion').addEventListener('input', function (evento) {
    estado.duracion = Number(evento.target.value);
    document.getElementById('duracion-texto').textContent = estado.duracion;
});

document.getElementById('fondo').addEventListener('input', function (evento) {
    estado.colorFondo = evento.target.value;
    dibujar();
});

botonReproducir.addEventListener('click', function () {
    if (estado.reproduciendo) {
        detener();
    } else {
        reproducir();
    }
});

barraAvance.addEventListener('input', function () {
    detener();
    cambiarAvance(Number(barraAvance.value) / 1000);
});

escenario.addEventListener('dragover', function (evento) {
    evento.preventDefault();
    escenario.classList.add('arrastrando');
});

escenario.addEventListener('dragleave', function () {
    escenario.classList.remove('arrastrando');
});

escenario.addEventListener('drop', function (evento) {
    evento.preventDefault();
    escenario.classList.remove('arrastrando');

    const archivo = evento.dataTransfer.files[0];
    if (archivo) {
        cargarDesdeArchivo(archivo);
    }
});

window.addEventListener('resize', function () {
    prepararTodo();
});

prepararTodo();
