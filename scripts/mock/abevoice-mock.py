#!/usr/bin/env python3
"""Simple mocked AbëVoice API for CI smoke checks.
Responds to:
- GET /api/status -> 200 OK
- POST /api/v1/text-to-speech -> JSON with audio_base64 field
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import base64

class Handler(BaseHTTPRequestHandler):
    def _set_headers(self, code=200):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/status':
            self._set_headers(200)
            self.wfile.write(json.dumps({'status':'ok'}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error':'not found'}).encode())

    def do_POST(self):
        if self.path == '/api/v1/text-to-speech':
            # Read body but ignore details; return simple base64-encoded bytes
            length = int(self.headers.get('Content-Length', 0))
            _ = self.rfile.read(length) if length else b''
            dummy_audio = b'DUMMYAUDIO'  # not a real WAV, but enough for CI smoke
            audio_b64 = base64.b64encode(dummy_audio).decode()
            resp = {'audio_base64': audio_b64}
            self._set_headers(200)
            self.wfile.write(json.dumps(resp).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error':'not found'}).encode())

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    server = HTTPServer(('127.0.0.1', args.port), Handler)
    print(f"AbëVoice mock running on http://127.0.0.1:{args.port}")
    server.serve_forever()
