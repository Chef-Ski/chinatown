import argparse
import os
import json
import time
import uuid
import urllib.parse
import urllib.request
from pathlib import Path
import tempfile
from pydub import AudioSegment
from pydub.effects import normalize
from collections import defaultdict
from openai import OpenAI
from dotenv import load_dotenv
import subprocess
import requests
import re
import spacy
import requests
from datetime import datetime
import nltk
from nltk.tokenize import sent_tokenize
from transformers import pipeline
from typing import List, Dict, Tuple, Any, Optional
from bs4 import BeautifulSoup
from urllib.parse import quote_plus
import http.client
import urllib.parse
import urllib.request
import ssl
import re
import json
import time
import random





class audio():
    def __init__(self):
        pass   

    def create_output_folder(self, input_filename, source_language, target_language):
        """
        Create a unique output folder structure for this translation job.
        
        Args:
            input_filename (str): The original input file name
            source_language (str): Source language of the input
            target_language (str): Target language for translation
            
        Returns:
            Path: Path to the job-specific output folder
        """
        # Create base outputs directory if it doesn't exist
        outputs_dir = Path("outputs")
        outputs_dir.mkdir(exist_ok=True)
        
        # Create a unique job ID based on timestamp and random string
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        job_id = f"{timestamp}_{uuid.uuid4().hex[:8]}"
        
        # Create job folder name using source-target language and filename
        base_filename = Path(input_filename).stem
        job_folder_name = f"{base_filename}_{source_language.lower()}_to_{target_language.lower()}_{job_id}"
        
        # Create the full path
        job_dir = outputs_dir / job_folder_name
        job_dir.mkdir(exist_ok=True)
        
        print(f"Created output folder: {job_dir}")
        return job_dir

    def extract_audio_from_video(self, video_path, output_audio_path=None):
        """
        Extract audio from a video file and save it as an MP3.
        
        Args:
            video_path (str): Path to the video file
            output_audio_path (str, optional): Path to save the extracted audio file
                
        Returns:
            str: Path to the extracted audio file
        """
        try:
            # Create a temporary file if no output path is provided
            if output_audio_path is None:
                temp_dir = tempfile.gettempdir()
                output_audio_path = os.path.join(temp_dir, f"{Path(video_path).stem}.mp3")
            
            print(f"Extracting audio from video: {video_path}")
            
            # Extract audio using pydub
            video = AudioSegment.from_file(video_path)
            video.export(output_audio_path, format="mp3")
            
            print(f"Audio extracted and saved to: {output_audio_path}")
            return output_audio_path
        
        except Exception as e:
            print(f"Error extracting audio from video: {str(e)}")
            raise

    def transcribe_audio(self, file_path, api_key):
        """
        Transcribe an audio file using OpenAI's Whisper API.
        
        Args:
            file_path (str): Path to the audio file
            api_key (str): OpenAI API key
            
        Returns:
            str: Transcribed text
        """
        client = OpenAI(api_key=api_key)
        
        with open(file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
        
        return transcription.text

    def translate_text(self, text, target_language, api_key):
        """
        Translate text using OpenAI's GPT model.
        
        Args:
            text (str): Text to translate
            target_language (str): Target language for translation
            api_key (str): OpenAI API key
            
        Returns:
            str: Translated text
        """
        client = OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": f"You are a translator. Translate the following text into {target_language}. Maintain the natural flow and any descriptions of sounds or scenes."},
                {"role": "user", "content": text}
            ]
        )
        
        return response.choices[0].message.content

    def text_to_speech(self, text, voice, output_file, api_key):
        """
        Convert text to speech using OpenAI's TTS API and save as MP3.
        
        Args:
            text (str): The text to convert to speech
            voice (str): The voice to use (alloy, echo, fable, onyx, nova, or shimmer)
            output_file (str): Path to save the MP3 file
            api_key (str): OpenAI API key
        
        Returns:
            str: Path to the generated MP3 file
        """
        if not text:
            raise ValueError("Text cannot be empty")
        
        # Valid OpenAI TTS voices
        valid_voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
        
        # Validate voice
        if voice.lower() not in valid_voices:
            print(f"Warning: '{voice}' is not a recognized OpenAI voice. Using 'alloy' instead.")
            print(f"Valid voices are: {', '.join(valid_voices)}")
            voice = "alloy"
        
        try:
            # Creating TTS request with OpenAI's API
            print(f"Generating speech using OpenAI TTS with voice: {voice}")
            
            client = OpenAI(api_key=api_key)
            response = client.audio.speech.create(
                model="tts-1",
                voice=voice,
                input=text
            )
            
            # Save the audio file
            response.stream_to_file(output_file)
            
            print(f"Audio saved to: {output_file}")
            return output_file
            
        except Exception as e:
            print(f"Error with text-to-speech conversion: {str(e)}")
            raise

    def analyze_text_for_sounds_multilingual(self, text, source_language="English", api_key=None):
        """
        Enhanced version with multilingual support, especially for Spanish.
        
        Args:
            text (str): The text to analyze
            source_language (str): The language of the text (English, Spanish, etc.)
            api_key (str): OpenAI API key (not used in this version)
            
        Returns:
            list: A list of sound effect opportunities
        """
        text_lower = text.lower()
        sound_opportunities = []
        
        # Spanish keywords mapping to English sound descriptions
        spanish_keywords = {
            # Guns and shooting
            "disparos": {"type": "event", "desc": "gunshot", "volume": "foreground"},
            "disparo": {"type": "event", "desc": "gunshot", "volume": "foreground"},
            "pistola": {"type": "event", "desc": "gunshot", "volume": "foreground"},
            "arma": {"type": "event", "desc": "gunshot", "volume": "foreground"},
            "bala": {"type": "event", "desc": "gunshot", "volume": "foreground"},
            "tiroteo": {"type": "event", "desc": "gunshot", "volume": "foreground"},
            
            # Environment
            "viento": {"type": "environmental", "desc": "wind", "volume": "background"},
            "frío": {"type": "environmental", "desc": "wind", "volume": "background"},
            "lluvia": {"type": "environmental", "desc": "rain", "volume": "background"},
            "tormenta": {"type": "environmental", "desc": "storm", "volume": "background"},
            "trueno": {"type": "environmental", "desc": "thunder", "volume": "background"},
            "relámpago": {"type": "environmental", "desc": "thunder", "volume": "background"},
            
            # Water
            "agua": {"type": "ambient", "desc": "water flowing", "volume": "background"},
            "río": {"type": "ambient", "desc": "river flowing", "volume": "background"},
            "mar": {"type": "ambient", "desc": "ocean waves", "volume": "background"},
            "océano": {"type": "ambient", "desc": "ocean waves", "volume": "background"},
            "olas": {"type": "ambient", "desc": "ocean waves", "volume": "background"},
            
            # Food and cooking
            "cocina": {"type": "ambient", "desc": "cooking sounds", "volume": "background"},
            "cocinando": {"type": "ambient", "desc": "cooking sounds", "volume": "background"},
            "comida": {"type": "ambient", "desc": "cooking sounds", "volume": "background"},
            "hirviendo": {"type": "ambient", "desc": "boiling water", "volume": "background"},
            "hervir": {"type": "ambient", "desc": "boiling water", "volume": "background"},
            "fritura": {"type": "ambient", "desc": "sizzling", "volume": "background"},
            "freír": {"type": "ambient", "desc": "sizzling", "volume": "background"},
            
            # Movement and actions
            "pasos": {"type": "event", "desc": "footsteps", "volume": "moderate"},
            "caminando": {"type": "event", "desc": "footsteps", "volume": "moderate"},
            "corriendo": {"type": "event", "desc": "running footsteps", "volume": "moderate"},
            "puerta": {"type": "event", "desc": "door closing", "volume": "moderate"},
            "golpe": {"type": "event", "desc": "crash", "volume": "foreground"},
            "romper": {"type": "event", "desc": "glass breaking", "volume": "moderate"},
            "vidrio": {"type": "event", "desc": "glass breaking", "volume": "moderate"},
            
            # Locations
            "india": {"type": "ambient", "desc": "india ambient", "volume": "background"},
            "pakistán": {"type": "ambient", "desc": "pakistan ambient", "volume": "background"},
            "ciudad": {"type": "ambient", "desc": "city ambience", "volume": "background"}
        }
        
        # English keywords dictionary
        english_keywords = {
            # Events - short, distinct sounds
            "gunshot": {"type": "event", "desc": "gunshot", "volume": "foreground"},
            "gunshots": {"type": "event", "desc": "gunshot", "volume": "foreground"},
            "gun": {"type": "event", "desc": "gunshot", "volume": "foreground"},
            "shots": {"type": "event", "desc": "gunshot", "volume": "foreground"},
            "shooting": {"type": "event", "desc": "gunshot", "volume": "foreground"},
            "explosion": {"type": "event", "desc": "explosion", "volume": "foreground"},
            "crash": {"type": "event", "desc": "crash", "volume": "foreground"},
            "footsteps": {"type": "event", "desc": "footsteps", "volume": "moderate"},
            "running": {"type": "event", "desc": "running footsteps", "volume": "moderate"},
            "door": {"type": "event", "desc": "door closing", "volume": "moderate"},
            "wind": {"type": "environmental", "desc": "wind", "volume": "background"},
            "cold": {"type": "environmental", "desc": "wind", "volume": "background"},
            "rain": {"type": "environmental", "desc": "rain", "volume": "background"},
            "boiling": {"type": "ambient", "desc": "boiling water", "volume": "background"},
            "india": {"type": "ambient", "desc": "india ambient", "volume": "background"},
            "pakistan": {"type": "ambient", "desc": "pakistan ambient", "volume": "background"}
        }
        
        # Choose the right keyword dictionary based on language
        if source_language.lower() == "spanish":
            keyword_dict = spanish_keywords
            print("Using Spanish keyword dictionary for sound detection")
        else:
            keyword_dict = english_keywords
            print(f"Using {source_language} keyword dictionary for sound detection")
        
        print("Searching for sound keywords in the text...")
        
        # Split the text into sentences for better timestamp approximation
        sentences = re.split(r'[.!?]+', text)
        total_sentences = len(sentences)
        
        for i, sentence in enumerate(sentences):
            sentence_lower = sentence.lower()
            sentence_position = i / total_sentences  # Normalized position (0-1)
            
            # Check for keywords in this sentence
            for keyword, sound_info in keyword_dict.items():
                if keyword in sentence_lower:
                    print(f"Found sound keyword: '{keyword}' in sentence {i+1}/{total_sentences}")
                    
                    # Calculate exact position percentage (0-100%)
                    exact_position = sentence_position * 100
                    
                    # Determine position category
                    position_category = "beginning" if exact_position < 33 else "middle" if exact_position < 66 else "end"
                    
                    sound_opportunities.append({
                        "text_reference": f"Contains '{keyword}' in sentence: \"{sentence.strip()}\"",
                        "sound_type": sound_info["type"],
                        "sound_description": sound_info["desc"],
                        "position": position_category,
                        "exact_position": exact_position,  # Store exact position percentage
                        "sentence_index": i,              # Store sentence index for ordering
                        "volume": sound_info["volume"],
                        "duration": "extended" if sound_info["type"] == "ambient" or sound_info["type"] == "environmental" else "short"
                    })
        
        # Sort opportunities by sentence index for chronological ordering
        sound_opportunities.sort(key=lambda x: x["sentence_index"])
        
        # Remove duplicates (similar sound descriptions in adjacent sentences)
        unique_opportunities = []
        last_description = None
        last_sentence_index = -3  # Initialize to ensure the first sound is always included
        
        for opportunity in sound_opportunities:
            current_description = opportunity["sound_description"]
            current_index = opportunity["sentence_index"]
            
            # Only add if this isn't a duplicate of a recent sound (within 2 sentences)
            if current_description != last_description or (current_index - last_sentence_index) > 2:
                unique_opportunities.append(opportunity)
                last_description = current_description
                last_sentence_index = current_index
        
        if not unique_opportunities:
            print("No sound keywords found in the text.")
        else:
            print(f"Found {len(unique_opportunities)} unique sound opportunities")
        
        return unique_opportunities

    def fetch_sound_effects_from_freesound(self, sound_descriptions, api_key=None):
        """
        Fetch sound effects from the Freesound API based on descriptions.
        
        Args:
            sound_descriptions (list): List of sound effect descriptions
            api_key (str, optional): Freesound API key
            
        Returns:
            dict: Dictionary mapping sound descriptions to downloaded file paths
        """
        print("Fetching sound effects from Freesound...")
        
        # Create a temporary directory to store downloaded sounds
        temp_dir = Path(tempfile.mkdtemp(prefix="soundscape_"))
        
        # Dictionary to store mapping of descriptions to downloaded files
        sound_map = {}
        
        for sound_info in sound_descriptions:
            description = sound_info["sound_description"].lower()
            
            # Convert spaces to + for URL formatting
            search_query = description.replace(" ", "+")
            
            print(f"Searching for sound: {description}")
            
            try:
                # If we have an API key, use it
                if api_key:
                    # Freesound API search endpoint
                    search_url = f"https://freesound.org/apiv2/search/text/?query={search_query}&token={api_key}"
                    
                    response = requests.get(search_url)
                    
                    if response.status_code == 200:
                        search_results = response.json()
                        
                        if search_results.get('results') and len(search_results['results']) > 0:
                            # Get the first result
                            sound_id = search_results['results'][0]['id']
                            
                            # Get the sound details
                            sound_url = f"https://freesound.org/apiv2/sounds/{sound_id}/?token={api_key}"
                            sound_response = requests.get(sound_url)
                            
                            if sound_response.status_code == 200:
                                sound_data = sound_response.json()
                                download_url = sound_data.get('previews', {}).get('preview-hq-mp3')
                                
                                if download_url:
                                    # Download the sound
                                    sound_download = requests.get(download_url)
                                    if sound_download.status_code == 200:
                                        # Save to file
                                        file_path = temp_dir / f"{description.replace(' ', '_')}_{sound_id}.mp3"
                                        with open(file_path, 'wb') as f:
                                            f.write(sound_download.content)
                                        
                                        sound_map[description] = str(file_path)
                                        print(f"  Downloaded: {file_path.name}")
                                        continue
                
                # If we don't have an API key or the API request failed, use a fallback
                # Try to find a suitable sound from a public source or a local collection
                fallback_path = self.find_fallback_sound(description, temp_dir)
                
                if fallback_path:
                    sound_map[description] = fallback_path
                    print(f"  Used fallback sound for: {description}")
                else:
                    print(f"  No sound found for: {description}")
                
            except Exception as e:
                print(f"  Error fetching sound '{description}': {str(e)}")
                continue
        
        return sound_map

    def find_fallback_sound(self, description, output_dir):
        """
        Find a fallback sound from a local collection or a public domain source.
        
        Args:
            description (str): Sound description
            output_dir (Path): Directory to save the sound
            
        Returns:
            str: Path to the sound file, or None if not found
        """
        # Define some public domain sound URLs for common sounds
        public_sounds = {
            "gunshot": "https://freesound.org/data/previews/156/156031_2703468-lq.mp3",
            "sizzling": "https://freesound.org/data/previews/249/249515_4486188-lq.mp3",
            "rain": "https://freesound.org/data/previews/169/169280_2888453-lq.mp3",
            "thunder": "https://freesound.org/data/previews/102/102806_1822453-lq.mp3",
            "wind": "https://freesound.org/data/previews/131/131723_2398403-lq.mp3",
            "ocean waves": "https://freesound.org/data/previews/47/47599_78512-lq.mp3",
            "ocean": "https://freesound.org/data/previews/47/47599_78512-lq.mp3",
            "waves": "https://freesound.org/data/previews/47/47599_78512-lq.mp3",
            "fire crackling": "https://freesound.org/data/previews/32/32863_177819-lq.mp3",
            "footsteps": "https://freesound.org/data/previews/268/268387_2152380-lq.mp3",
            "running footsteps": "https://freesound.org/data/previews/268/268387_2152380-lq.mp3",
            "door": "https://freesound.org/data/previews/254/254641_4597841-lq.mp3",
            "glass breaking": "https://freesound.org/data/previews/444/444429_2302458-lq.mp3",
            "birds chirping": "https://freesound.org/data/previews/42/42324_78512-lq.mp3",
            "city ambience": "https://freesound.org/data/previews/170/170958_1826131-lq.mp3",
            "traffic": "https://freesound.org/data/previews/170/170958_1826131-lq.mp3",
            "car passing": "https://freesound.org/data/previews/85/85460_719474-lq.mp3",
            "explosion": "https://freesound.org/data/previews/35/35642_250818-lq.mp3"
        }
        
        # Check if we have a match in our dictionary
        sound_url = None
        for key, url in public_sounds.items():
            if key in description or description in key:
                sound_url = url
                break
        
        if not sound_url:
            # For sounds we don't have a direct match, try some fallbacks
            if "ambient" in description:
                sound_url = public_sounds.get("city ambience")
            elif "environmental" in description:
                sound_url = public_sounds.get("wind")
            elif "water" in description:
                sound_url = public_sounds.get("ocean waves")
        
        if sound_url:
            try:
                # Download the sound
                response = requests.get(sound_url)
                if response.status_code == 200:
                    # Create a unique filename
                    filename = f"{description.replace(' ', '_')}_{hash(description) % 10000}.mp3"
                    file_path = output_dir / filename
                    
                    # Save to file
                    with open(file_path, 'wb') as f:
                        f.write(response.content)
                    
                    return str(file_path)
            except Exception as e:
                print(f"Failed to download fallback sound: {e}")
        
        return None

    def create_dynamic_soundscape(self, voice_audio_path, sound_opportunities, sound_map):
        """
        Layer sound effects and ambient sounds onto the voice track to create a dynamic soundscape.
        Fixed to properly place sounds according to their position in the text and avoid repetition.
        
        Args:
            voice_audio_path (str): Path to the voice audio file
            sound_opportunities (list): List of sound effect opportunities with timing information
            sound_map (dict): Dictionary mapping sound descriptions to file paths
            
        Returns:
            str: Path to the enhanced audio file with soundscape
        """
        try:
            print("Creating dynamic soundscape...")
            
            # Load the voice track
            voice_track = AudioSegment.from_file(voice_audio_path)
            voice_duration_ms = len(voice_track)
            
            # Normalize the voice track to ensure clarity
            voice_track = normalize(voice_track)
            
            # Create a dictionary to track layers at different points in the timeline
            # We'll divide the timeline into more segments for better precision
            num_segments = 20
            segment_duration = voice_duration_ms / num_segments
            timeline = defaultdict(list)
            
            # Map position descriptions to timeline segments more precisely
            position_mapping = {
                "beginning": list(range(0, 7)),     # First third (segments 0-6)
                "middle": list(range(7, 14)),       # Middle third (segments 7-13)
                "end": list(range(14, num_segments)) # Last third (segments 14-19)
            }
            
            # Map duration descriptions to approximate durations in milliseconds
            duration_mapping = {
                "momentary": int(segment_duration * 0.5),  # Very short sound
                "short": int(segment_duration * 1.2),      # Short sound that doesn't repeat
                "extended": int(segment_duration * 2.5),   # Longer sound
                "continuous": voice_duration_ms            # Full duration sound
            }
            
            # Map volume descriptions to decibel adjustments
            volume_mapping = {
                "background": -12,  # Background sounds
                "moderate": -6,     # Moderate sounds
                "foreground": -2    # Foreground sounds
            }
            
            print("Analyzing sound opportunities for placement...")
            for sound_info in sound_opportunities:
                # Skip if we don't have this sound in our map
                if sound_info["sound_description"] not in sound_map:
                    continue
                    
                sound_file = sound_map[sound_info["sound_description"]]
                position = sound_info["position"]
                volume = sound_info["volume"]
                duration_type = sound_info["duration"]
                
                # Load the sound effect
                try:
                    sound_effect = AudioSegment.from_file(sound_file)
                    
                    # Normalize the sound effect for consistent volume
                    sound_effect = normalize(sound_effect)
                    
                except Exception as e:
                    print(f"Warning: Could not load sound file: {sound_file}: {e}")
                    continue
                
                # Apply volume adjustment
                sound_effect = sound_effect + volume_mapping[volume]
                
                # Get segments for this sound based on its position in the text
                segments = position_mapping[position]
                
                # IMPORTANT FIX: Only place the sound in ONE segment from the position range
                # instead of all segments to prevent repetition
                if sound_info["sound_type"] == "event":
                    # For event sounds (like gunshots), place just once in a single segment
                    # Choose a segment from the beginning of the position range
                    target_segment = segments[0]
                    
                    # For gunshots specifically, make sure they're distinctly heard
                    if "gunshot" in sound_info["sound_description"].lower():
                        sound_effect = sound_effect + 2  # Boost volume
                    
                    timeline[target_segment].append({
                        "sound": sound_effect,
                        "description": sound_info["sound_description"],
                        "type": sound_info["sound_type"]
                    })
                    
                    print(f"Placed '{sound_info['sound_description']}' as event at segment {target_segment+1}/{num_segments}")
                    
                elif sound_info["sound_type"] == "ambient" or sound_info["sound_type"] == "environmental":
                    # For ambient sounds, we can place them across multiple segments but with fades
                    # between to prevent abrupt repetition
                    
                    # Choose a subset of the segments (not all) to prevent overwhelming repetition
                    if len(segments) > 3:
                        # Take up to 3 segments with spacing between them
                        target_segments = [segments[0], segments[len(segments)//2], segments[-1]]
                    else:
                        target_segments = [segments[0]]
                    
                    for segment_idx in target_segments:
                        # Adjust volume to be quieter for repeated ambient sounds
                        segment_sound = sound_effect - 3
                        
                        timeline[segment_idx].append({
                            "sound": segment_sound,
                            "description": sound_info["sound_description"],
                            "type": sound_info["sound_type"]
                        })
                    
                    print(f"Placed '{sound_info['sound_description']}' as ambient in {len(target_segments)} segments")
                
            # Create the final mix by layering sounds onto the voice track
            final_mix = voice_track - 2  # Slightly reduce voice volume
            
            print("Layering sounds onto voice track...")
            
            # Process each segment
            for segment_idx in range(num_segments):
                segment_start = int(segment_idx * segment_duration)
                
                # Layer all sounds assigned to this segment
                for sound_layer in timeline[segment_idx]:
                    sound_effect = sound_layer["sound"]
                    sound_type = sound_layer["type"]
                    
                    # Create a silent segment the length of the voice track
                    sound_bed = AudioSegment.silent(duration=voice_duration_ms)
                    
                    # Calculate actual duration based on sound type
                    if sound_type == "event":
                        actual_duration = min(duration_mapping["short"], len(sound_effect))
                    else:
                        actual_duration = min(duration_mapping["extended"], len(sound_effect))
                    
                    # Trim sound to appropriate duration
                    sound_effect = sound_effect[:actual_duration]
                    
                    # Position the sound effect at the start of this segment
                    sound_bed = sound_bed.overlay(sound_effect, position=segment_start)
                    
                    # Add a fade in/out to avoid abrupt transitions
                    fade_duration = min(300, len(sound_effect) // 3)
                    sound_bed = sound_bed.fade_in(fade_duration).fade_out(fade_duration)
                    
                    # Layer onto the final mix
                    final_mix = final_mix.overlay(sound_bed)
                    
                    print(f"Added {sound_layer['description']} at position {segment_start/1000:.1f}s")
            
            # Final normalization to prevent clipping
            final_mix = normalize(final_mix)
            
            # Create output file path
            output_path = Path(voice_audio_path)
            enhanced_path = output_path.parent / f"enhanced_{output_path.name}"
            
            # Export the final mix
            final_mix.export(enhanced_path, format="mp3", bitrate="256k")
            print(f"Enhanced audio with soundscape saved to: {enhanced_path}")
            
            return str(enhanced_path)
            
        except Exception as e:
            print(f"Error creating soundscape: {str(e)}")
            # Return the original file path in case of error
            return voice_audio_path

    def create_dynamic_soundscape_fixed(self, voice_audio_path, sound_opportunities, sound_map):
        """
        Completely redesigned function to create a dynamic soundscape without repetition issues.
        Places sounds exactly once at their exact positions in the timeline.
        
        Args:
            voice_audio_path (str): Path to the voice audio file
            sound_opportunities (list): List of sound effect opportunities with timing information
            sound_map (dict): Dictionary mapping sound descriptions to file paths
            
        Returns:
            str: Path to the enhanced audio file with soundscape
        """
        try:
            print("\n=== Creating Fixed Dynamic Soundscape ===")
            print(f"Voice audio: {voice_audio_path}")
            print(f"Number of sound opportunities: {len(sound_opportunities)}")
            
            # Load the voice track
            voice_track = AudioSegment.from_file(voice_audio_path)
            voice_duration_ms = len(voice_track)
            print(f"Voice duration: {voice_duration_ms/1000:.2f} seconds")
            
            # Normalize the voice track for clarity
            voice_track = normalize(voice_track)
            
            # Start with the voice track as our base
            final_mix = voice_track - 2  # Slightly reduce voice volume
            
            # Define durations for different sound types
            durations = {
                "event": 3000,       # 3 seconds for short events
                "ambient": 8000,     # 8 seconds for ambient sounds
                "environmental": 10000  # 10 seconds for environmental sounds
            }
            
            # Define volume levels
            volumes = {
                "background": -15,   # Quiet background sounds
                "moderate": -8,      # Moderate volume
                "foreground": -3     # Prominent sounds
            }
            
            # Process each sound opportunity one by one
            for i, sound_info in enumerate(sound_opportunities):
                description = sound_info["sound_description"]
                
                # Skip if we don't have this sound in our map
                if description not in sound_map:
                    print(f"Skipping '{description}' - no sound file available")
                    continue
                
                sound_file = sound_map[description]
                sound_type = sound_info["sound_type"]
                volume_level = sound_info["volume"]
                
                # Calculate exact position in milliseconds using the exact_position percentage
                # If exact_position isn't available, fall back to the category
                if "exact_position" in sound_info:
                    exact_pos_percent = sound_info["exact_position"]
                    position_ms = int((exact_pos_percent / 100) * voice_duration_ms)
                else:
                    # Fall back to position categories
                    if sound_info["position"] == "beginning":
                        position_ms = int(voice_duration_ms * 0.2)  # 20% mark
                    elif sound_info["position"] == "middle":
                        position_ms = int(voice_duration_ms * 0.5)  # 50% mark
                    else:  # "end"
                        position_ms = int(voice_duration_ms * 0.8)  # 80% mark
                
                print(f"\nProcessing sound {i+1}: '{description}' at position {position_ms/1000:.2f}s")
                
                try:
                    # Load the sound effect
                    sound_effect = AudioSegment.from_file(sound_file)
                    
                    # Normalize for consistent volume
                    sound_effect = normalize(sound_effect)
                    
                    # Apply appropriate volume
                    sound_effect = sound_effect + volumes[volume_level]
                    
                    # Determine sound duration based on type
                    target_duration = durations.get(sound_type, 5000)  # Default 5 seconds
                    
                    # Adjust for specific sounds
                    if "gunshot" in description:
                        target_duration = 2000  # Shorter for gunshots
                        sound_effect = sound_effect + 3  # Make gunshots slightly louder
                    elif "sizzling" in description:
                        target_duration = 5000  # Medium for sizzling
                    elif "fire crackling" in description:
                        target_duration = 7000  # Longer for fire
                    
                    # Ensure we don't exceed the sound's actual length
                    if len(sound_effect) < target_duration:
                        # For ambient sounds, loop to reach target duration
                        if sound_type == "ambient" or sound_type == "environmental":
                            repeats = int(target_duration / len(sound_effect)) + 1
                            sound_effect = sound_effect * repeats
                    
                    # Trim to target duration
                    sound_effect = sound_effect[:target_duration]
                    
                    # Add fades to avoid pops and clicks
                    fade_in_duration = min(500, len(sound_effect) // 4)
                    fade_out_duration = min(1000, len(sound_effect) // 3)
                    sound_effect = sound_effect.fade_in(fade_in_duration).fade_out(fade_out_duration)
                    
                    # Create a silent segment as long as the voice track
                    sound_bed = AudioSegment.silent(duration=voice_duration_ms)
                    
                    # Overlay the sound at the calculated position
                    sound_bed = sound_bed.overlay(sound_effect, position=position_ms)
                    
                    # Add to the final mix
                    final_mix = final_mix.overlay(sound_bed)
                    
                    print(f"Added '{description}' ({len(sound_effect)/1000:.1f}s long) at {position_ms/1000:.1f}s")
                    
                except Exception as e:
                    print(f"Error processing sound '{description}': {e}")
                    continue
            
            # Final normalization
            final_mix = normalize(final_mix)
            
            # Create output file path
            output_path = Path(voice_audio_path)
            enhanced_path = output_path.parent / f"fixed_enhanced_{output_path.name}"
            
            # Export the final mix
            final_mix.export(enhanced_path, format="mp3", bitrate="256k")
            print(f"\nEnhanced audio saved to: {enhanced_path}")
            
            return str(enhanced_path)
            
        except Exception as e:
            print(f"Error creating soundscape: {str(e)}")
            import traceback
            traceback.print_exc()
            # Return the original file path in case of error
            return voice_audio_path

class image_generation():
    def __init__(self, openai_api_key):
        """
        Initialize the image generation class with an OpenAI API key.
        
        Args:
            openai_api_key (str): OpenAI API key for DALL-E access
        """
        self.openai_api_key = openai_api_key
        from openai import OpenAI
        self.client = OpenAI(api_key=openai_api_key)
    
    def extract_scene_descriptions(self, text, num_scenes=3):
        """
        Extract concise scene descriptions from the transcript text.
        
        Args:
            text (str): The transcript or translated text
            num_scenes (int): Number of scenes to generate (default: 3)
            
        Returns:
            list: List of scene descriptions
        """
        from openai import OpenAI
        client = OpenAI(api_key=self.openai_api_key)
        
        prompt = f"""
        Analyze the following text and extract {num_scenes} key visual scenes that would work well as images.
        For each scene, provide a clear, detailed visual description (without interpretation) that could be used
        to generate an image. Focus on concrete visual elements, settings, and actions.
        
        Text: {text}
        
        Format each scene description as a single paragraph of 2-3 sentences, focusing on the visual details.
        """
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        
        scene_text = response.choices[0].message.content
        
        # Split the response into separate scene descriptions
        import re
        scene_descriptions = []
        
        # Look for numbered scenes or Scene 1:, Scene 2: patterns
        scenes = re.split(r'Scene \d+:|^\d+\.|^\d+:', scene_text, flags=re.MULTILINE)
        # Clean up the split results
        scenes = [scene.strip() for scene in scenes if scene.strip()]
        
        if len(scenes) < num_scenes:
            # If splitting didn't work well, just split by paragraphs
            scenes = [p.strip() for p in scene_text.split('\n\n') if p.strip()]
        
        # Take the requested number of scenes
        return scenes[:num_scenes]
    
    def generate_images(self, scene_descriptions, output_folder, size="1024x1024"):
        """
        Generate images from scene descriptions using DALL-E.
        
        Args:
            scene_descriptions (list): List of scene descriptions
            output_folder (str): Folder to save images
            size (str): Image size - "1024x1024", "512x512" or "256x256"
            
        Returns:
            list: Paths to the generated images
        """
        image_paths = []
        output_folder = Path(output_folder)
        
        # Ensure output folder exists
        output_folder.mkdir(exist_ok=True, parents=True)
        
        for i, description in enumerate(scene_descriptions):
            print(f"Generating image {i+1}/{len(scene_descriptions)}")
            print(f"Scene description: {description[:100]}...")
            
            # Enhance the prompt for better DALL-E results
            enhanced_prompt = f"A realistic, detailed scene: {description}. Photorealistic, high quality."
            
            try:
                # Generate the image with DALL-E
                response = self.client.images.generate(
                    model="dall-e-2",  # Using DALL-E 2 for reliability
                    prompt=enhanced_prompt,
                    size=size,
                    quality="standard",
                    n=1,
                )
                
                # Get the image URL
                image_url = response.data[0].url
                
                # Download the image
                import requests
                image_response = requests.get(image_url)
                
                # Save the image
                image_filename = f"scene_{i+1}.png"
                image_path = output_folder / image_filename
                
                with open(image_path, "wb") as f:
                    f.write(image_response.content)
                
                print(f"Image saved to: {image_path}")
                image_paths.append(str(image_path))
                
            except Exception as e:
                print(f"Error generating image: {e}")
                continue
        
        return image_paths
    
    def create_html_gallery(self, image_paths, transcript_text, output_folder):
        """
        Create an HTML gallery to display the images with captions.
        
        Args:
            image_paths (list): Paths to the generated images
            transcript_text (str): The transcript text
            output_folder (str): Folder to save the HTML file
            
        Returns:
            str: Path to the HTML gallery file
        """
        output_folder = Path(output_folder)
        html_path = output_folder / "gallery.html"
        
        # Create relative paths for the images
        relative_paths = []
        for path in image_paths:
            path_obj = Path(path)
            relative_paths.append(path_obj.name)
        
        # Create HTML content
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scene Visualization Gallery</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }}
        h1, h2 {{
            color: #333;
        }}
        .transcript {{
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
            border: 1px solid #ddd;
        }}
        .gallery {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }}
        .image-card {{
            background-color: white;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }}
        .image-card:hover {{
            transform: translateY(-5px);
        }}
        .image-card img {{
            width: 100%;
            height: auto;
            display: block;
        }}
        .image-caption {{
            padding: 15px;
            border-top: 1px solid #eee;
        }}
        .footer {{
            margin-top: 30px;
            text-align: center;
            color: #777;
            font-size: 14px;
        }}
    </style>
</head>
<body>
    <h1>Scene Visualization Gallery</h1>
    
    <div class="transcript">
        <h2>Transcript</h2>
        <p>{transcript_text}</p>
    </div>
    
    <h2>Visualized Scenes</h2>
    <div class="gallery">
"""
        
        # Add each image to the gallery
        for i, path in enumerate(relative_paths):
            html_content += f"""
        <div class="image-card">
            <img src="{path}" alt="Scene {i+1}">
            <div class="image-caption">
                <h3>Scene {i+1}</h3>
            </div>
        </div>
"""
        
        # Close the HTML
        html_content += """
    </div>
    
    <div class="footer">
        <p>Generated with DALL-E 2 based on transcript analysis.</p>
    </div>
</body>
</html>
"""
        
        # Write the HTML file
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        print(f"HTML gallery created at: {html_path}")
        return str(html_path)
    
    def generate_video_from_text(self, text, output_folder):
        """
        Generate a visual representation of the text using DALL-E images.
        
        Args:
            text (str): The transcript or translated text
            output_folder (str): Folder to save the generated files
            
        Returns:
            dict: Paths to the generated files
        """
        output_folder = Path(output_folder)
        
        print("Analyzing text to extract key scenes...")
        scene_descriptions = self.extract_scene_descriptions(text)
        
        print(f"Extracted {len(scene_descriptions)} scene descriptions:")
        for i, desc in enumerate(scene_descriptions):
            print(f"\nScene {i+1}:\n{desc}")
        
        print("\nGenerating images with DALL-E...")
        image_paths = self.generate_images(scene_descriptions, output_folder)
        
        print("\nCreating HTML gallery...")
        html_path = self.create_html_gallery(image_paths, text, output_folder)
        
        result = {
            "scene_descriptions": scene_descriptions,
            "image_paths": image_paths,
            "gallery_path": html_path
        }
        
        print("\nImage generation complete!")
        return result

class DynamicHistoricalContextExtractor:
    """
    A class to extract historical context that dynamically queries for images
    without storing any predefined image URLs or resources in the code.
    """
    
    def __init__(self, openai_api_key):
        """Initialize the extractor with necessary API key"""
        self.openai_api_key = openai_api_key
    
    def extract_context_with_images(self, text, output_folder):
        """
        Extract historical context from text and dynamically find images
        
        Args:
            text (str): Input text to analyze
            output_folder (str): Folder to save results
            
        Returns:
            dict: Results with summary and image paths
        """
        print("\nExtracting historical context...")
        
        # Create output folder structure
        output_folder = Path(output_folder)
        history_folder = output_folder / "historical_context"
        os.makedirs(history_folder, exist_ok=True)
        
        images_folder = history_folder / "images"
        os.makedirs(images_folder, exist_ok=True)
        
        try:
            # Step 1: Get historical context using OpenAI
            historical_summary = self._get_historical_summary(text)
            print(f"Historical context identified: {historical_summary}")
            
            # Step 2: Extract key search terms
            search_terms = self._extract_key_terms(historical_summary)
            print(f"Search terms: {', '.join(search_terms)}")
            
            # Step 3: Get timeline points
            timeline_points = self._get_timeline_points(historical_summary)
            print(f"Generated {len(timeline_points)} timeline points")
            
            # Step 4: Find and download images
            images_info = self._find_and_download_images(search_terms, images_folder)
            print(f"Downloaded {len(images_info)} images")
            
            # Step 5: Save results
            result = {
                "historical_summary": historical_summary,
                "search_terms": search_terms,
                "timeline_points": timeline_points,
                "images": images_info
            }
            
            self._save_results(result, history_folder)
            
            return {
                "historical_data_file": str(history_folder / "historical_context.json"),
                "summary_file": str(history_folder / "historical_context.txt"),
                "images_folder": str(images_folder),
                "results": result
            }
            
        except Exception as e:
            print(f"Error in historical context extraction: {e}")
            error_path = history_folder / "error.txt"
            with open(error_path, "w", encoding="utf-8") as f:
                f.write(f"Error extracting historical context: {str(e)}")
            
            return {
                "error": str(e),
                "error_file": str(error_path)
            }
    
    def _get_historical_summary(self, text):
        """
        Get a concise historical context summary using OpenAI API
        
        Args:
            text (str): Text to analyze
            
        Returns:
            str: Historical context summary
        """
        prompt = f"""Analyze this text which mentions historical events:

"{text}"

Identify the specific historical event or period being referenced.
Provide exactly ONE sentence (15-25 words) describing this historical context.
Be precise, factual, and include the specific time period."""

        try:
            # Call OpenAI API using http.client (no external libraries)
            response_text = self._call_openai_api(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You provide concise, factual historical context in exactly one sentence."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=60
            )
            
            # Parse the response
            response_json = json.loads(response_text)
            summary = response_json["choices"][0]["message"]["content"].strip()
            
            # Clean up the summary (remove quotes, etc.)
            summary = summary.replace('"', '').replace('"', '')
            
            return summary
            
        except Exception as e:
            print(f"Error getting historical summary: {e}")
            return "Could not determine historical context."
    
    def _extract_key_terms(self, historical_summary):
        """
        Extract key search terms from the historical summary
        
        Args:
            historical_summary (str): The historical summary
            
        Returns:
            list: Key search terms
        """
        prompt = f"""From this historical context sentence: "{historical_summary}"

Extract exactly 3 specific search terms that would be most effective for finding 
relevant historical images online. Focus on:
1. Specific event names
2. Locations
3. Time periods (years)

Format: term1, term2, term3"""

        try:
            # Call OpenAI API using http.client (no external libraries)
            response_text = self._call_openai_api(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You extract key search terms for historical image searches."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=30
            )
            
            # Parse the response
            response_json = json.loads(response_text)
            terms_text = response_json["choices"][0]["message"]["content"].strip()
            
            # Split into individual terms
            terms = [term.strip() for term in terms_text.split(',')]
            
            # Ensure we have at least 3 terms
            if len(terms) < 3:
                # Extract words from the summary as fallback
                extra_terms = re.findall(r'\b\w{4,}\b', historical_summary)
                terms.extend([t for t in extra_terms if t not in terms])
            
            return terms[:3]  # Limit to 3 terms
            
        except Exception as e:
            print(f"Error extracting key terms: {e}")
            words = re.findall(r'\b\w{4,}\b', historical_summary)
            return words[:3]  # Take first 3 significant words
    
    def _get_timeline_points(self, historical_summary):
        """
        Get timeline points for the historical context
        
        Args:
            historical_summary (str): The historical summary
            
        Returns:
            list: Timeline points
        """
        prompt = f"""Based on this historical context: "{historical_summary}"

Provide a timeline with exactly 3 points:
1. One significant event that happened BEFORE
2. One key event that happened DURING 
3. One significant event that happened AFTER

For each point, include:
- Year/date
- Brief description (1-2 sentences)
- Why it's historically significant

Be factual and specific."""

        try:
            # Call OpenAI API using http.client (no external libraries)
            response_text = self._call_openai_api(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You provide factual historical timeline points."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            # Parse the response
            response_json = json.loads(response_text)
            timeline_text = response_json["choices"][0]["message"]["content"].strip()
            
            # Split into separate timeline points
            timeline_points = []
            
            # Try to split by numbered points first
            for pattern in [r'\d+\.\s', r'BEFORE:', r'DURING:', r'AFTER:']:
                if re.search(pattern, timeline_text, re.IGNORECASE):
                    points = re.split(pattern, timeline_text)[1:]  # Skip first empty element
                    if len(points) >= 3:
                        timeline_points = [point.strip() for point in points[:3]]
                        break
            
            # If that didn't work, try paragraphs
            if not timeline_points:
                paragraphs = timeline_text.split("\n\n")
                timeline_points = [para.strip() for para in paragraphs if para.strip()]
            
            # Make sure we have at least 3 items
            while len(timeline_points) < 3:
                timeline_points.append("Additional historical information unavailable.")
            
            return timeline_points[:3]  # Limit to 3 points
            
        except Exception as e:
            print(f"Error generating timeline: {e}")
            return [
                "Events leading to the historical context.",
                "Key events during the period.",
                "Aftermath and consequences."
            ]
    
    def _find_and_download_images(self, search_terms, images_folder):
        """
        Dynamically find and download images for the given search terms
        
        Args:
            search_terms (list): Search terms
            images_folder (Path): Folder to save images
            
        Returns:
            list: Information about downloaded images
        """
        downloaded_images = []
        
        # Try to find images for each search term
        for i, term in enumerate(search_terms):
            print(f"Searching for images: '{term}'")
            
            # We'll try multiple sources for each term
            image_found = False
            
            # Try source 1: Wikimedia Commons
            if not image_found:
                try:
                    image_urls = self._search_wikimedia_commons(f"{term} historical")
                    
                    if image_urls:
                        url = image_urls[0]  # Take the first one
                        filename = f"historical_image_{i+1}_wikimedia.jpg"
                        filepath = images_folder / filename
                        
                        print(f"Downloading Wikimedia image for '{term}'...")
                        if self._download_file(url, filepath):
                            downloaded_images.append({
                                "filename": filename,
                                "path": str(filepath),
                                "source": "Wikimedia Commons",
                                "search_term": term,
                                "url": url
                            })
                            image_found = True
                            print(f"  Successfully downloaded from Wikimedia")
                except Exception as e:
                    print(f"  Error with Wikimedia search: {e}")
            
            # Try source 2: Library of Congress
            if not image_found:
                try:
                    image_urls = self._search_library_of_congress(term)
                    
                    if image_urls:
                        url = image_urls[0]  # Take the first one
                        filename = f"historical_image_{i+1}_loc.jpg"
                        filepath = images_folder / filename
                        
                        print(f"Downloading Library of Congress image for '{term}'...")
                        if self._download_file(url, filepath):
                            downloaded_images.append({
                                "filename": filename,
                                "path": str(filepath),
                                "source": "Library of Congress",
                                "search_term": term,
                                "url": url
                            })
                            image_found = True
                            print(f"  Successfully downloaded from Library of Congress")
                except Exception as e:
                    print(f"  Error with Library of Congress search: {e}")
            
            # Try source 3: British Library
            if not image_found:
                try:
                    image_urls = self._search_british_library(term)
                    
                    if image_urls:
                        url = image_urls[0]  # Take the first one
                        filename = f"historical_image_{i+1}_bl.jpg"
                        filepath = images_folder / filename
                        
                        print(f"Downloading British Library image for '{term}'...")
                        if self._download_file(url, filepath):
                            downloaded_images.append({
                                "filename": filename,
                                "path": str(filepath),
                                "source": "British Library",
                                "search_term": term,
                                "url": url
                            })
                            image_found = True
                            print(f"  Successfully downloaded from British Library")
                except Exception as e:
                    print(f"  Error with British Library search: {e}")
            
            # Wait a bit between terms to avoid rate limiting
            time.sleep(1)
        
        return downloaded_images
    
    def _search_wikimedia_commons(self, search_term):
        """
        Search Wikimedia Commons for images
        
        Args:
            search_term (str): Search term
            
        Returns:
            list: Image URLs
        """
        # URL encode the search term
        encoded_term = urllib.parse.quote(search_term)
        
        try:
            # Create API URL (using the MediaWiki API)
            api_url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={encoded_term}%20filetype:bitmap&srnamespace=6&format=json&srlimit=5"
            
            # Make the request
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            
            with urllib.request.urlopen(api_url, context=ctx, timeout=10) as response:
                data = json.loads(response.read().decode("utf-8"))
            
            # Extract file titles from search results
            file_titles = []
            if 'query' in data and 'search' in data['query']:
                file_titles = [item['title'] for item in data['query']['search']]
            
            # Get actual file URLs
            image_urls = []
            for title in file_titles:
                # URL encode the title
                encoded_title = urllib.parse.quote(title)
                
                # Get file info
                file_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={encoded_title}&prop=imageinfo&iiprop=url&format=json"
                
                with urllib.request.urlopen(file_url, context=ctx, timeout=10) as file_response:
                    file_data = json.loads(file_response.read().decode("utf-8"))
                
                # Extract the URL
                if 'query' in file_data and 'pages' in file_data['query']:
                    for page_id in file_data['query']['pages']:
                        page = file_data['query']['pages'][page_id]
                        if 'imageinfo' in page and page['imageinfo']:
                            image_url = page['imageinfo'][0]['url']
                            image_urls.append(image_url)
            
            return image_urls
            
        except Exception as e:
            print(f"Error searching Wikimedia Commons: {e}")
            return []
    
    def _search_library_of_congress(self, search_term):
        """
        Search Library of Congress for images
        
        Args:
            search_term (str): Search term
            
        Returns:
            list: Image URLs
        """
        # URL encode the search term
        encoded_term = urllib.parse.quote(search_term)
        
        try:
            # Create search URL
            search_url = f"https://www.loc.gov/pictures/search/?q={encoded_term}&sp=1&fo=json"
            
            # Make the request
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            
            with urllib.request.urlopen(search_url, context=ctx, timeout=10) as response:
                data = json.loads(response.read().decode("utf-8"))
            
            # Extract image URLs
            image_urls = []
            
            if 'results' in data:
                for item in data['results']:
                    if 'image_url' in item:
                        image_urls.append(item['image_url'])
                    elif 'image_full' in item:
                        image_urls.append(item['image_full'])
                    elif 'image_thumb' in item:
                        # Convert thumbnail URL to full image URL if possible
                        thumb_url = item['image_thumb']
                        if 'thumb' in thumb_url:
                            full_url = thumb_url.replace('thumb', 'full')
                            image_urls.append(full_url)
                        else:
                            image_urls.append(thumb_url)
            
            return image_urls
            
        except Exception as e:
            print(f"Error searching Library of Congress: {e}")
            return []
    
    def _search_british_library(self, search_term):
        """
        Search British Library for images
        
        Args:
            search_term (str): Search term
            
        Returns:
            list: Image URLs
        """
        # URL encode the search term
        encoded_term = urllib.parse.quote(search_term)
        
        try:
            # Unfortunately, British Library doesn't have a simple API
            # Let's try to scrape their search results
            search_url = f"https://www.bl.uk/collection-items?q={encoded_term}&view=grid"
            
            # Make the request
            req = urllib.request.Request(
                search_url,
                headers={"User-Agent": "Mozilla/5.0"}
            )
            
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            
            with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
                html = response.read().decode("utf-8")
            
            # Use regex to find image URLs
            image_urls = []
            
            # Look for image elements
            img_pattern = r'<img[^>]+src="([^"]+)"[^>]*>'
            img_matches = re.findall(img_pattern, html)
            
            for img_url in img_matches:
                # Filter for actual content images (not icons, etc.)
                if '/contentassets/' in img_url and '/collection-items/' in img_url:
                    # Make relative URLs absolute
                    if img_url.startswith('/'):
                        img_url = 'https://www.bl.uk' + img_url
                    
                    image_urls.append(img_url)
            
            return image_urls
            
        except Exception as e:
            print(f"Error searching British Library: {e}")
            return []
    
    def _download_file(self, url, filepath):
        """
        Download a file from a URL
        
        Args:
            url (str): URL to download from
            filepath (Path): Path to save the file
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Create a request with appropriate headers
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            req = urllib.request.Request(url, headers=headers)
            
            # Create SSL context
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            
            # Download the file
            with urllib.request.urlopen(req, context=ctx, timeout=20) as response:
                # Check if the response is valid
                if response.status != 200:
                    print(f"  Error: HTTP status {response.status}")
                    return False
                
                # Check content type (should be an image)
                content_type = response.headers.get('Content-Type', '')
                if not ('image/' in content_type) and not ('application/octet-stream' in content_type):
                    print(f"  Error: Not an image (Content-Type: {content_type})")
                    return False
                
                # Read the response data
                data = response.read()
                
                # Check if we got reasonable data
                if len(data) < 1000:  # Very small files may not be valid images
                    print(f"  Error: File too small ({len(data)} bytes)")
                    return False
                
                # Save the file
                with open(filepath, 'wb') as f:
                    f.write(data)
                
                return True
                
        except Exception as e:
            print(f"  Error downloading file: {e}")
            return False
    
    def _call_openai_api(self, model, messages, temperature=0.7, max_tokens=None):
        """
        Call OpenAI API without using the OpenAI library
        
        Args:
            model (str): OpenAI model to use
            messages (list): List of message dictionaries
            temperature (float): Sampling temperature
            max_tokens (int): Maximum tokens to generate
            
        Returns:
            str: API response as JSON string
        """
        # Prepare request data
        data = {
            "model": model,
            "messages": messages,
            "temperature": temperature
        }
        
        if max_tokens is not None:
            data["max_tokens"] = max_tokens
        
        # Convert to JSON
        json_data = json.dumps(data)
        
        # Set up the HTTPS connection
        conn = http.client.HTTPSConnection("api.openai.com")
        
        # Set headers
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.openai_api_key}"
        }
        
        # Make the request
        conn.request("POST", "/v1/chat/completions", json_data, headers)
        
        # Get the response
        response = conn.getresponse()
        response_data = response.read().decode("utf-8")
        
        # Close the connection
        conn.close()
        
        # Check for errors
        if response.status != 200:
            raise Exception(f"OpenAI API error: {response.status} {response_data}")
        
        return response_data
    
    def _save_results(self, result, output_folder):
        """
        Save results to files
        
        Args:
            result (dict): Results to save
            output_folder (Path): Output folder path
        """
        # Save to JSON file
        json_file = output_folder / "historical_context.json"
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)
        
        # Save to human-readable text file
        text_file = output_folder / "historical_context.txt"
        with open(text_file, "w", encoding="utf-8") as f:
            f.write("HISTORICAL CONTEXT ANALYSIS\n")
            f.write("=========================\n\n")
            
            f.write("SUMMARY:\n")
            f.write(result["historical_summary"])
            f.write("\n\n")
            
            f.write("SEARCH TERMS:\n")
            for term in result["search_terms"]:
                f.write(f"- {term}\n")
            f.write("\n")
            
            f.write("TIMELINE:\n")
            for i, point in enumerate(result["timeline_points"], 1):
                f.write(f"{i}. {point}\n\n")
            
            f.write("IMAGES:\n")
            for i, img in enumerate(result["images"], 1):
                f.write(f"{i}. {img['filename']} (search term: {img['search_term']})\n")
                f.write(f"   Source: {img['source']}\n")
            
            f.write("\n")
            f.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        print(f"Results saved to: {output_folder}")


def extract_historical_context(text, output_folder, openai_api_key):
    """
    Extract historical context from text with dynamically queried images
    
    Args:
        text (str): Text to analyze
        output_folder (Path): Output folder to save results
        openai_api_key (str): OpenAI API key
    
    Returns:
        dict: Dictionary with results and file paths
    """
    try:
        # Initialize the extractor
        extractor = DynamicHistoricalContextExtractor(openai_api_key)
        
        # Extract historical context with images
        result = extractor.extract_context_with_images(text, output_folder)
        
        return result
    
    except Exception as e:
        print(f"Error in historical context extraction: {e}")
        
        # Create a minimal fallback file
        output_folder = Path(output_folder)
        history_folder = output_folder / "historical_context"
        os.makedirs(history_folder, exist_ok=True)
        
        fallback_file = history_folder / "historical_context.txt"
        with open(fallback_file, "w", encoding="utf-8") as f:
            f.write("# Historical Context\n\n")
            f.write("An error occurred during extraction of historical context.\n\n")
            f.write(f"Error: {str(e)}\n\n")
        
        return {
            "fallback_file": str(fallback_file),
            "error": str(e)
        }

def extract_historical_context(text, output_folder, openai_api_key):
    """
    Extract historical context from text with images
    """
    try:
        # Initialize the improved extractor
        extractor = DynamicHistoricalContextExtractor(openai_api_key)
        
        # Extract historical context
        result = extractor.extract_context_with_images(text, output_folder)
        
        return {
            "historical_data_file": str(output_folder / "historical_context" / "historical_context.json"),
            "summary_file": str(output_folder / "historical_context" / "historical_context.txt"),
            "images_folder": str(output_folder / "historical_context" / "images"),
            "results": result
        }
    
    except Exception as e:
        import traceback
        print(f"Error in historical context extraction: {e}")
        traceback.print_exc()
        
        # Create a minimal fallback file
        history_folder = output_folder / "historical_context"
        history_folder.mkdir(exist_ok=True)
        
        fallback_file = history_folder / "historical_context.txt"
        with open(fallback_file, "w", encoding="utf-8") as f:
            f.write("# Historical Context\n\n")
            f.write("An error occurred during extraction of historical context.\n\n")
            f.write(f"Error: {str(e)}\n\n")
        
        return {
            "fallback_file": str(fallback_file),
            "error": str(e)
        }
    
def main_fixed():
    # Load environment variables from .env file
    load_dotenv()
    
    parser = argparse.ArgumentParser(description='Audio Translation System with Sound Effects and Historical Context')
    parser.add_argument('--input', type=str, help='Path to the input audio or video file')
    parser.add_argument('--source_language', type=str, default='English', help='Source language of the input')
    parser.add_argument('--target_language', type=str, default='Spanish', help='Target language for translation')
    parser.add_argument('--openai_key', type=str, help='OpenAI API key (overrides .env file)')
    parser.add_argument('--voice', type=str, default='alloy', help='Voice for text-to-speech (alloy, echo, fable, onyx, nova, shimmer)')
    parser.add_argument('--disable_soundscape', action='store_true', help='Disable dynamic soundscape generation')
    parser.add_argument('--disable_history', action='store_true', help='Disable historical context extraction')
    parser.add_argument('--freesound_key', type=str, help='Freesound API key for fetching sound effects (overrides .env file)')
    parser.add_argument('--simple', action='store_true', help='Run with minimal required input')
    parser.add_argument('--generate_video', action='store_true', help='Generate video from translated audio')
    # For compatibility
    parser.add_argument('--language', type=str, help='Legacy parameter: Target language (use --target_language instead)')
    
    args = parser.parse_args()
    
    # Handle legacy parameter for compatibility
    if args.language and not args.target_language:
        args.target_language = args.language
    
    # If simple mode is activated, prompt for the necessary information
    if args.simple or not args.input:
        print("\n=== Audio Translation System with Sound Effects and Historical Context ===\n")
        
        # Ask for input file
        input_file = args.input or input("Enter the path to your audio/video file: ").strip()
        
        # Ask for languages
        source_language = args.source_language or input(f"Source language [{args.source_language}]: ").strip() or args.source_language
        target_language = args.target_language or input(f"Target language [{args.target_language}]: ").strip() or args.target_language
        
        # Ask for special features
        enable_soundscape_input = input("Enable dynamic soundscape? (y/n) [y]: ").strip().lower()
        enable_soundscape = enable_soundscape_input == "" or enable_soundscape_input.startswith('y')
        
        enable_history_input = input("Extract historical context? (y/n) [y]: ").strip().lower()
        enable_history = enable_history_input == "" or enable_history_input.startswith('y')
        
        # Ask for video generation
        enable_video_input = input("Generate video from translated audio? (y/n) [n]: ").strip().lower()
        enable_video = enable_video_input.startswith('y')
        
        # Set the values back to args for processing
        args.input = input_file
        args.source_language = source_language
        args.target_language = target_language
        args.disable_soundscape = not enable_soundscape
        args.disable_history = not enable_history
        args.generate_video = enable_video
    
    # Get OpenAI API key with priority: 1) command line argument, 2) .env file, 3) environment variable, 4) prompt
    openai_api_key = args.openai_key or os.environ.get("OPENAI_API_KEY")
    if not openai_api_key:
        openai_api_key = input("Enter your OpenAI API key: ").strip()
        if not openai_api_key:
            raise ValueError("OpenAI API key is required.")
    
    # Get Freesound API key
    freesound_api_key = args.freesound_key or os.environ.get("FREESOUND_API_KEY")
    if not freesound_api_key and not args.disable_soundscape:
        freesound_api_key = input("Enter your Freesound API key (optional, press Enter to use fallback sounds): ").strip()
    
    api_ninjas_key = None

    # Get TwelveLabs API key if video generation is enabled
    twelvelabs_api_key = None
    if args.generate_video:
        twelvelabs_api_key = os.environ.get("TWELVELABS_API_KEY")
        if not twelvelabs_api_key:
            twelvelabs_api_key = input("Enter your TwelveLabs API key for video generation: ").strip()
    
    # Use input path
    input_path = Path(args.input)
    
    # Check if file exists
    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")
    
    # Create an instance of the audio class
    audio_processor = audio()
    
    try:
        print(f"\nProcessing file: {input_path}")
        print(f"Translating from {args.source_language} to {args.target_language}")
        
        # Create output folder
        job_dir = audio_processor.create_output_folder(str(input_path), args.source_language, args.target_language)
        output_path = job_dir / f"translated_audio.mp3"
        
        result = {
            "input_file": str(input_path),
            "output_folder": str(job_dir),
            "output_file": str(output_path),
            "source_language": args.source_language,
            "target_language": args.target_language,
            "voice": args.voice
        }
        
        # Determine if input is a video file
        file_ext = Path(input_path).suffix.lower()
        video_formats = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv']
        
        # Step 1: Extract audio if input is video
        audio_path = str(input_path)
        if file_ext in video_formats:
            temp_audio = os.path.join(tempfile.gettempdir(), f"{Path(input_path).stem}.mp3")
            audio_path = audio_processor.extract_audio_from_video(str(input_path), temp_audio)
            result["extracted_audio"] = audio_path
        
        # Step 2: Transcribe the audio
        print("Transcribing audio...")
        transcribed_text = audio_processor.transcribe_audio(audio_path, openai_api_key)
        print(f"\nTranscription:\n{transcribed_text}\n")
        result["transcription"] = transcribed_text
        
        # Save transcription to a text file
        transcription_file = job_dir / "transcription.txt"
        with open(transcription_file, "w", encoding="utf-8") as f:
            f.write(transcribed_text)
        result["transcription_file"] = str(transcription_file)
        
        # Step 2.5: Extract historical context from the transcription
        if not args.disable_history:
            print("\nExtracting historical context from transcription...")
            history_result = extract_historical_context(transcribed_text, job_dir, openai_api_key)
            result["historical_context"] = history_result
            print(f"Historical context analysis saved to: {job_dir}/historical_context/")
        
        # Step 3: Analyze for sound opportunities using improved function BEFORE translation
        sound_opportunities = None
        if not args.disable_soundscape:
            print("\nAnalyzing original text for sound effect opportunities...")
            sound_opportunities = audio_processor.analyze_text_for_sounds_multilingual(
                transcribed_text, 
                args.source_language,
                openai_api_key
            )
            
            # Save sound opportunities to a JSON file
            sound_opportunities_file = job_dir / "sound_opportunities.json"
            with open(sound_opportunities_file, "w", encoding="utf-8") as f:
                json.dump(sound_opportunities, f, indent=2)
            result["sound_opportunities_file"] = str(sound_opportunities_file)
            
            if sound_opportunities:
                print(f"Identified {len(sound_opportunities)} sound opportunities")
            else:
                print("No sound opportunities identified in the text")
        
        # Step 4: Translate the text
        print(f"Translating from {args.source_language} to {args.target_language}...")
        translated_text = audio_processor.translate_text(transcribed_text, args.target_language, openai_api_key)
        print(f"\nTranslation ({args.target_language}):\n{translated_text}\n")
        result["translation"] = translated_text
        
        # Save translation to a text file
        translation_file = job_dir / "translation.txt"
        with open(translation_file, "w", encoding="utf-8") as f:
            f.write(translated_text)
        result["translation_file"] = str(translation_file)
        
        # Step 5: Generate speech from translated text
        print("Generating speech from translation...")
        output_file = audio_processor.text_to_speech(
            translated_text, 
            args.voice, 
            str(output_path), 
            openai_api_key
        )
        print(f"Translated audio saved to: {output_file}")
        
        # Step 6: Add dynamic soundscape with fixed function
        final_audio_path = output_file
        if not args.disable_soundscape and sound_opportunities:
            print("\nCreating fixed dynamic soundscape for enhanced storytelling...")
            
            # Fetch sound effects from Freesound API
            sound_map = audio_processor.fetch_sound_effects_from_freesound(
                sound_opportunities, 
                freesound_api_key
            )
            
            # Create the enhanced audio with fixed dynamic soundscape function
            if sound_map:
                # Generate the enhanced audio using the fixed function
                enhanced_audio = audio_processor.create_dynamic_soundscape_fixed(
                    output_file, 
                    sound_opportunities, 
                    sound_map
                )
                
                # Update the result
                final_audio_path = enhanced_audio
                result["enhanced_audio"] = final_audio_path
                print(f"Successfully added sound effects to the audio!")
            else:
                print("No sound files were found for the identified opportunities")
        
        # Step 7: Generate video if requested
        if args.generate_video and openai_api_key:  # Note: Using the same OpenAI key for DALL-E
            print("\nGenerating scene visualizations from the translated text...")
            image_generator = image_generation(openai_api_key)
            
            # Create a subfolder for the images
            images_folder = job_dir / "scene_images"
            images_folder.mkdir(exist_ok=True)
            
            # Generate images based on the translated text
            scene_result = image_generator.generate_video_from_text(
                translated_text,  # Using translated text for scene extraction
                str(images_folder)
            )
            
            # Update result with image generation output
            result["scene_images"] = scene_result["image_paths"]
            result["gallery_path"] = scene_result["gallery_path"]
            
            # Add the gallery path to the README
            print(f"Scene visualization gallery created at: {scene_result['gallery_path']}")

        # Create a README file with information about the process
        readme_content = f"""# Translation Job Details

Input file: {input_path}
Creation date: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Languages
Source language: {args.source_language}
Target language: {args.target_language}

## Files
- Original audio: {input_path}
- Transcription: transcription.txt
- Translation: translation.txt
- Translated audio: {os.path.basename(output_file)}
"""
        
        if 'enhanced_audio' in result:
            readme_content += f"- Enhanced audio with soundscape: {os.path.basename(result['enhanced_audio'])}\n"
        
        if 'generated_video' in result:
            readme_content += f"- Generated video: {os.path.basename(result['generated_video'])}\n"
        
        if 'sound_opportunities_file' in result:
            readme_content += f"\n## Sound Effects\nA list of detected sound opportunities can be found in sound_opportunities.json\n"
        
        if 'historical_context' in result:
            readme_content += f"\n## Historical Context\nHistorical context information has been extracted and saved to the 'historical_context' folder.\n"
            readme_content += f"- Key points: historical_context/key_points.txt\n"
            readme_content += f"- Timeline: historical_context/historical_timeline.txt\n"
            readme_content += f"- Images folder: historical_context/images/\n"
        
        if 'enhanced_audio' in result:
            readme_content += f"\n## How to Use\nTo listen to the enhanced audio with soundscape, open the {os.path.basename(result['enhanced_audio'])} file in any media player.\n"
        
        readme_file = job_dir / "README.md"
        with open(readme_file, "w", encoding="utf-8") as f:
            f.write(readme_content)
        
        result["readme_file"] = str(readme_file)
        
        print("\n✅ Process completed successfully!")
        print(f"📂 Output folder: {result['output_folder']}")
        print(f"📝 Files created:")
        print(f"  - Transcription: {os.path.basename(result['transcription_file'])}")
        print(f"  - Translation: {os.path.basename(result['translation_file'])}")
        print(f"  - Translated audio: {os.path.basename(result['output_file'])}")
        
        if 'enhanced_audio' in result:
            print(f"  - Enhanced audio with soundscape: {os.path.basename(result['enhanced_audio'])}")
        
        if 'historical_context' in result:
            print(f"  - Historical context: {job_dir}/historical_context/")
        
        if 'generated_video' in result:
            print(f"  - Generated video: {os.path.basename(result['generated_video'])}")
        
        print(f"\n📋 A README.md file with details has been created in the output folder.")
        print(f"\n🚀 To access your files, open: {result['output_folder']}")
        
        return result
    except Exception as e:
        print(f"\n❌ Error during processing: {str(e)}")
        print("Saving partial results if possible...")
        
        # Try to save any intermediate results
        output_dir = Path("outputs/error_output")
        output_dir.mkdir(exist_ok=True, parents=True)
        
        error_log = output_dir / "error_log.txt"
        with open(error_log, "w") as f:
            f.write(f"Error occurred at {datetime.now()}\n")
            f.write(f"Input file: {input_path}\n")
            f.write(f"Error message: {str(e)}\n")
            
            import traceback
            traceback.print_exc(file=f)
        
        print(f"Error details saved to: {error_log}")
        raise
from flask import Flask, request, jsonify
import traceback

# Load environment variables (e.g., from .env)
load_dotenv()

app = Flask(__name__)

@app.route('/api/upload', methods=['POST'])
def upload():
    try:
        # Validate file presence
        if 'audio' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['audio']

        # Save the uploaded file temporarily
        temp_dir = tempfile.mkdtemp()
        input_path = Path(temp_dir) / file.filename
        file.save(str(input_path))

        # Get additional form fields (adjust the keys as needed)
        # For example, we expect 'translationLang' for target language and 'gender' for voice selection.
        target_language = request.form.get('translationLang', 'en')
        gender = request.form.get('gender', 'male')
        # You can also add more fields (e.g., source_language) as desired.
        source_language = "en"  # default source language
        # For simplicity, we map gender to a default voice.
        voice = "alloy" if gender.lower() == "male" else "shimmer"

        # For additional features, you could also pass flags from the frontend:
        disable_soundscape = request.form.get('disableSoundscape', 'false').lower() == 'true'
        disable_history = request.form.get('disableHistory', 'false').lower() == 'true'
        generate_video = request.form.get('generateVideo', 'false').lower() == 'true'

        # Get API keys from environment variables
        openai_api_key = os.environ.get("OPENAI_API_KEY")
        freesound_api_key = os.environ.get("FREESOUND_API_KEY")

        if not openai_api_key:
            return jsonify({"error": "OpenAI API key not set"}), 500

        # Call our processing pipeline function with the parameters
        result = process_audio_file(
            input_path=input_path,
            source_language=source_language,
            target_language=target_language,
            voice=voice,
            disable_soundscape=disable_soundscape,
            disable_history=disable_history,
            generate_video=generate_video,
            openai_api_key=openai_api_key,
            freesound_api_key=freesound_api_key
        )

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": str(e),
            "trace": traceback.format_exc()
        }), 500

def process_audio_file(input_path: Path,
                       source_language: str,
                       target_language: str,
                       voice: str,
                       disable_soundscape: bool,
                       disable_history: bool,
                       generate_video: bool,
                       openai_api_key: str,
                       freesound_api_key: str):
    """
    Mimics your main_fixed() processing pipeline but takes parameters from the Flask request.
    """
    # Create an instance of your audio processing class
    audio_processor = audio()

    # Create a unique output folder for the job
    job_dir = audio_processor.create_output_folder(str(input_path), source_language, target_language)
    output_path = job_dir / f"translated_audio.mp3"

    result = {
        "input_file": str(input_path),
        "output_folder": str(job_dir),
        "output_file": str(output_path),
        "source_language": source_language,
        "target_language": target_language,
        "voice": voice
    }

    # Check if the uploaded file is a video (by extension)
    file_ext = input_path.suffix.lower()
    video_formats = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv']
    audio_path = str(input_path)
    if file_ext in video_formats:
        temp_audio = os.path.join(tempfile.gettempdir(), f"{input_path.stem}.mp3")
        audio_path = audio_processor.extract_audio_from_video(str(input_path), temp_audio)
        result["extracted_audio"] = audio_path

    # Step 2: Transcribe the audio using OpenAI Whisper API
    transcribed_text = audio_processor.transcribe_audio(audio_path, openai_api_key)
    result["transcription"] = transcribed_text
    transcription_file = job_dir / "transcription.txt"
    with open(transcription_file, "w", encoding="utf-8") as f:
        f.write(transcribed_text)
    result["transcription_file"] = str(transcription_file)

    # Step 2.5: Extract historical context if not disabled
    if not disable_history:
        history_result = extract_historical_context(transcribed_text, job_dir, openai_api_key)
        result["historical_context"] = history_result

    # Step 3: Analyze text for sound effect opportunities (if enabled)
    sound_opportunities = None
    if not disable_soundscape:
        sound_opportunities = audio_processor.analyze_text_for_sounds_multilingual(
            transcribed_text,
            source_language,
            openai_api_key
        )
        sound_opportunities_file = job_dir / "sound_opportunities.json"
        with open(sound_opportunities_file, "w", encoding="utf-8") as f:
            json.dump(sound_opportunities, f, indent=2)
        result["sound_opportunities_file"] = str(sound_opportunities_file)

    # Step 4: Translate the transcribed text
    translated_text = audio_processor.translate_text(transcribed_text, target_language, openai_api_key)
    result["translation"] = translated_text
    translation_file = job_dir / "translation.txt"
    with open(translation_file, "w", encoding="utf-8") as f:
        f.write(translated_text)
    result["translation_file"] = str(translation_file)

    # Step 5: Generate speech (text-to-speech) from the translated text
    output_file = audio_processor.text_to_speech(
        translated_text,
        voice,
        str(output_path),
        openai_api_key
    )
    result["output_file"] = str(output_file)

    # Step 6: If soundscape is enabled, fetch sound effects and layer them in
    final_audio_path = output_file
    if not disable_soundscape and sound_opportunities:
        sound_map = audio_processor.fetch_sound_effects_from_freesound(
            sound_opportunities,
            freesound_api_key
        )
        if sound_map:
            enhanced_audio = audio_processor.create_dynamic_soundscape_fixed(
                output_file,
                sound_opportunities,
                sound_map
            )
            final_audio_path = enhanced_audio
            result["enhanced_audio"] = final_audio_path
    result["final_audio"] = final_audio_path

    # Step 7: Optionally, generate video from translated text (if enabled)
    if generate_video and openai_api_key:
        image_generator = image_generation(openai_api_key)
        images_folder = job_dir / "scene_images"
        images_folder.mkdir(exist_ok=True)
        scene_result = image_generator.generate_video_from_text(
            translated_text,
            str(images_folder)
        )
        result["scene_images"] = scene_result["image_paths"]
        result["gallery_path"] = scene_result["gallery_path"]

    # Optionally, create a README file with job details (simplified here)
    readme_content = (
        f"# Translation Job Details\n\n"
        f"Input file: {input_path}\n"
        f"Created on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        f"Source language: {source_language}\n"
        f"Target language: {target_language}\n"
        f"Output file: {output_file}\n"
    )
    readme_file = job_dir / "README.md"
    with open(readme_file, "w", encoding="utf-8") as f:
        f.write(readme_content)
    result["readme_file"] = str(readme_file)

    return result

if __name__ == '__main__':
    # Run the Flask server on port 5000 (adjust as needed)
    app.run(host='0.0.0.0', port=5000)  
    # This code integrates the HistoricalContextExtractor with the existing audio processing pipeline
# It will be added to the main_fixed function


