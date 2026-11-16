function dibujar() {
    const lienzo = document.getElementById('lienzo');
    const ctx = lienzo.getContext('2d');

    ctx.globalAlpha = 1;
    ctx.fillStyle = estado.colorFondo;
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);

    if (estado.imagen === null) {
        return;
    }

    const caja = estado.caja;

    if (estado.avance < INICIO_OLA) {
        ctx.drawImage(estado.imagen, caja.x, caja.y, caja.ancho, caja.alto);
        return;
    }

    for (let i = 0; i < estado.cubos.length; i++) {
        const cubo = estado.cubos[i];

        if (estado.avance < cubo.aparece) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = cubo.color;
            ctx.fillRect(cubo.x, cubo.y, estado.lado, estado.lado);
            continue;
        }

        moverCubo(cubo, estado.avance, estado.efecto, caja, estado.lado);

        if (cubo.opacidad <= 0) {
            continue;
        }

        const recienAparecido = estado.avance - cubo.aparece < 0.03;

        dibujarCubo(ctx, cubo, cubo.posX, cubo.posY, estado.lado * cubo.escala, cubo.opacidad, recienAparecido);
    }

    ctx.globalAlpha = 1;
}

function dibujarCubo(ctx, cubo, x, y, lado, opacidad, brillando) {
    const borde = lado * 0.35;

    ctx.globalAlpha = opacidad;

    if (lado >= 2.5) {
        ctx.fillStyle = cubo.colorClaro;
        ctx.fillRect(x + borde, y - borde, lado, borde);

        ctx.fillStyle = cubo.colorOscuro;
        ctx.fillRect(x + lado, y - borde, borde, lado);
    }

    if (brillando) {
        ctx.fillStyle = cubo.colorClaro;
    } else {
        ctx.fillStyle = cubo.color;
    }
    ctx.fillRect(x, y, lado, lado);
}
