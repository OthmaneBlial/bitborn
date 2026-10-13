# bitborn — du logiciel à partir de bits bruts

[Essayer le site](https://othmaneblial.github.io/bitborn/) · [README complet](../../../README.md) · [Langues](../README.md)

Écrivez les octets réels d'un programme x86 avec des 0 et des 1. Les instructions
de Bitborn sont écrites à la main dans des fichiers `.bits` : aucun assembleur
ni compilateur ne choisit les opcodes, opérandes ou déplacements de saut. Les noms
d'instructions dans les commentaires expliquent les octets sans les générer.
Python empaquette les octets et ajoute les en-têtes ou la structure des secteurs.
JavaScript fait fonctionner le site pédagogique.

## Lire votre première instruction

```text
10111000 00101010 00000000
```

Avec des opérandes de 16 bits, ces trois octets signifient `MOV AX,42`. `B8`
sélectionne le registre ; `2A 00` représente 42, octet de poids faible d'abord.
Le mode d'exécution compte : avec des opérandes de 32 bits, `B8` attend quatre
octets de valeur immédiate au lieu de deux. Le CPU Lab du navigateur exécute
uniquement son sous-ensemble documenté de 16 bits.

## Essayer

Le [CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/) permet d'avancer pas à
pas, d'inspecter registres, indicateurs, pile et mémoire, puis de restaurer les
états enregistrés avec Back et Forward. Le [constructeur de secteur d'amorçage](https://othmaneblial.github.io/bitborn/boot-builder/)
permet de modifier et d'exporter une image complète de 512 octets. Les défis
enseignent la modification des octets ; votre progression reste dans le navigateur.

Pour construire et tester les vrais programmes d'amorçage, installez Python 3.10+,
Make et QEMU. Sur macOS : `brew install qemu nasm ffmpeg`. Sur Ubuntu :
`sudo apt-get install python3 make qemu-system-x86 nasm ffmpeg`.

Les vérifications complètes utilisent aussi NDISASM (fourni par NASM) pour lire les octets des instructions existantes et FFmpeg pour vérifier les pixels des GIF capturés. Aucun de ces outils ne génère les instructions du programme.

```sh
git clone https://github.com/OthmaneBlial/bitborn.git
cd bitborn
make test
make run
```

`make test` vérifie les octets relus et le comportement de la machine virtuelle
dans QEMU sans interface graphique. `make run` ouvre l'image BIOS. Les exemples
BIOS fonctionnent dans QEMU sur Apple Silicon ; les ELF natifs nécessitent Linux
x86-64. Les tests du navigateur demandent aussi Node.js et Playwright : voir le
guide de contribution.

## Périmètre et progression

Le dépôt contient des programmes BIOS, des expériences clavier/VGA/disque, un shell
interactif, une expérience distincte d'interruption en mode protégé et des exemples
ELF Linux. Le navigateur utilise un modèle pédagogique limité à 1 MiB et 4 096 pas,
pas un CPU ou un BIOS complet. Les programmes importés sont interprétés, jamais
exécutés comme code natif de l'hôte. La compatibilité avec le matériel physique,
UEFI ou un système de production n'est pas établie. Utilisez des émulateurs jetables
pour les expériences natives.

[Feuille de route et preuves](../../../ROADMAP.md) · [Progression du site](https://othmaneblial.github.io/bitborn/roadmap/) · [Journal des changements](../../../CHANGELOG.md)

Commencez par le [tutoriel](../../tutorials/from-bits-to-boot.md) et le
[guide d'architecture](../../architecture/README.md). Respectez les
[règles de contribution](../../../CONTRIBUTING.md) et le [code de conduite](../../../CODE_OF_CONDUCT.md).
Signalez les vulnérabilités [en privé](../../../SECURITY.md). Code et documentation
sont sous [licence MIT](../../../LICENSE). L'introduction anglaise sert de source
à cette traduction ; les guides techniques détaillés restent en anglais.
