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
  },
  "movMemoryBP": {
    "source": "docs/instruction-encoding/fixtures/mov-memory-bp.bits",
    "bytes": [
      139,
      70,
      254
    ],
    "sha256": "84c92b37a5eac1d7611da5b7545b59eaac0459f90ed8ede56ebfcfe3fc21c087"
  },
  "movMemoryAbsolute": {
    "source": "docs/instruction-encoding/fixtures/mov-memory-absolute.bits",
    "bytes": [
      139,
      22,
      32,
      0
    ],
    "sha256": "fc2a3f909c52bbae3cd1c9cd818f633e2bd40f3f3850672d20bf93e9db2829e8"
  },
  "movMemoryPair": {
    "source": "docs/instruction-encoding/fixtures/mov-memory-pair.bits",
    "bytes": [
      139,
      8
    ],
    "sha256": "7f9512bb270838a37ba1a6f3d2abbc601fcab1a1efd5eaee660c3baf995ed7c4"
  },
  "movRegisterReverse": {
    "source": "docs/instruction-encoding/fixtures/mov-register-reverse.bits",
    "bytes": [
      139,
      216
    ],
    "sha256": "746b256e87194e1b9ea106a2c8a809f8132c510c9c892e42e2e81f85a19ae1ae"
  },
  "movMemoryPositive": {
    "source": "docs/instruction-encoding/fixtures/mov-memory-positive.bits",
    "bytes": [
      139,
      70,
      126
    ],
    "sha256": "6b49f4f6d0e0b0abc024958806969030b31361d070fd0e3e3da9f005a8323f0d"
  },
  "mov32Next": {
    "source": "docs/instruction-encoding/fixtures/mov32-next.bits",
    "bytes": [
      184,
      43,
      0,
      0,
      0
    ],
    "sha256": "73b9d484a61687649aec837c7dfd938c02424f8d96de778f3e293dbd232e0cd5"
  },
  "selfModifyingControl": {
    "source": "examples/self-modifying/control.bits",
    "bytes": [
      250,
      234,
      6,
      124,
      0,
      0,
      184,
      3,
      0,
      205,
      16,
      49,
      192,
      142,
      216,
      142,
      208,
      188,
      0,
      124,
      252,
      49,
      201,
      49,
      246,
      49,
      237,
      186,
      251,
      3,
      176,
      128,
      238,
      186,
      248,
      3,
      176,
      1,
      238,
      66,
      49,
      192,
      238,
      186,
      251,
      3,
      176,
      3,
      238,
      176,
      65,
      187,
      59,
      124,
      136,
      7,
      235,
      0,
      176,
      65,
      186,
      248,
      3,
      238,
      80,
      184,
      0,
      184,
      142,
      192,
      88,
      180,
      15,
      191,
      0,
      0,
      171,
      244,
      235,
      253
    ],
    "sha256": "e64ced8a16771fce2f60aab5032857d452e79c265f79dffd72a967e2d98fe99a"
  },
  "selfModifyingProgram": {
    "source": "examples/self-modifying/program.bits",
    "bytes": [
      250,
      234,
      6,
      124,
      0,
      0,
      184,
      3,
      0,
      205,
      16,
      49,
      192,
      142,
      216,
      142,
      208,
      188,
      0,
      124,
      252,
      49,
      201,
      49,
      246,
      49,
      237,
      186,
      251,
      3,
      176,
      128,
      238,
      186,
      248,
      3,
      176,
      1,
      238,
      66,
      49,
      192,
      238,
      186,
      251,
      3,
      176,
      3,
      238,
      176,
      97,
      187,
      59,
      124,
      136,
      7,
      235,
      0,
      176,
      65,
      186,
      248,
      3,
      238,
      80,
      184,
      0,
      184,
      142,
      192,
      88,
      180,
      15,
      191,
      0,
      0,
      171,
      244,
      235,
      253
    ],
    "sha256": "3525e89a45fa14f092153f1a337b82af0e51a2a8b8f0cc78d5dd74c9b29f16dc"
  }
};
