"""
🎤 AbeVoice API Client
Standalone client for integrating AbeVoice into any project

Usage:
    from abevoice_api import AbeVoiceAPI
    
    api = AbeVoiceAPI()
    api.speak("Hello world!")
"""

import os
import base64
import requests
from typing import Optional, List, Dict, Union
from pathlib import Path


class AbeVoiceAPI:
    """
    AbeVoice API Client
    
    Example:
        api = AbeVoiceAPI()
        
        # Generate and save audio
        api.speak("Hello!", save_path="hello.mp3")
        
        # Get audio bytes
        audio = api.generate("Hello!")
        
        # List voices
        voices = api.get_voices()
    """
    
    # Default voice IDs
    VOICES = {
        "abe": "dMyQqiVXTU80dDl2eNK8",
        "marcus": "s3TPKV1kjDlVtZbl4Ksh",
        "luna": "3jR9BuQAOPMWUjWpi0ll",
        "zephyr": "4O1sYUnmtThcBoSBrri7",
        "evelyn": "g6xIsTj2HwM6VR4iXFCw",
        "jasper": "WyFXw4PzMbRnp8iLMJwY",
    }
    
    DEFAULT_VOICE = "dMyQqiVXTU80dDl2eNK8"  # Abë
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        """
        Initialize AbeVoice API client
        
        Args:
            base_url: API server URL (default: http://localhost:8000)
        """
        self.base_url = base_url.rstrip("/")
    
    def generate(
        self,
        text: str,
        voice: str = "abe",
        stability: float = 0.5,
        similarity: float = 0.75,
        style: float = 0.0
    ) -> Optional[bytes]:
        """
        Generate speech from text
        
        Args:
            text: Text to convert to speech
            voice: Voice name or ID (default: "abe")
            stability: Voice stability 0.0-1.0 (default: 0.5)
            similarity: Voice similarity 0.0-1.0 (default: 0.75)
            style: Style exaggeration 0.0-1.0 (default: 0.0)
            
        Returns:
            Audio bytes (MP3) or None on error
        """
        # Resolve voice name to ID
        voice_id = self.VOICES.get(voice.lower(), voice)
        
        try:
            response = requests.post(
                f"{self.base_url}/api/v1/text-to-speech",
                json={
                    "text": text,
                    "voice_id": voice_id,
                    "stability": stability,
                    "similarity_boost": similarity,
                    "style": style
                },
                timeout=60
            )
            
            data = response.json()
            
            if data.get("success") and data.get("audio_base64"):
                return base64.b64decode(data["audio_base64"])
            else:
                print(f"❌ Error: {data.get('error', 'Unknown error')}")
                return None
                
        except Exception as e:
            print(f"❌ API Error: {e}")
            return None
    
    def speak(
        self,
        text: str,
        voice: str = "abe",
        save_path: Optional[str] = None,
        **kwargs
    ) -> bool:
        """
        Generate speech and optionally save to file
        
        Args:
            text: Text to speak
            voice: Voice name or ID
            save_path: Path to save MP3 file (optional)
            **kwargs: Additional args for generate()
            
        Returns:
            True on success, False on error
        """
        audio = self.generate(text, voice, **kwargs)
        
        if audio:
            if save_path:
                Path(save_path).write_bytes(audio)
                print(f"✅ Saved: {save_path}")
            return True
        return False
    
    def speak_and_play(
        self,
        text: str,
        voice: str = "abe",
        **kwargs
    ) -> bool:
        """
        Generate speech and play it (requires pygame)
        
        Args:
            text: Text to speak
            voice: Voice name or ID
            **kwargs: Additional args for generate()
            
        Returns:
            True on success
        """
        audio = self.generate(text, voice, **kwargs)
        
        if audio:
            try:
                import pygame
                import tempfile
                import os
                
                pygame.mixer.init()
                
                # Save to temp file
                with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
                    f.write(audio)
                    temp_path = f.name
                
                # Play
                pygame.mixer.music.load(temp_path)
                pygame.mixer.music.play()
                
                # Wait for completion
                while pygame.mixer.music.get_busy():
                    pygame.time.wait(100)
                
                # Cleanup
                os.unlink(temp_path)
                return True
                
            except ImportError:
                print("⚠️ pygame not installed. Run: pip install pygame")
                return False
            except Exception as e:
                print(f"❌ Playback error: {e}")
                return False
        return False
    
    def get_voices(self) -> List[Dict]:
        """
        Get list of available voices
        
        Returns:
            List of voice dictionaries
        """
        try:
            response = requests.get(f"{self.base_url}/api/v1/voices", timeout=10)
            return response.json()
        except:
            # Return predefined voices if API unavailable
            return [
                {"voice_id": vid, "name": name.title()}
                for name, vid in self.VOICES.items()
            ]
    
    def get_usage(self) -> Dict:
        """
        Get API usage statistics
        
        Returns:
            Usage dictionary
        """
        try:
            response = requests.get(f"{self.base_url}/api/v1/usage", timeout=10)
            return response.json()
        except Exception as e:
            return {"error": str(e)}
    
    def is_online(self) -> bool:
        """Check if API server is online"""
        try:
            response = requests.get(f"{self.base_url}/api/status", timeout=5)
            return response.json().get("status") == "online"
        except:
            return False


# ═══════════════════════════════════════════════════════════════════════════
# Quick Functions (for simple usage)
# ═══════════════════════════════════════════════════════════════════════════

_api = None

def _get_api():
    global _api
    if _api is None:
        _api = AbeVoiceAPI()
    return _api


def speak(text: str, voice: str = "abe", save_path: str = None) -> bool:
    """Quick speak function"""
    return _get_api().speak(text, voice, save_path)


def generate(text: str, voice: str = "abe") -> Optional[bytes]:
    """Quick generate function"""
    return _get_api().generate(text, voice)


def play(text: str, voice: str = "abe") -> bool:
    """Quick play function"""
    return _get_api().speak_and_play(text, voice)


# ═══════════════════════════════════════════════════════════════════════════
# CLI
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import sys
    
    print("🎤 AbeVoice API Client")
    print("=" * 40)
    
    api = AbeVoiceAPI()
    
    if api.is_online():
        print("✅ Server is online")
        
        # Demo
        if len(sys.argv) > 1:
            text = " ".join(sys.argv[1:])
        else:
            text = "Hello! I am Abë, your voice assistant."
        
        print(f"\n🔊 Generating: \"{text}\"")
        
        if api.speak(text, save_path="demo_output.mp3"):
            print("✅ Audio saved to demo_output.mp3")
    else:
        print("❌ Server is offline. Start with: python server.py")

