"""Executable validation suite for CAHOS T1-T5."""
import hashlib
import tempfile
import unittest
import zipfile
from pathlib import Path

from cryptography.exceptions import InvalidTag

from cahos.crypto_tests import (
    aes256_gcm_decrypt,
    aes256_gcm_encrypt,
    caesar_decrypt,
    create_zip_archive,
    extract_zip_safely,
    list_zip_contents,
    sha256_file,
    verify_sha256,
    xor_analyze_single_byte,
    xor_bytes,
)


class TestT1Caesar(unittest.TestCase):
    def test_known_vector(self):
        self.assertEqual(caesar_decrypt("VHFUHW", 3), "SECRET")
        self.assertEqual(caesar_decrypt("Khoor, Zruog!", 3), "Hello, World!")

    def test_shift_wraparound_and_validation(self):
        self.assertEqual(caesar_decrypt("ABC", 29), "XYZ")


class TestT2Xor(unittest.TestCase):
    def test_repeating_xor_round_trip(self):
        plaintext = b"the secret message"
        ciphertext = xor_bytes(plaintext, b"\\x42")
        self.assertEqual(xor_bytes(ciphertext, b"\\x42"), plaintext)

    def test_single_byte_analysis_recovers_demo_key(self):
        plaintext = b" this is the secret message and the answer is known "
        ciphertext = xor_bytes(plaintext, b"\\x42")
        results = xor_analyze_single_byte(ciphertext, top_n=5)
        self.assertIn(0x42, [int(item["key"]) for item in results])

    def test_empty_key_rejected(self):
        with self.assertRaises(ValueError):
            xor_bytes(b"data", b"")


class TestT3Zip(unittest.TestCase):
    def test_create_list_extract(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "note.txt"
            source.write_text("CAHOS ZIP test", encoding="utf-8")
            archive = create_zip_archive([source], root / "test.zip")
            listing = list_zip_contents(archive)
            self.assertEqual(listing[0]["name"], "note.txt")
            extracted = extract_zip_safely(archive, root / "out")
            self.assertEqual(extracted[0].read_text(encoding="utf-8"), "CAHOS ZIP test")

    def test_path_traversal_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            archive = root / "malicious.zip"
            with zipfile.ZipFile(archive, "w") as zf:
                zf.writestr("../escape.txt", "should not escape")
            with self.assertRaises(ValueError):
                extract_zip_safely(archive, root / "out")
            self.assertFalse((root / "escape.txt").exists())


class TestT4AesGcm(unittest.TestCase):
    def test_encrypt_decrypt_and_authenticated_data(self):
        key = bytes(range(32))
        plaintext = b"confidential CAHOS teaching sample"
        envelope = aes256_gcm_encrypt(plaintext, key, aad=b"lesson-4")
        self.assertEqual(aes256_gcm_decrypt(envelope, key), plaintext)
        with self.assertRaises(InvalidTag):
            aes256_gcm_decrypt(envelope, bytes(reversed(range(32))))

    def test_tampering_is_detected(self):
        key = bytes(range(32))
        envelope = aes256_gcm_encrypt(b"message", key)
        import base64
        raw = bytearray(base64.b64decode(envelope["ciphertext_b64"]))
        raw[0] ^= 1
        envelope["ciphertext_b64"] = base64.b64encode(raw).decode("ascii")
        with self.assertRaises(InvalidTag):
            aes256_gcm_decrypt(envelope, key)

    def test_wrong_key_length_rejected(self):
        with self.assertRaises(ValueError):
            aes256_gcm_encrypt(b"data", b"short")


class TestT5Sha256(unittest.TestCase):
    def test_known_digest_and_tamper_detection(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "file.txt"
            path.write_bytes(b"abc")
            expected = hashlib.sha256(b"abc").hexdigest()
            self.assertEqual(sha256_file(path), expected)
            self.assertTrue(verify_sha256(path, expected))
            path.write_bytes(b"abd")
            self.assertFalse(verify_sha256(path, expected))

    def test_invalid_digest_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "file.txt"
            path.write_text("x", encoding="utf-8")
            with self.assertRaises(ValueError):
                verify_sha256(path, "not-a-hash")


if __name__ == "__main__":
    unittest.main()
