"""Five real, reproducible educational exercises (T1-T5).

These routines demonstrate classical ciphers, XOR analysis, ZIP handling,
authenticated encryption, and file-integrity checks. They do not break
modern cryptography or recover unknown AES keys.
"""
from __future__ import annotations

import base64
import hashlib
import json
import string
import zipfile
from pathlib import Path
from typing import Iterable

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

_ENGLISH_FRENCH_HINTS = (
    " le ", " la ", " les ", " de ", " des ", " et ", " un ", " une ",
    " the ", " and ", " of ", " to ", "ing", "ion", "que", "ent",
)
_PRINTABLE = set(bytes(string.printable, "ascii"))


def caesar_decrypt(ciphertext: str, shift: int) -> str:
    """T1: decrypt a Caesar cipher, preserving case and non-ASCII letters."""
    shift %= 26
    out: list[str] = []
    for char in ciphertext:
        if "A" <= char <= "Z":
            out.append(chr((ord(char) - ord("A") - shift) % 26 + ord("A")))
        elif "a" <= char <= "z":
            out.append(chr((ord(char) - ord("a") - shift) % 26 + ord("a")))
        else:
            out.append(char)
    return "".join(out)


def xor_bytes(data: bytes, key: bytes) -> bytes:
    """XOR bytes with a repeating key; this is educational, not secure encryption."""
    if not key:
        raise ValueError("La clé XOR ne peut pas être vide.")
    return bytes(value ^ key[i % len(key)] for i, value in enumerate(data))


def _language_score(candidate: bytes) -> float:
    """Heuristic score for printable text and common English/French fragments."""
    if not candidate:
        return float("-inf")
    printable_ratio = sum(byte in _PRINTABLE or byte >= 0xC0 for byte in candidate) / len(candidate)
    decoded = candidate.decode("latin-1", errors="replace").lower()
    word_bonus = sum(decoded.count(fragment) for fragment in _ENGLISH_FRENCH_HINTS)
    return printable_ratio * 100.0 + word_bonus * 2.5


def xor_analyze_single_byte(ciphertext: bytes, top_n: int = 5) -> list[dict[str, object]]:
    """T2: rank all 256 single-byte XOR keys by a simple text-likelihood heuristic.

    This only targets single-byte XOR. It is not a general XOR solver and can
    produce false positives, especially for binary data or non-English text.
    """
    if top_n < 1:
        raise ValueError("top_n doit être supérieur ou égal à 1.")
    candidates = []
    for key in range(256):
        plaintext = bytes(byte ^ key for byte in ciphertext)
        candidates.append({
            "key": key,
            "score": _language_score(plaintext),
            "plaintext": plaintext,
        })
    return sorted(candidates, key=lambda item: float(item["score"]), reverse=True)[:top_n]


def create_zip_archive(source_files: Iterable[str | Path], archive_path: str | Path) -> Path:
    """T3: create a real ZIP archive from explicitly supplied files."""
    destination = Path(archive_path)
    files = [Path(item) for item in source_files]
    if not files:
        raise ValueError("Fournissez au moins un fichier à archiver.")
    missing = [str(path) for path in files if not path.is_file()]
    if missing:
        raise FileNotFoundError("Fichier(s) introuvable(s): " + ", ".join(missing))
    destination.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in files:
            archive.write(path, arcname=path.name)
    return destination


def list_zip_contents(archive_path: str | Path) -> list[dict[str, object]]:
    """T3: list real ZIP members and sizes without extracting them."""
    with zipfile.ZipFile(archive_path, "r") as archive:
        if archive.testzip() is not None:
            raise ValueError("L'archive ZIP contient un membre corrompu.")
        return [
            {"name": info.filename, "size": info.file_size, "compressed_size": info.compress_size}
            for info in archive.infolist()
        ]


def extract_zip_safely(archive_path: str | Path, destination: str | Path) -> list[Path]:
    """T3: extract ZIP members while rejecting path traversal and symlink entries."""
    root = Path(destination).resolve()
    root.mkdir(parents=True, exist_ok=True)
    extracted: list[Path] = []
    with zipfile.ZipFile(archive_path, "r") as archive:
        bad_member = archive.testzip()
        if bad_member is not None:
            raise ValueError(f"Membre ZIP corrompu: {bad_member}")
        for info in archive.infolist():
            target = (root / info.filename).resolve()
            try:
                target.relative_to(root)
            except ValueError as exc:
                raise ValueError(f"Chemin ZIP dangereux refusé: {info.filename}") from exc
            # Unix external attributes store the file type in the upper 16 bits.
            unix_mode = (info.external_attr >> 16) & 0xFFFF
            if (unix_mode & 0o170000) == 0o120000:
                raise ValueError(f"Lien symbolique ZIP refusé: {info.filename}")
            if info.is_dir():
                target.mkdir(parents=True, exist_ok=True)
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            with archive.open(info, "r") as src, target.open("wb") as dst:
                while True:
                    chunk = src.read(1024 * 1024)
                    if not chunk:
                        break
                    dst.write(chunk)
            extracted.append(target)
    return extracted


def aes256_gcm_encrypt(plaintext: bytes, key: bytes, aad: bytes = b"") -> dict[str, str]:
    """T4: encrypt bytes using AES-256-GCM and return a portable JSON-safe envelope."""
    if len(key) != 32:
        raise ValueError("AES-256 exige exactement 32 octets de clé.")
    nonce = __import__("secrets").token_bytes(12)
    ciphertext_and_tag = AESGCM(key).encrypt(nonce, plaintext, aad)
    return {
        "algorithm": "AES-256-GCM",
        "nonce_b64": base64.b64encode(nonce).decode("ascii"),
        "ciphertext_b64": base64.b64encode(ciphertext_and_tag).decode("ascii"),
        "aad_b64": base64.b64encode(aad).decode("ascii"),
    }


def aes256_gcm_decrypt(envelope: dict[str, str], key: bytes, aad: bytes | None = None) -> bytes:
    """T4: authenticate and decrypt; wrong keys or altered data raise InvalidTag."""
    if len(key) != 32:
        raise ValueError("AES-256 exige exactement 32 octets de clé.")
    if envelope.get("algorithm") != "AES-256-GCM":
        raise ValueError("Algorithme d'enveloppe inconnu.")
    nonce = base64.b64decode(envelope["nonce_b64"], validate=True)
    ciphertext = base64.b64decode(envelope["ciphertext_b64"], validate=True)
    stored_aad = base64.b64decode(envelope.get("aad_b64", ""), validate=True)
    if len(nonce) != 12:
        raise ValueError("Nonce GCM invalide: 12 octets attendus.")
    actual_aad = stored_aad if aad is None else aad
    return AESGCM(key).decrypt(nonce, ciphertext, actual_aad)


def sha256_file(path: str | Path) -> str:
    """T5: calculate a file's SHA-256 digest in bounded-memory chunks."""
    digest = hashlib.sha256()
    with Path(path).open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def verify_sha256(path: str | Path, expected_hex: str) -> bool:
    """T5: compare a supplied SHA-256 digest to a file's digest."""
    normalized = expected_hex.strip().lower()
    if len(normalized) != 64 or any(char not in string.hexdigits for char in normalized):
        raise ValueError("Empreinte SHA-256 invalide: 64 caractères hexadécimaux requis.")
    return hashlib.compare_digest(sha256_file(path), normalized) if hasattr(hashlib, "compare_digest") else __import__("hmac").compare_digest(sha256_file(path), normalized)


def write_envelope(envelope: dict[str, str], path: str | Path) -> None:
    """Persist an AES-GCM envelope as readable JSON (metadata is not encrypted)."""
    Path(path).write_text(json.dumps(envelope, indent=2) + "\n", encoding="utf-8")


def read_envelope(path: str | Path) -> dict[str, str]:
    """Load and minimally validate an AES-GCM JSON envelope."""
    value = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(value, dict) or not all(isinstance(k, str) and isinstance(v, str) for k, v in value.items()):
        raise ValueError("Format d'enveloppe JSON invalide.")
    return value
