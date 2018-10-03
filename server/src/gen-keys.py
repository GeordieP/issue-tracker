from base64 import b64encode
import os 
import json

# generates 5 random byte strings, and writes them as an array to the "keys.json" file.

open("keys.json", "w").write(json.dumps([
    b64encode(os.urandom(24)).decode('utf-8'),
    b64encode(os.urandom(24)).decode('utf-8'),
    b64encode(os.urandom(24)).decode('utf-8'),
    b64encode(os.urandom(24)).decode('utf-8'),
    b64encode(os.urandom(24)).decode('utf-8'),
]))
