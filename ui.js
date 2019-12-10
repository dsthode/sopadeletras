var draw = null;

SVG.on(document, 'DOMContentLoaded', function() {
  document.getElementById('btn-nueva-palabra').addEventListener('click', nuevaPalabra);
  document.getElementById('btn-generar').addEventListener('click', generar);
  document.getElementById('btn-descargar').addEventListener('click', descargar);
});

function nuevaPalabra(ev) {
  ev.preventDefault();
  var contenedor = document.getElementById('palabras');
  var fila = document.createElement('div');
  fila.setAttribute('class', 'enlinea');
  var input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'palabra');
  fila.appendChild(input);
  var boton = document.createElement('button');
  boton.setAttribute('class', 'button-error pure-button');
  boton.addEventListener('click', eliminarPalabra);
  boton.innerHTML = '&times';
  fila.appendChild(boton);
  contenedor.appendChild(fila);
  input.focus();
};

function eliminarPalabra(ev) {
  ev.preventDefault();
  var btn = ev.target;
  var fila = btn.parentNode;
  fila.parentNode.removeChild(fila);
};

function descargar(ev) {
  ev.preventDefault();
  if (draw == null) {
    alert('Primero debe generar la sopa de letras');
    return;
  }
  let texto = draw.svg();
  let blob = new Blob([texto], {type:'application/octet-stream'});
  saveAs(blob, 'sopa de letras.svg');
}

function generar(ev) {
  ev.preventDefault();
  var contenedor = document.getElementById('sopa');
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
  var ancho = document.getElementsByName('ancho')[0].value;
  var alto = document.getElementsByName('alto')[0].value;
  var tablero = new Tablero(ancho, alto);
  var palabras = document.getElementsByName('palabra');
  var ok = true;
  palabras.forEach(palabraElement => {
    if (!/^[ABCDEFGHIJKLMNÑOPQRSTUVWXYZ]+$/.test(palabraElement.value.toUpperCase())) {
      ok = false;
    }
    tablero.anadirPalabra(palabraElement.value.toUpperCase());
  });
  if (!ok) {
    alert("Hay palabras no validas, solamente se pueden escribir letras de la A a la Z");
    return;
  }
  tablero.generarTablero();
  draw = SVG().addTo('#sopa').size('100%', '100%');

  for (let x=0; x<=ancho; x++) {
    for (let y=0; y<=alto; y++) {
      draw.line(0, y*50, ancho*50, y*50).stroke('#000');
      draw.line(x*50, 0, x*50, alto*50).stroke('#000');
    }
  }
  for (let x=0; x<ancho; x++) {
    for (let y=0; y<alto; y++) {
      draw.text(tablero.letra(x, y))
        .move(x*50+25, y*50)
        .fill('#000')
        .font('size', 24)
        .font('family', 'Helvetica')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central');
    }
  }
};
