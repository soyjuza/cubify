const INICIO_OLA = 0.05;
const DURACION_OLA = 0.3;
const ESPERA = 0.1;
const DURACION_VUELO = 0.45;

function calcularTiempos(cubos, efecto) {
    for (let i = 0; i < cubos.length; i++) {
        const cubo = cubos[i];
        let orden;

        if (efecto === 'viento') {
            orden = cubo.columna;
        } else if (efecto === 'explosion') {
            const dx = cubo.columna - 0.5;
            const dy = cubo.fila - 0.5;
            orden = Math.sqrt(dx * dx + dy * dy) / 0.71;
        } else {
            orden = cubo.fila;
        }

        orden = orden * 0.85 + cubo.azar4 * 0.15;

        cubo.aparece = INICIO_OLA + orden * DURACION_OLA;
        cubo.suelta = cubo.aparece + ESPERA + cubo.azar1 * 0.07;
    }
}

function moverCubo(cubo, avance, efecto, caja, lado) {
    let t = (avance - cubo.suelta) / DURACION_VUELO;

    if (t <= 0) {
        cubo.posX = cubo.x;
        cubo.posY = cubo.y;
        cubo.escala = 1;
        cubo.opacidad = 1;
        return;
    }

    if (t > 1) {
        t = 1;
    }

    if (efecto === 'remolino') {
        remolino(cubo, t, caja);
    } else if (efecto === 'viento') {
        viento(cubo, t);
    } else if (efecto === 'explosion') {
        explosion(cubo, t, caja);
    } else {
        derrumbe(cubo, t, caja, lado);
    }
}

function remolino(cubo, t, caja) {
    const centro = caja.x + caja.ancho / 2;
    const distancia = cubo.x - centro;

    let radio = Math.abs(distancia);
    const suave = t * t * (3 - 2 * t);
    radio = radio + (30 + cubo.azar1 * 70 - radio) * suave;

    let angulo = 0;
    if (distancia < 0) {
        angulo = Math.PI;
    }
    const vueltas = 1.5 + cubo.azar2 * 1.5;
    angulo = angulo + vueltas * 2 * Math.PI * t * t;

    const x = centro + radio * Math.cos(angulo);
    const profundidad = radio * Math.sin(angulo);
    const y = cubo.y + (-40 - cubo.y) * Math.pow(t, 1.7);

    let opacidad = 1;
    if (t > 0.6) {
        opacidad = 1 - (t - 0.6) / 0.4;
    }
    if (profundidad < 0) {
        opacidad = opacidad * 0.6;
    }

    cubo.posX = x;
    cubo.posY = y;
    cubo.escala = (1 - 0.45 * t) * perspectiva(profundidad);
    cubo.opacidad = opacidad;
}

function viento(cubo, t) {
    const x = cubo.x - (140 + cubo.azar1 * 600) * Math.pow(t, 1.5);
    const ondulacion = Math.sin(t * 6 + cubo.azar3 * 6.28) * 18 * t;
    const y = cubo.y - (30 + cubo.azar2 * 250) * t + ondulacion;
    const profundidad = (cubo.azar4 - 0.35) * 300 * t;

    let opacidad = 1;
    if (t > 0.7) {
        opacidad = 1 - (t - 0.7) / 0.3;
    }

    cubo.posX = x;
    cubo.posY = y;
    cubo.escala = (1 - 0.5 * t) * perspectiva(profundidad);
    cubo.opacidad = opacidad;
}

function explosion(cubo, t, caja) {
    const centroX = caja.x + caja.ancho / 2;
    const centroY = caja.y + caja.alto / 2;
    let dx = cubo.x - centroX;
    let dy = cubo.y - centroY;
    const largo = Math.max(Math.sqrt(dx * dx + dy * dy), 1);

    dx = dx / largo;
    dy = dy / largo;

    const fuerza = 120 + cubo.azar1 * 380;
    const e = 1 - Math.pow(1 - t, 3);

    const x = cubo.x + dx * fuerza * e + (cubo.azar2 - 0.5) * 80 * e;
    const y = cubo.y + dy * fuerza * e - 60 * e + 320 * t * t;
    const profundidad = (cubo.azar3 - 0.25) * 400 * e;

    let opacidad = 1;
    if (t > 0.72) {
        opacidad = 1 - (t - 0.72) / 0.28;
    }

    cubo.posX = x;
    cubo.posY = y;
    cubo.escala = (1 - 0.35 * t) * perspectiva(profundidad);
    cubo.opacidad = opacidad;
}

function derrumbe(cubo, t, caja, lado) {
    const capa = Math.floor(cubo.azar3 * cubo.azar3 * caja.alto * 0.13 / lado);
    const piso = caja.y + caja.alto - lado - capa * lado;

    const altura = Math.max(0, piso - cubo.y);

    let y;
    if (t < 0.7) {
        const caida = t / 0.7;
        y = cubo.y + altura * caida * caida;
    } else {
        y = cubo.y + altura;
    }

    const e = Math.min(1, t / 0.7);
    const x = cubo.x + (cubo.azar1 - 0.5) * 2 * (30 + cubo.azar2 * 90) * e;

    cubo.posX = x;
    cubo.posY = y;
    cubo.escala = 1;
    cubo.opacidad = 1;
}

function perspectiva(profundidad) {
    return 900 / (900 - profundidad);
}
