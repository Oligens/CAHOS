"""Command-line interface for the CAHOS educational exercises."""
from __future__ import annotations

import argparse
import json
import secrets
import sys
from pathlib import Path

from cryptography.exceptions import InvalidTag

from .crypto_tests import (
    aes256_gcm_decrypt,
    aes256_gcm_encrypt,
    caesar_decrypt,
    create_zip_archive,
    extract_zip_safely,
    list_zip_contents,
    read_envelope,
    sha256_file,
    verify_sha256,
    write_envelope,
    xor_analyze_single_byte,
)


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="cahos", description="CAHOS — laboratoire pédagogique T1-T5")
    commands = parser.add_subparsers(dest="command", required=True)

    caesar = commands.add_parser("caesar", help="T1: déchiffrer un César")
    caesar.add_argument("text")
    caesar.add_argument("--shift", type=int, required=True, help="décalage utilisé pour chiffrer")

    xor = commands.add_parser("xor-analyze", help="T2: classer les clés XOR à un octet")
    xor.add_argument("input", help="fichier contenant le texte chiffré")
    xor.add_argument("--top", type=int, default=5)

    zcreate = commands.add_parser("zip-create", help="T3: créer une archive ZIP")
    zcreate.add_argument("archive")
    zcreate.add_argument("files", nargs="+")

    zlist = commands.add_parser("zip-list", help="T3: lister et vérifier une archive ZIP")
    zlist.add_argument("archive")

    zextract = commands.add_parser("zip-extract", help="T3: extraction avec protection contre Zip Slip")
    zextract.add_argument("archive")
    zextract.add_argument("destination")

    keygen = commands.add_parser("aes-keygen", help="T4: générer une clé aléatoire de 256 bits")
    keygen.add_argument("--out", help="fichier de clé (permissions à protéger manuellement)")

    enc = commands.add_parser("aes-encrypt", help="T4: chiffrer un fichier AES-256-GCM")
    enc.add_argument("input")
    enc.add_argument("envelope")
    enc.add_argument("--key", required=True, help="clé de 32 octets en hexadécimal (64 caractères)")

    dec = commands.add_parser("aes-decrypt", help="T4: déchiffrer et authentifier une enveloppe AES-GCM")
    dec.add_argument("envelope")
    dec.add_argument("output")
    dec.add_argument("--key", required=True, help="clé de 32 octets en hexadécimal")

    sha = commands.add_parser("sha256", help="T5: calculer une empreinte SHA-256")
    sha.add_argument("file")

    verify = commands.add_parser("sha256-verify", help="T5: vérifier une empreinte SHA-256")
    verify.add_argument("file")
    verify.add_argument("expected")

    return parser


def main(argv: list[str] | None = None) -> int:
    args = _parser().parse_args(argv)
    try:
        if args.command == "caesar":
            print(caesar_decrypt(args.text, args.shift))
        elif args.command == "xor-analyze":
            data = Path(args.input).read_bytes()
            for item in xor_analyze_single_byte(data, args.top):
                print(f"clé=0x{int(item['key']):02x} score={float(item['score']):.2f} texte={bytes(item['plaintext'])!r}")
        elif args.command == "zip-create":
            print(create_zip_archive(args.files, args.archive))
        elif args.command == "zip-list":
            print(json.dumps(list_zip_contents(args.archive), ensure_ascii=False, indent=2))
        elif args.command == "zip-extract":
            for path in extract_zip_safely(args.archive, args.destination):
                print(path)
        elif args.command == "aes-keygen":
            key = secrets.token_bytes(32)
            encoded = key.hex()
            if args.out:
                Path(args.out).write_text(encoded + "\n", encoding="ascii")
                print(f"Clé créée dans {args.out}. Protégez ce fichier et ne le versionnez jamais.")
            else:
                print(encoded)
        elif args.command == "aes-encrypt":
            key = bytes.fromhex(args.key)
            envelope = aes256_gcm_encrypt(Path(args.input).read_bytes(), key)
            write_envelope(envelope, args.envelope)
            print(f"Enveloppe chiffrée écrite: {args.envelope}")
        elif args.command == "aes-decrypt":
            key = bytes.fromhex(args.key)
            plaintext = aes256_gcm_decrypt(read_envelope(args.envelope), key)
            Path(args.output).write_bytes(plaintext)
            print(f"Authentification réussie; fichier déchiffré: {args.output}")
        elif args.command == "sha256":
            print(sha256_file(args.file))
        elif args.command == "sha256-verify":
            valid = verify_sha256(args.file, args.expected)
            print("OK: empreinte conforme" if valid else "ÉCHEC: empreinte différente")
            return 0 if valid else 1
        return 0
    except (OSError, ValueError, KeyError, json.JSONDecodeError, InvalidTag) as exc:
        print(f"Erreur: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
