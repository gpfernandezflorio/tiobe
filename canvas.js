const colores = ['#00a', '#a00', '#0a0', '#aa0', '#088', '#808', '#aaf', '#faa', '#afa'];

const nuevoColor = function(coloresEnUso) {
  let iColor = 0;
  while(iColor < colores.length && coloresEnUso.includes(colores[iColor])) {
    iColor ++;
  }
  return colores[iColor % colores.length];
}

const dibujarPath = function(ctx, datos, escala, color) {
  if (datos.length < 2) { return; }
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(escala.x(datos[0].x), escala.y(datos[0].y));
  for (let d of datos.slice(1)) {
    ctx.lineTo(escala.x(d.x), escala.y(d.y));
    ctx.stroke();
  }
  ctx.closePath();
};

const dibujarGrilla = function(ctx, escala, xmin, xmax, ymin, ymax) {
  ctx.beginPath();
  ctx.strokeStyle = "#ccc";
  let step = Math.max(1,(xmax-xmin)/(canvas.width/10));
  let i = Math.ceil(xmin) + (Number.isInteger(xmin) ? step : 0);
  while (i <= xmax) {
    ctx.moveTo(escala.x(i), canvas.height - 20);
    ctx.lineTo(escala.x(i), 0);
    ctx.stroke();
    i += step;
  }
  step = Math.ceil((ymax-ymin)/(canvas.height/30));
  i = ymin;
  while (i < ymax) {
    ctx.moveTo(escala.x(xmin), escala.y(i));
    ctx.lineTo(canvas.width, escala.y(i));
    ctx.stroke();
    i += step;
  }
  ctx.closePath();
};

const dibujarEjes = function(ctx, escala, xmin, xmax, ymin, ymax) {
  ctx.clearRect(0, 0, escala.x(xmin), canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = "#000";
  ctx.moveTo(escala.x(xmin), canvas.height - 20);
  ctx.lineTo(escala.x(xmax), canvas.height - 20);
  ctx.stroke();
  let step = Math.ceil((xmax-xmin)/(canvas.width/100));
  let i = Math.ceil(xmin);
  while (i <= xmax) {
    ctx.moveTo(escala.x(i), canvas.height - 20);
    ctx.lineTo(escala.x(i), canvas.height - 5);
    ctx.stroke();
    ctx.fillText(i, 5 + escala.x(i), canvas.height - 5);
    i += step;
  }
  ctx.moveTo(escala.x(xmin), canvas.height - 20);
  ctx.lineTo(escala.x(xmin), 0);
  ctx.stroke();
  step = Math.ceil((ymax-ymin)/(canvas.height/30));
  i = ymin;
  while (i < ymax) {
    ctx.moveTo(5, escala.y(i));
    ctx.lineTo(escala.x(xmin), escala.y(i));
    ctx.stroke();
    ctx.fillText(i, 5, 15 + escala.y(i));
    i += step;
  }
  ctx.closePath();
};

const graficar = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const datos = datosAjustes();
  if (datos.xmax > datos.xmin) {
    const m = {
      x: (canvas.width-30) / (datos.xmax-datos.xmin),
      y: (canvas.height-50) / (datos.ymax-datos.ymin)
    };
    const escala = {
      x: x => 25 + (x - datos.xmin)*m.x,
      y: y => canvas.height-30 - (y - datos.ymin)*m.y,
    };
    dibujarGrilla(ctx, escala, datos.xmin, datos.xmax, datos.ymin, datos.ymax);
    for (let lang of datos.langs) {
      dibujarPath(ctx, Lenguajes[lang.lang].filter(x => x.x >= datos.xmin-1 && x.x <= datos.xmax+1), escala, lang.color);
    }
    dibujarEjes(ctx, escala, datos.xmin, datos.xmax, datos.ymin, datos.ymax);
    if (document.getElementById("cellAjustes").style.display == 'none') {
      actualizarLabels(datos);
    }
  }
};

const actualizarLabels = function(datos) {
  const labels = document.getElementById("labels");
  let contenido = datos.langs.map(x =>
    `<span style="border-radius: 5px; padding: 0 5; margin: 0 2; background-color: #fff; border: solid 4px ${x.color}">${x.lang}</span>`
  );
  labels.innerHTML = contenido.join('');
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");