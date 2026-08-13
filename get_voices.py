#!/usr/bin/env python3
import requests
import json

ELEVEN_API_KEY = "sk_a74f086bd8beb0ea127ac691b3ebcec93076dfc5c93f0be4"

headers = {"xi-api-key": ELEVEN_API_KEY}
response = requests.get("https://api.elevenlabs.io/v1/voices", headers=headers)

if response.status_code == 200:
    voces = response.json()["voices"]
    print("\n🎙️ TUS VOCES DISPONIBLES:\n")
    for v in voces:
        print(f"{v['name']:20} → {v['voice_id']}")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
