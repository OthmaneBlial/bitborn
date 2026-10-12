# Security policy

## Report a vulnerability privately

Use [GitHub's private vulnerability reporting form](https://github.com/OthmaneBlial/bitborn/security/advisories/new).
Private reporting is enabled for this repository. A GitHub account is required.
If you cannot use the form, contact the maintainer at
[blial.othmane@gmail.com](mailto:blial.othmane@gmail.com) with a brief description;
ordinary email is not encrypted, so do not send credentials or sensitive dumps.

Include the affected commit or release, component, environment, minimal
reproduction, expected impact and any suggested fix. Please do not disclose
exploit details in public issues before the maintainer can assess the report.
No bounty or fixed response deadline is offered. Disclosure timing should be
coordinated in the private report after assessment.

## Supported revisions and scope

Security fixes are considered for current `main` and the [latest published release](https://github.com/OthmaneBlial/bitborn/releases/latest).
Older releases are historical examples; separate maintenance
branches are not supported. Fix availability is documented in the changelog and
release notes rather than assumed to be backported.

Relevant reports include unsafe file handling in host tools, unbounded imported
input, browser script injection, accidental execution of untrusted native bytes,
and packaging or download verification that permits unintended executable content.
Model correctness bugs without security impact belong in the ordinary bug form.

Bitborn is an educational experiment, not a hardened operating system. Its browser
CPU model interprets a limited instruction subset with explicit size/step bounds.
It does not execute imported bytes as host-native code. QEMU tests execute reviewed
project programs. QEMU isolation and the model do not establish that an arbitrary
image is safe: reproduce reports in a disposable environment, never on a disk or
machine holding valuable data.
