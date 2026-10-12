export const encodingExamples = {
  "mov32": {
    "source": "docs/instruction-encoding/fixtures/mov32.bits",
    "bytes": [
      184,
      42,
      0,
      0,
      0
    ],
    "sha256": "37211626606e47b4102b985155de77a68e067a7f2b2b84b5a69f0bebdf1ad1d9"
  },
  "mov64": {
    "source": "docs/instruction-encoding/fixtures/mov64.bits",
    "bytes": [
      73,
      184,
      255,
      255,
      255,
      255,
      255,
      255,
      255,
      255
    ],
    "sha256": "403cb32c54d7605b69f01caf11cf2afff1164bd20686958921020c664001a5c4"
  },
  "movRegister": {
    "source": "docs/instruction-encoding/fixtures/mov-register.bits",
    "bytes": [
      137,
      216
    ],
    "sha256": "70159ac3e947a786243b46fa2404c1efc08d735b0dbfc34eb10b21a87af1389e"
  },
  "movRegister64": {
    "source": "docs/instruction-encoding/fixtures/mov-register64.bits",
    "bytes": [
      73,
      137,
      216
    ],
    "sha256": "6cc211a50324e32c80ba705a82cde39e2c7c65ac70698bbc0e270b6df9a0bd3e"
  },
  "movByte": {
    "source": "docs/instruction-encoding/fixtures/mov-byte.bits",
    "bytes": [
      136,
      224
    ],
    "sha256": "485e37876c0c0ad0afc23d0dc47c6f4393a839ac846f0b9f1af80033aefded35"
  },
  "movByteRex": {
    "source": "docs/instruction-encoding/fixtures/mov-byte-rex.bits",
    "bytes": [
      64,
      136,
      224
    ],
    "sha256": "2e59cab963638e78c4301d3505941f91c87151a086622d6ce728583b2b4b7e6a"
  }
};
