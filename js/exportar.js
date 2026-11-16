const botonImagen = document.getElementById('descargar-imagen');
const botonVideo = document.getElementById('descargar-video');
const estadoVideo = document.getElementById('estado-video');

function descargarImagen() {
    if (estado.imagen === null) {
        mostrarError('Primero elige una imagen.');
        return;
    }

    lienzo.toBlob(function (archivo) {
        descargarArchivo(archivo, 'imagen-en-cubos.png');
    }, 'image/png');
}

function elegirFormatoVideo() {
    const formatos = [
        'video/mp4;codecs=avc1.42E01E',
        'video/mp4;codecs=avc1',
        'video/webm;codecs=vp9',
        'video/webm'
    ];

    for (let i = 0; i < formatos.length; i++) {
        if (MediaRecorder.isTypeSupported(formatos[i])) {
            return formatos[i];
        }
    }

    return null;
}

function descargarVideo() {
    if (estado.imagen === null) {
        mostrarError('Primero elige una imagen.');
        return;
    }

    if (typeof MediaRecorder === 'undefined' || elegirFormatoVideo() === null) {
        mostrarError('Este navegador no puede grabar video. Prueba con Chrome, Edge o Firefox.');
        return;
    }

    const formato = elegirFormatoVideo();
    let extension = 'webm';
    if (formato.startsWith('video/mp4')) {
        extension = 'mp4';
    }

    const flujo = lienzo.captureStream(30);
    const grabadora = new MediaRecorder(flujo, { mimeType: formato });
    const pedazos = [];

    grabadora.ondataavailable = function (evento) {
        if (evento.data.size > 0) {
            pedazos.push(evento.data);
        }
    };

    grabadora.onstop = function () {
        const video = new Blob(pedazos, { type: formato });
        descargarArchivo(video, 'imagen-en-cubos.' + extension);

        botonVideo.disabled = false;
        estadoVideo.textContent = 'Listo. El video se descargó.';
    };

    botonVideo.disabled = true;
    estadoVideo.textContent = 'Grabando... espera a que termine la animación.';

    detener();
    cambiarAvance(0);
    grabadora.start();

    setTimeout(function () {
        reproducir();
        esperarFin(grabadora);
    }, 500);
}

function esperarFin(grabadora) {
    if (estado.reproduciendo) {
        requestAnimationFrame(function () {
            esperarFin(grabadora);
        });
        return;
    }

    setTimeout(function () {
        grabadora.stop();
    }, 500);
}

function descargarArchivo(archivo, nombre) {
    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    enlace.click();

    setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 1000);
}

botonImagen.addEventListener('click', descargarImagen);
botonVideo.addEventListener('click', descargarVideo);
