'use strict';

class Tablero {
  constructor(ancho, alto) {
    this.ancho = ancho;
    this.alto = alto;
    this.palabras = [];
    this.rejilla = [];
    this.rejilla.length = this.alto * this.ancho;
  }

  anadirPalabra(palabra) {
    if (palabra.lenth > this.alto
      || palabra.length > this.ancho) {
        throw 'La palabra es demasiado larga y no cabe en el tablero';
    }
    if (!this.contienePalabra(palabra)) {
      this.palabras.push({
        palabra: palabra,
        posicion: null,
        direccion: null
      });
    }
  }

  contienePalabra(palabra) {
    let existe = false;
    this.palabras.forEach(item => {
      if (item.palabra == palabra) {
        existe = true;
      }
    })
    return existe;
  }

  borrarRejilla() {
    this.rejilla.fill('');
  }

  relenarHuecos() {
    for (let i=0; i < this.alto * this.ancho; i++) {
      if (this.rejilla[i] === '') {
        this.rejilla[i] = Tablero.letras[this.randInt(Tablero.letras.length)];
      }
    }
  }

  colocarPalabra(palabra, posicion, direccion) {
    let offset = posicion;
    for (let c of palabra) {
      this.rejilla[offset] = c;
      offset = this.desplazarOffset(offset, direccion);
    }
  }

  generarTablero() {
    this.palabras.forEach(item => {
      this.borrarRejilla();
      this.buscarPosiciones();
    })
    this.borrarRejilla();
    this.palabras.forEach(item => {
      this.colocarPalabra(item.palabra, item.posicion, item.direccion);
    })
    this.relenarHuecos();
  }

  buscarPosiciones() {
    this.palabras.forEach(item => {
      if (item.posicion != null) {
        this.colocarPalabra(item.palabra, item.posicion, item.direccion);
      } else {
        let {posicion, direccion} = this.probarPalabra(item.palabra);
        if (posicion != null) {
          item.posicion = posicion;
          item.direccion = direccion;
          this.colocarPalabra(item.palabra, item.posicion, item.direccion);
        } else {
          throw 'No se ha podido colocar la palabra';
        }
      }
    });
  }

  probarPalabra(palabra) {
    let posicion = null;
    let direccion = null;
    let intentos = 0;
    let colocado = false;
    do {
      posicion = this.randInt(this.rejilla.length);
      direccion = Tablero.direcciones[this.randInt(Tablero.direcciones.length)];
      intentos += 1;
      colocado = this.comprobarPosicion(posicion, direccion, palabra.length);
    } while (!colocado && intentos < 1000)
    if (!colocado) {
      return {posicion: null, direccion: null};
    }
    return {posicion: posicion, direccion: direccion};
  }

  comprobarPosicion(posicion, direccion, longitud) {
    let {x, y} = this.offsetXY(posicion);
    for (let i=0; i<longitud; i++) {
      if (!this.xyEnTablero(x, y)) {
        return false;
      }
      if (this.rejilla[this.xyOffset(x, y)] != '') {
        return false;
      }
      ({x, y} = this.desplazarXY(x, y, direccion));
    }
    return true;
  }

  letra(x, y) {
    return this.rejilla[this.xyOffset(x, y)];
  }

  offsetEnTablero(offset) {
    let {x, y} = this.offsetXY(offset);
    return this.xyEnTablero(x, y);
  }

  xyEnTablero(x, y) {
    return (x >= 0 
      && y >= 0
      && x < this.ancho 
      && y < this.alto);
  }

  desplazarOffset(offset, direccion) {
    let {x, y} = this.offsetXY(offset);
    ({x, y} = this.desplazarXY(x, y, direccion));
    return this.xyOffset(x, y);
  }

  desplazarXY(x, y, direccion) {
    switch(direccion) {
      case 'q':
        return {
          x: x-1,
          y: y-1
        };
      case 'w':
        return {
          x: x,
          y: y-1
        };
      case 'e':
        return {
          x: x+1,
          y: y-1
        };
      case 'a':
        return {
          x: x-1,
          y: y
        };
      case 'd':
        return {
          x: x+1,
          y: y
        };
      case 'z':
        return {
          x: x-1,
          y: y+1
        };
      case 'x':
        return {
          x: x,
          y: y+1
        };
      case 'c':
        return {
          x: x+1,
          y: y+1
        };
    }
}

  offsetXY(offset) {
    return {
      x: offset % this.ancho,
      y: Math.floor(offset / this.ancho)
    }
  }

  xyOffset(x, y) {
    return y * this.ancho + x;
  }

  randInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}

Tablero.letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
/**
 * Direcciones:
 * q w e
 * a   d
 * z x c
 */
Tablero.direcciones = 'qweadzxc';
