import os
import argparse
import openai
from pathlib import Path
from dotenv import load_dotenv

def transcribe_audio(file_path, api_key):
    """
    Transcribe an audio file using OpenAI's Whisper API.
    
    Args:
        file_path (str): Path to the audio file
        api_key (str): OpenAI API key
        
    Returns:
        str: Transcribed text
    """
    client = openai.OpenAI(api_key=api_key)
    
    with open(file_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )
    
    return transcription.text

def translate_text(text, target_language, api_key):
    """
    Translate text using OpenAI's GPT model.
    
    Args:
        text (str): Text to translate
        target_language (str): Target language for translation
        api_key (str): OpenAI API key
        
    Returns:
        str: Translated text
    """
    client = openai.OpenAI(api_key=api_key)
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"You are a translator. Translate the following text into {target_language}."},
            {"role": "user", "content": text}
        ]
    )
    
    return response.choices[0].message.content

def main():
    # Load environment variables from .env file
    load_dotenv()
    
    parser = argparse.ArgumentParser(description='Transcribe and translate audio files')
    parser.add_argument('--file', type=str, help='Path to the audio file (defaults to voice.mp3 in the current directory)')
    parser.add_argument('--language', type=str, default='Spanish', help='Target language for translation')
    parser.add_argument('--api_key', type=str, help='OpenAI API key (overrides .env file)')
    
    args = parser.parse_args()
    
    # Get API key with priority: 1) command line argument, 2) .env file, 3) environment variable
    api_key = args.api_key or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OpenAI API key is required. Provide it via --api_key argument, OPENAI_API_KEY in .env file, or set OPENAI_API_KEY environment variable.")
    
    # Use default file path if not specified
    file_path = Path(args.file) if args.file else Path("voice.mp3")
    
    # Check if file exists
    if not file_path.exists():
        raise FileNotFoundError(f"Audio file not found: {file_path}")
    
    print(f"Processing audio file: {file_path}")
    
    # Step 1: Transcribe the audio
    print("Transcribing audio...")
    transcribed_text = transcribe_audio(file_path, api_key)
    print(f"\nTranscription:\n{transcribed_text}\n")
    
    # Step 2: Translate the text
    print(f"Translating to {args.language}...")
    translated_text = translate_text(transcribed_text, args.language, api_key)
    print(f"\nTranslation ({args.language}):\n{translated_text}\n")
    
    # Save results to files
    file_stem = file_path.stem
    
    with open(f"{file_stem}_transcription.txt", "w", encoding="utf-8") as f:
        f.write(transcribed_text)
    
    with open(f"{file_stem}_translation_{args.language}.txt", "w", encoding="utf-8") as f:
        f.write(translated_text)
    
    print(f"Results saved to {file_stem}_transcription.txt and {file_stem}_translation_{args.language}.txt")

if __name__ == "__main__":
    main()