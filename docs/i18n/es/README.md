# bitborn — software nacido de bits

[Probar el sitio](https://othmaneblial.github.io/bitborn/) · [README completo](../../../README.md) · [Idiomas](../README.md)

Escribe los bytes reales de un programa x86 con ceros y unos. Las instrucciones
de Bitborn se escriben a mano en archivos `.bits`: ningún ensamblador ni compilador
elige los códigos de operación, operandos o desplazamientos de salto. Los nombres
de instrucciones en comentarios explican los bytes; no los generan. Python
empaqueta los bytes y añade cabeceras o estructuras de sectores. JavaScript
permite explorar el proyecto en el sitio educativo.

## Tu primera instrucción

```text
10111000 00101010 00000000
```

Con un tamaño de operando de 16 bits, estos tres bytes significan `MOV AX,42`.
`B8` selecciona el registro y `2A 00` almacena 42 empezando por el byte menos
significativo. El modo importa: con operandos de 32 bits, `B8` necesita cuatro
bytes de valor inmediato en lugar de dos. El laboratorio del navegador ejecuta
solo el subconjunto documentado de instrucciones de 16 bits.

## Pruébalo

En el [CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/) puedes ejecutar paso
a paso, observar registros, indicadores, pila y memoria, y recuperar estados
grabados con Back y Forward. El [constructor de sectores de arranque](https://othmaneblial.github.io/bitborn/boot-builder/)
permite editar y exportar una imagen completa de 512 bytes. Los retos enseñan a
modificar bytes literales; el progreso se guarda en tu navegador.

Para construir el paquete y probar los programas de arranque reales necesitas
Python 3.10+, Make y QEMU. En macOS: `brew install qemu`. En Ubuntu:
`sudo apt-get install python3 make qemu-system-x86`.

```sh
git clone https://github.com/OthmaneBlial/bitborn.git
cd bitborn
make test
make run
```

`make test` verifica los bytes revisados y el comportamiento de la máquina virtual
en QEMU sin interfaz gráfica. `make run` abre la imagen de arranque BIOS. Los ejemplos
BIOS funcionan con QEMU en Apple Silicon; los ELF nativos necesitan Linux x86-64.
Las pruebas de desarrollo del navegador requieren además Node.js y Playwright.
Consulta la guía de contribución.

## Alcance y progreso

El repositorio incluye programas de arranque BIOS, experimentos de teclado/VGA/disco,
una shell interactiva, un experimento separado de interrupciones en modo protegido
y ejemplos ELF para Linux. El navegador usa un modelo educativo limitado a 1 MiB
de memoria y 4,096 pasos, no una CPU o BIOS completa. Los programas importados se
interpretan; no se ejecutan como código nativo del anfitrión. No se ha establecido
compatibilidad con hardware físico, UEFI ni sistemas operativos de producción.
Usa emuladores desechables para los experimentos nativos.

[Hoja de ruta y pruebas](../../../ROADMAP.md) · [Progreso del sitio](https://othmaneblial.github.io/bitborn/roadmap/) · [Registro de cambios](../../../CHANGELOG.md)

Empieza con el [tutorial](../../tutorials/from-bits-to-boot.md) y la
[guía de arquitectura](../../architecture/README.md). Respeta las
[reglas de contribución](../../../CONTRIBUTING.md) y el [código de conducta](../../../CODE_OF_CONDUCT.md).
Comunica vulnerabilidades [en privado](../../../SECURITY.md). El código y la
documentación usan la [licencia MIT](../../../LICENSE). La introducción inglesa
es la fuente de esta traducción; las guías técnicas detalladas siguen en inglés.
