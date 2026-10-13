"""Check declared literal 16-bit address fields; never resolve or write bytes."""
import json
import os
import stat

MAP_LIMIT = 65536
WIDTHS = {"abs16": 2, "far16": 4, "rel8": 1, "rel16": 2}


class AddressReferenceError(ValueError):
    code = "REFERENCE_ERROR"


def _integer(value, label, maximum):
    if type(value) is not int or not 0 <= value <= maximum:
        raise AddressReferenceError(f"{label} must be an integer from 0 to {maximum}")
    return value


def _unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise AddressReferenceError("duplicate reference JSON key")
        result[key] = value
    return result


def read_reference_input(path, limit):
    # Check the opened descriptor so a FIFO or replaced path cannot block reading.
    descriptor = os.open(path, os.O_RDONLY | getattr(os, "O_NONBLOCK", 0))
    try:
        if not stat.S_ISREG(os.fstat(descriptor).st_mode):
            raise AddressReferenceError("reference input must be a regular file")
        with open(descriptor, "rb", closefd=False) as stream:
            raw = stream.read(limit + 1)
    finally:
        os.close(descriptor)
    if len(raw) > limit:
        raise AddressReferenceError(f"reference input exceeds {limit} bytes")
    return raw


def read_reference_map(path):
    raw = read_reference_input(path, MAP_LIMIT)
    try:
        return json.loads(raw.decode("utf-8"), object_pairs_hook=_unique_object)
    except (ValueError, RecursionError) as error:
        raise AddressReferenceError(f"invalid reference JSON: {error}") from error


def inspect_references(data, mapping):
    if not isinstance(data, (bytes, bytearray)) or not 1 <= len(data) <= 1 << 20:
        raise AddressReferenceError("references require 1–1048576 binary bytes")
    if not isinstance(mapping, dict) or set(mapping) != {"loadAddress", "references"}:
        raise AddressReferenceError("reference map requires exactly loadAddress and references")
    base = _integer(mapping["loadAddress"], "loadAddress", (1 << 20) - len(data))
    entries = mapping["references"]
    if not isinstance(entries, list) or not 1 <= len(entries) <= 256:
        raise AddressReferenceError("references must contain 1–256 declared fields")
    rows, occupied, names = [], set(), set()
    for index, entry in enumerate(entries):
        label = f"reference {index + 1}"
        if not isinstance(entry, dict) or not isinstance(entry.get("kind"), str) or entry["kind"] not in WIDTHS:
            raise AddressReferenceError(f"{label}: kind must be abs16, far16, rel8 or rel16")
        kind, width = entry["kind"], WIDTHS[entry["kind"]]
        keys = {"name", "kind", "offset", "targetOffset"}
        if kind != "far16":
            keys.add("segment")
        if kind.startswith("rel"):
            keys.add("originOffset")
        if set(entry) != keys:
            raise AddressReferenceError(f"{label}: expected exactly {', '.join(sorted(keys))}")
        name = entry["name"]
        if not isinstance(name, str) or not 1 <= len(name) <= 80 or not name.isprintable() or name in names:
            raise AddressReferenceError(f"{label}: name must be unique printable text of 1–80 characters")
        names.add(name)
        offset = _integer(entry["offset"], f"{label} offset", len(data) - 1)
        target = _integer(entry["targetOffset"], f"{label} targetOffset", len(data) - 1)
        if offset + width > len(data):
            raise AddressReferenceError(f"{label}: truncated {kind} field at byte {offset}")
        positions = set(range(offset, offset + width))
        if occupied & positions:
            raise AddressReferenceError(f"{label}: overlapping reference fields")
        occupied.update(positions)
        raw = data[offset:offset + width]
        value = int.from_bytes(raw[:2] if kind == "far16" else raw, "little")
        if kind == "far16":
            segment = int.from_bytes(raw[2:], "little")
        else:
            segment = _integer(entry["segment"], f"{label} segment", 65535)
        if kind.startswith("rel"):
            origin = _integer(entry["originOffset"], f"{label} originOffset", len(data))
            origin_ip = (base + origin - (segment << 4)) & 0xFFFFF
            if origin_ip > 65536:
                raise AddressReferenceError(f"{label}: origin is outside the declared 16-bit code segment")
            displacement = int.from_bytes(raw, "little", signed=True)
            value = (origin_ip + displacement) & 65535
            detail = f"{displacement:+d} from {segment:04X}:{origin_ip & 65535:04X}"
        else:
            detail = f"{segment:04X}:{value:04X}"
        address = ((segment << 4) + value) & 0xFFFFF
        expected = base + target
        if address != expected:
            raise AddressReferenceError(f"{label} {name}: field at {offset} points to {address:05X}, expected {expected:05X} (file offset {target})")
        rows.append(f"{offset:04X}  {kind:5}  {raw.hex().upper():8}  {detail} -> {address:05X} (file +{target:04X})  {name}")
    return f"Address references verified: {len(rows)} declared fields; no instruction decoding or byte rewriting.\n" + "\n".join(rows)
