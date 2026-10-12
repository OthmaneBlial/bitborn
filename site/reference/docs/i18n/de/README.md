# bitborn — Software aus rohen Bits

[Website ausprobieren](https://othmaneblial.github.io/bitborn/) · [Vollständige README](../../../README.md) · [Sprachen](../README.md)

Schreibe die tatsächlichen Bytes eines x86-Programms als Nullen und Einsen.
Bitborns Maschinenbefehle werden von Hand in `.bits`-Dateien geschrieben: Kein
Assembler oder Compiler bestimmt Opcodes, Operanden oder Sprungabstände.
Befehlsnamen in Kommentaren erklären die Bytes, erzeugen sie aber nicht. Python
verpackt die Bytes und ergänzt Dateiköpfe oder Sektorstrukturen. JavaScript
betreibt die Lernwebsite.

## Deinen ersten Befehl lesen

```text
10111000 00101010 00000000
```

Bei einer Operandengröße von 16 Bit bedeuten diese drei Bytes `MOV AX,42`.
`B8` wählt das Register; `2A 00` speichert 42 mit dem niederwertigen Byte zuerst.
Der Ausführungsmodus zählt: Bei 32-Bit-Operanden benötigt `B8` vier unmittelbare
Operandenbytes statt zwei. Das CPU Lab im Browser führt nur die dokumentierte
Teilmenge der 16-Bit-Befehle aus.

## Ausprobieren

Im [CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/) kannst du schrittweise
ausführen, Register, Flags, Stack und Speicher ansehen und aufgezeichnete Zustände
mit Back und Forward wiederherstellen. Im [Bootsektor-Editor](https://othmaneblial.github.io/bitborn/boot-builder/)
lässt sich ein vollständiges 512-Byte-Abbild bearbeiten und exportieren.
Aufgaben vermitteln Änderungen an tatsächlichen Bytes; dein Fortschritt bleibt
im Browser.

Zum Erstellen und Testen der echten Bootprogramme benötigst du Python 3.10+, Make
und QEMU. Unter macOS: `brew install qemu`. Unter Ubuntu:
`sudo apt-get install python3 make qemu-system-x86`.

```sh
git clone https://github.com/OthmaneBlial/bitborn.git
cd bitborn
make test
make run
```

`make test` prüft die überprüften Bytes und das Gastverhalten in QEMU ohne
grafische Oberfläche. `make run` öffnet das BIOS-Bootabbild. BIOS-Beispiele laufen
mit QEMU auch auf Apple Silicon; native ELF-Beispiele benötigen Linux x86-64.
Für Browser-Entwicklungstests brauchst du außerdem Node.js und Playwright;
Näheres steht im Beitragsleitfaden.

## Umfang und Fortschritt

Das Repository enthält BIOS-Bootprogramme, Tastatur-/VGA-/Diskettenexperimente,
eine interaktive Shell, ein separates Interrupt-Experiment im Protected Mode
und Linux-ELF-Beispiele. Der Browser verwendet ein Lernmodell mit 1 MiB Speicher
und einem Limit von 4,096 Schritten, keine vollständige CPU oder BIOS-Implementierung.
Importierte Programme werden interpretiert und niemals als nativer Hostcode
ausgeführt. Unterstützung für echte Hardware, UEFI oder ein Produktionssystem
ist nicht nachgewiesen. Nutze für native Experimente verwerfbare Emulatorumgebungen.

[Roadmap und Nachweise](../../../ROADMAP.md) · [Fortschritt auf der Website](https://othmaneblial.github.io/bitborn/roadmap/) · [Änderungsprotokoll](../../../CHANGELOG.md)

Beginne mit dem [Tutorial](../../tutorials/from-bits-to-boot.md) und dem
[Architekturleitfaden](../../architecture/README.md). Beachte die
[Beitragsregeln](../../../CONTRIBUTING.md) und den [Verhaltenskodex](../../../CODE_OF_CONDUCT.md).
Melde Sicherheitslücken [vertraulich](../../../SECURITY.md). Code und Dokumentation
stehen unter der [MIT-Lizenz](../../../LICENSE). Die englische Einführung ist die
Übersetzungsgrundlage; ausführliche technische Anleitungen bleiben vorerst englisch.
