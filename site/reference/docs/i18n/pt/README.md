# bitborn — software nascido de bits

[Experimentar o site](https://othmaneblial.github.io/bitborn/) · [README completo](../../../README.md) · [Idiomas](../README.md)

Escreva os bytes reais de um programa x86 usando zeros e uns. As instruções do
Bitborn são escritas à mão em arquivos `.bits`: nenhum montador ou compilador
escolhe os opcodes, operandos ou deslocamentos de salto. Os nomes das instruções
nos comentários explicam os bytes; não os geram. Python empacota os bytes e
adiciona cabeçalhos ou estruturas de setores. JavaScript alimenta o site educativo.

## Sua primeira instrução

```text
10111000 00101010 00000000
```

Com operandos de 16 bits, estes três bytes significam `MOV AX,42`. `B8` seleciona
o registrador; `2A 00` armazena 42 com o byte menos significativo primeiro.
O modo de execução importa: com operandos de 32 bits, `B8` precisa de quatro bytes
de valor imediato em vez de dois. O CPU Lab do navegador executa somente o
subconjunto documentado de instruções de 16 bits.

## Experimente

No [CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/), execute passo a passo,
inspecione registradores, flags, pilha e memória, ou restaure estados gravados com
Back e Forward. O [editor de setores de inicialização](https://othmaneblial.github.io/bitborn/boot-builder/)
permite editar e exportar uma imagem completa de 512 bytes. Os desafios ensinam
a modificar bytes literais; seu progresso fica no navegador.

Para construir e testar os programas reais, instale Python 3.10+, Make e QEMU.
No macOS: `brew install qemu`. No Ubuntu:
`sudo apt-get install python3 make qemu-system-x86`.

```sh
git clone https://github.com/OthmaneBlial/bitborn.git
cd bitborn
make test
make run
```

`make test` verifica os bytes revisados e o comportamento da máquina virtual no
QEMU sem interface gráfica. `make run` abre a imagem de inicialização BIOS. Os
exemplos BIOS funcionam no QEMU em Apple Silicon; os ELF nativos precisam de Linux
x86-64. Os testes de desenvolvimento do navegador também precisam de Node.js e
Playwright; consulte o guia de contribuição.

## Escopo e progresso

O repositório inclui programas BIOS, experimentos de teclado/VGA/disco, um shell
interativo, um experimento separado de interrupção em modo protegido e exemplos
ELF para Linux. O navegador usa um modelo educativo limitado a 1 MiB de memória
e 4,096 passos, não uma CPU ou BIOS completa. Programas importados são interpretados,
nunca executados como código nativo do host. O suporte a hardware físico, UEFI ou
um sistema de produção não foi comprovado. Use emuladores descartáveis para os
experimentos nativos.

[Roteiro e evidências](../../../ROADMAP.md) · [Progresso no site](https://othmaneblial.github.io/bitborn/roadmap/) · [Histórico de mudanças](../../../CHANGELOG.md)

Comece pelo [tutorial](../../tutorials/from-bits-to-boot.md) e pelo
[guia de arquitetura](../../architecture/README.md). Siga as
[regras de contribuição](../../../CONTRIBUTING.md) e o [código de conduta](../../../CODE_OF_CONDUCT.md).
Relate vulnerabilidades [em privado](../../../SECURITY.md). Código e documentação
usam a [licença MIT](../../../LICENSE). A introdução em inglês é a fonte desta
tradução; os guias técnicos detalhados continuam em inglês.
