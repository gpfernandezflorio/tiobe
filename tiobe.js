const Lenguajes = {};

const inicializar = function() {
  let data = document.createElement('datalist');
  data.setAttribute("id", "lista-lenguajes");
  for (let k in Lenguajes) {
    let opcion = document.createElement('option');
    opcion.innerHTML = k;
    data.appendChild(opcion);
  }
  document.body.appendChild(data);
  agregarLenguaje(false);
  agregarLenguaje(false);
  redimensionar();
};

const redimensionar = function() {
  let w = window.innerWidth - 45;
  const ajustes = document.getElementById("cellAjustes");
  let h = window.innerHeight - 30;
  if (ajustes.style.display != 'none') {
    document.getElementById("ajustes").style.height = h - 75;
    w -= ajustes.getClientRects()[0].width + 5;
  }
  const canvas = document.getElementById("canvas");
  canvas.width = w;
  canvas.height = h;
  graficar();
};

const botonEsconder = function() {
  document.getElementById("cellAjustes").style.display = 'none';
  document.getElementById("menuFlotante").style.display = 'block';
  redimensionar();
};

const botonMostrar = function() {
  document.getElementById("menuFlotante").style.display = 'none';
  document.getElementById("cellAjustes").style.display = 'block';
  redimensionar();
};

const rangox = function(k, delta) {
  document.getElementById(k).value = datosAjustes()[k] + delta;
  graficar();
};

const datosAjustes = function() {
  let k = 0;
  let langs = [];
  while(document.getElementById(`lang_name_${k}`)) {
    let lang = document.getElementById(`lang_name_${k}`).value;
    langs.push({k, lang,
      color:document.getElementById(`lang_color_${k}`).value
    });
    if (!(lang in Lenguajes)) {
      document.getElementById(`lang_color_${k}`).parentNode.parentNode.childNodes[0].style.backgroundColor = '#fff';
    }
    k++;
  }
  langs = langs.filter(x => x.lang in Lenguajes);
  let coloresEnUso = langs.filter(x => x.color.length > 0).map(x => x.color);
  for (let lang of langs) {
    if (lang.color.length == 0) {
      let color = nuevoColor(coloresEnUso);
      lang.color = color;
      coloresEnUso.push(color);
    }
    document.getElementById(`lang_color_${lang.k}`).parentNode.parentNode.childNodes[0].style.backgroundColor = lang.color;
  }
  let xmin = document.getElementById("xmin").value;
  if (xmin === '') {
    if (langs.length == 0) {
      xmin = 2001;
    } else {
      xmin = Math.floor(
        langs.map(x =>
          Lenguajes[x.lang].map(x => x.x)
            .reduce((rec, x) => Math.min(rec, x))
        ).reduce((rec, x) => Math.min(rec, x))
      );
    }
  } else {
    xmin = Number.parseFloat(xmin);
  }
  let xmax = document.getElementById("xmax").value;
  if (xmax === '') {
    if (langs.length == 0) {
      xmax = 2024;
    } else {
      xmax = Math.ceil(
        langs.map(x =>
          Lenguajes[x.lang].map(x => x.x)
            .reduce((rec, x) => Math.max(rec, x))
        ).reduce((rec, x) => Math.max(rec, x))
      );
    }
  } else {
    xmax = Number.parseFloat(xmax);
  }
  let ymin = 0;
  let ymax = 1;
  langs = langs.filter(x => Lenguajes[x.lang].some(x => x.x >= xmin && x.x <= xmax));
  if (langs.length > 0) {
    ymin = Math.floor(
      langs.map(x =>
        Lenguajes[x.lang]
          .filter(x => x.x >= xmin && x.x <= xmax)
          .map(x => x.y)
          .reduce((rec, x) => Math.min(rec, x))
      ).reduce((rec, x) => Math.min(rec, x))
    );
    ymax = Math.floor(
      langs.map(x =>
        Lenguajes[x.lang]
          .filter(x => x.x >= xmin && x.x <= xmax)
          .map(x => x.y)
          .reduce((rec, x) => Math.max(rec, x))
      ).reduce((rec, x) => Math.max(rec, x))
    ) + 3;
  }
  return {k, langs, xmin, xmax, ymin, ymax};
};

const nuevoLenguaje = function(langs) {
  let i = 0;
  let keys = Object.keys(Lenguajes);
  while (langs.includes(keys[i])) {
    i++;
  }
  return keys[i];
};

const agregarLenguaje = function(yGraficar=true) {
  const datos = datosAjustes();
  const tabla = document.createElement('table');
  tabla.innerHTML = `<tr><td><button title="Quitar este lenguaje" onclick="quitarLenguaje(${datos.k
    });">-</button></td><td>Lenguaje:</td><td><input id="lang_name_${datos.k
    }" type="text" oninput="graficar()" list="lista-lenguajes"></td></tr>` +
    `<tr><td></td><td>Color:</td><td><input id="lang_color_${datos.k
    }" type="text" oninput="graficar()"></td></tr>`;
  tabla.className = 'lang';
  document.getElementById("selectorLenguajes").appendChild(tabla);
  document.getElementById(`lang_name_${datos.k}`).value = nuevoLenguaje(datos.langs.map(x => x.lang));
  if (datos.k + 1 >= Object.keys(Lenguajes).length) {
    document.getElementById("botonAgregar").style.display = 'none';
  }
  if (yGraficar) {
    graficar();
  }
};

const quitarLenguaje = function(k) {
  while(document.getElementById(`lang_name_${k+1}`)) {
    document.getElementById(`lang_name_${k}`).value = document.getElementById(`lang_name_${k+1}`).value;
    document.getElementById(`lang_color_${k}`).value = document.getElementById(`lang_color_${k+1}`).value;
    k++;
  }
  let ultimo = document.getElementById(`lang_name_${k}`);
  document.getElementById("selectorLenguajes").removeChild(ultimo.parentNode.parentNode.parentNode.parentNode);
  graficar();
};

const guardar = function() {
  let nombre = prompt("Nombre");
  if (nombre) {
    const campos = ["xmin","xmax"];
    let k = 0;
    while(document.getElementById(`lang_name_${k}`)) {
      campos.push(`lang_name_${k}`);
      campos.push(`lang_color_${k}`);
      k++;
    }
    const datos = {k};
    for (let key of campos) {
      let valor = document.getElementById(key).value;
      if (valor.length > 0) {
        datos[key] = valor;
      }
    }
    let blob = new Blob([JSON.stringify(datos)], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, `${nombre}.json`);
  }
};

const abrir = function() {
  let selectFile = document.getElementById('select_file_wrapper');
  if (selectFile !== null) {
    selectFile.outerHTML = '';
  }
  let selectFileDom = document.createElement('INPUT');
  selectFileDom.type = 'file';
  selectFileDom.id = 'select_file';

  let selectFileWrapperDom = document.createElement('DIV');
  selectFileWrapperDom.id = 'select_file_wrapper';
  selectFileWrapperDom.style.display = 'none';
  selectFileWrapperDom.appendChild(selectFileDom);

  document.body.appendChild(selectFileWrapperDom);
  selectFile = document.getElementById('select_file');
  selectFile.addEventListener('change', function(e) {
    let archivo = e.target.files[0];
    if (archivo) {
      let reader = new FileReader();
      reader.onload = function() {
        importar(JSON.parse(reader.result));
      };
      reader.readAsText(archivo);
    }
  }, false);
  selectFile.click();
};

const importar = function(datos) {
  document.getElementById("selectorLenguajes").innerHTML = '';
  const campos = ["xmin","xmax"];
  for (let i=0; i<datos.k; i++) {
    agregarLenguaje(false);
    campos.push(`lang_name_${i}`);
    campos.push(`lang_color_${i}`);
  }
  for (let key of campos) {
    document.getElementById(key).value = (key in datos ? datos[key] : '');
  }
  graficar();
};

window.addEventListener('load', inicializar, false);
window.addEventListener('resize', redimensionar, false);