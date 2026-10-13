#!/usr/bin/env python3
"""Pack the reviewed literal challenge sources; never synthesize instructions."""
import json
from pathlib import Path

if __package__:
    from .bitborn import ROOT, digest, read_bits
else:
    from bitborn import ROOT, digest, read_bits


def build_challenges(root=ROOT):
    catalog = json.loads((root / "challenges/catalog.json").read_text())
    reviewed = {item["source"]: item for item in json.loads((root / "challenges/targets.json").read_text())}
    ids = set()
    packed = []
    for challenge in catalog:
        if challenge["id"] in ids or challenge["difficulty"] not in {"beginner", "intermediate", "advanced", "expert"}:
            raise ValueError("Challenge IDs must be unique and difficulties must be known")
        ids.add(challenge["id"])
        item = dict(challenge)
        sources = [("start", challenge["source"]), ("solution", challenge["solution"])]
        if challenge.get("alternatives"):
            item["alternatives"] = []
            sources.extend(("alternative", source) for source in challenge["alternatives"])
        for prefix, source in sources:
            path = Path(source)
            if path.is_absolute() or ".." in path.parts or path.parts[:2] != ("challenges", challenge["id"]):
                raise ValueError("Challenge sources must stay in their canonical directory")
            data, annotations = read_bits(root / path)
            target = reviewed[source]
            if len(data) > 512 or len(data) != target["size"] or digest(data) != target["sha256"]:
                raise ValueError(f"{path}: source differs from reviewed size/hash")
            if any(not annotation["explanation"] for annotation in annotations):
                raise ValueError(f"{path}: every byte range needs an explanation")
            if prefix == "alternative":
                item["alternatives"].append({"source": source, "bytes": list(data), "annotations": annotations,
                                             "text": (root / path).read_text(), "sha256": digest(data)})
            else:
                item[prefix + "Bytes"] = list(data)
                item[prefix + "Annotations"] = annotations
                item[prefix + "Text"] = (root / path).read_text()
                item[prefix + "Sha256"] = digest(data)
        if challenge.get("optimization"):
            rule = challenge["optimization"]
            boundary, budget = rule.get("editableFrom"), rule.get("maxBytes")
            if type(boundary) is not int or type(budget) is not int or not 0 < boundary < budget < len(item["startBytes"]):
                raise ValueError("Optimization needs a locked setup and a strictly smaller byte budget")
            if boundary not in {annotation["offset"] + annotation["size"] for annotation in item["startAnnotations"] if annotation["kind"] == "instruction"}:
                raise ValueError("The locked setup must end at an instruction boundary")
            solutions = [item["solutionBytes"]] + [alternative["bytes"] for alternative in item.get("alternatives", [])]
            if len({bytes(solution) for solution in solutions}) < 2:
                raise ValueError("Optimization needs two distinct reviewed solutions")
            if any(len(solution) > budget or solution[:boundary] != item["startBytes"][:boundary] for solution in solutions):
                raise ValueError("Optimization solutions must preserve setup and meet the byte budget")
        else:
            if len(item["startBytes"]) != len(item["solutionBytes"]):
                raise ValueError("Challenge edits must preserve byte length")
            allowed = challenge["editableOffsets"]
            if not allowed or any(type(offset) is not int or not 0 <= offset < len(item["startBytes"]) for offset in allowed):
                raise ValueError("Editable offsets must select existing bytes")
            changed = sum((a ^ b).bit_count() for a, b in zip(item["startBytes"], item["solutionBytes"]))
            if changed > challenge["maxChangedBits"] or any(a != b and offset not in allowed for offset, (a, b) in enumerate(zip(item["startBytes"], item["solutionBytes"]))):
                raise ValueError("The reviewed solution exceeds its edit rules")
        packed.append(item)
    destination = root / "site/challenges/catalog.json"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(packed, indent=2, ensure_ascii=False) + "\n")
    return packed


if __name__ == "__main__":
    print(f"Packed {len(build_challenges())} reviewed binary challenges")
