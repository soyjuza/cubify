const MAXIMO_CUBOS = 15000;

const OPACIDAD_MINIMA = 0.2;

function crearCubos(imagen, caja, tamano) {
    let lado = tamano;
    let cubos = calcularCubos(imagen, caja, lado);

    while (cubos.length > MAXIMO_CUBOS) {
        lado = lado + 1;
        cubos = calcularCubos(imagen, caja, lado);
    }

    return {
        cubos: cubos,
        lado: lado
    };
}

function calcularCubos(imagen, caja, lado) {
    const columnas = Math.ceil(caja.ancho / lado);
    const filas = Math.ceil(caja.alto / lado);

    const pequena = document.createElement('canvas');
    pequena.width = columnas;
    pequena.height = filas;

    const ctx = pequena.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imagen, 0, 0, caja.ancho / lado, caja.alto / lado);

    const datos = ctx.getImageData(0, 0, columnas, filas).data;

    const cubos = [];

    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
            const posicion = (fila * columnas + columna) * 4;
            const rojo = datos[posicion];
            const verde = datos[posicion + 1];
            const azul = datos[posicion + 2];
            const alfa = datos[posicion + 3] / 255;

            if (alfa < OPACIDAD_MINIMA) {
                continue;
            }

            cubos.push({
                x: caja.x + columna * lado,
                y: caja.y + fila * lado,

                fila: fila / filas,
                columna: columna / columnas,

                color: colorTexto(rojo, verde, azul, 1),
                colorClaro: colorTexto(rojo, verde, azul, 1.3),
                colorOscuro: colorTexto(rojo, verde, azul, 0.65),

                azar1: Math.random(),
                azar2: Math.random(),
                azar3: Math.random(),
                azar4: Math.random(),

                aparece: 0,
                suelta: 0,

                posX: 0,
                posY: 0,
                escala: 1,
                opacidad: 1
            });
        }
    }

    return cubos;
}

function colorTexto(rojo, verde, azul, brillo) {
    const r = Math.min(255, Math.round(rojo * brillo));
    const g = Math.min(255, Math.round(verde * brillo));
    const b = Math.min(255, Math.round(azul * brillo));
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}
