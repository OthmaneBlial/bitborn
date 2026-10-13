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
      49,
      192,
      142,
      208,
      188,
      0,
      124,
      184,
      3,
      0,
      205,
      16,
      49,
      192,
      142,
      216,
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
      61,
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
    "sha256": "4a43d3b3c9d39a64de46d0ca1f520547095b55140540dd079034a407b5dd5804"
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
      49,
      192,
      142,
      208,
      188,
      0,
      124,
      184,
      3,
      0,
      205,
      16,
      49,
      192,
      142,
      216,
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
      61,
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
    "sha256": "39682d778b4924ef7c8c2843b3c8dff9d9d6d9254320d7099e8d33e8b2dbb9af"
  },
  "shortBranch": {
    "source": "docs/instruction-encoding/fixtures/short-branch.bits",
    "bytes": [
      124,
      254
    ],
    "sha256": "2ed679131412accc7a4faa8a9da042d741b98d86fd789459c2fa824c9dee315b"
  },
  "shortBranchInverse": {
    "source": "docs/instruction-encoding/fixtures/short-branch-inverse.bits",
    "bytes": [
      125,
      254
    ],
    "sha256": "11902ed159d26f3c5a6adefc18d4e7b8135214f0e4747edf46a2ca770f987e9a"
  },
  "linuxPushNumber": {
    "source": "examples/exit-code-small/program.bits",
    "sourceByteRange": [
      0,
      2
    ],
    "sourcePayloadSha256": "a0a5759b059d498f6567d39d2553b296ddc4b53b4fd9fde067fc8a1f7364b60b",
    "bytes": [
      106,
      60
    ],
    "sha256": "51377f71d445b1102c1427854a1040d0a672e40b33162d04d501a4e55442e09b"
  },
  "linuxPopNumber": {
    "source": "examples/exit-code-small/program.bits",
    "sourceByteRange": [
      2,
      3
    ],
    "sourcePayloadSha256": "a0a5759b059d498f6567d39d2553b296ddc4b53b4fd9fde067fc8a1f7364b60b",
    "bytes": [
      88
    ],
    "sha256": "4b68ab3847feda7d6c62c1fbcbeebfa35eab7351ed5e78f4ddadea5df64b8015"
  },
  "linuxPushArgument": {
    "source": "examples/exit-code-small/program.bits",
    "sourceByteRange": [
      3,
      5
    ],
    "sourcePayloadSha256": "a0a5759b059d498f6567d39d2553b296ddc4b53b4fd9fde067fc8a1f7364b60b",
    "bytes": [
      106,
      42
    ],
    "sha256": "4788655e22b8037bfb88dabd9fa76717462465e62747b266c942021d02886a55"
  },
  "linuxPopArgument": {
    "source": "examples/exit-code-small/program.bits",
    "sourceByteRange": [
      5,
      6
    ],
    "sourcePayloadSha256": "a0a5759b059d498f6567d39d2553b296ddc4b53b4fd9fde067fc8a1f7364b60b",
    "bytes": [
      95
    ],
    "sha256": "d2e2adf7177b7a8afddbc12d1634cf23ea1a71020f6a1308070a16400fb68fde"
  },
  "linuxSyscall": {
    "source": "examples/exit-code-small/program.bits",
    "sourceByteRange": [
      6,
      8
    ],
    "sourcePayloadSha256": "a0a5759b059d498f6567d39d2553b296ddc4b53b4fd9fde067fc8a1f7364b60b",
    "bytes": [
      15,
      5
    ],
    "sha256": "5ed9f33e4b004682e03bed14211e218c9dba2d75b3a76be0a1274c0a37ecc9e3"
  },
  "linuxMovNumber": {
    "source": "examples/exit-code/program.bits",
    "sourceByteRange": [
      0,
      5
    ],
    "sourcePayloadSha256": "5875e23660cb0ae0c3f4b13815230783dff9fdbb55746e26ebf0869c5d091359",
    "bytes": [
      184,
      60,
      0,
      0,
      0
    ],
    "sha256": "ce2a0b8f340fa4d559e8aca45a7156d5794a33471a215d41c9f97597acfab175"
  },
  "linuxMovArgument": {
    "source": "examples/exit-code/program.bits",
    "sourceByteRange": [
      5,
      10
    ],
    "sourcePayloadSha256": "5875e23660cb0ae0c3f4b13815230783dff9fdbb55746e26ebf0869c5d091359",
    "bytes": [
      191,
      42,
      0,
      0,
      0
    ],
    "sha256": "4b6b038b441b33b6be32325ea159bc20d8b41a8563aba68f6e4f6030c145f559"
  }
};
