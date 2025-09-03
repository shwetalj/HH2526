#!/usr/bin/env python3

import os
from PIL import Image
import shutil

def convert_to_webp(input_path, quality=85, max_width=None):
    """Convert PNG to WebP for better compression."""
    try:
        webp_path = input_path.replace('.png', '.webp')
        
        # Open image
        img = Image.open(input_path)
        
        # Resize if needed
        if max_width and img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            print(f"  Resized to {max_width}x{new_height}")
        
        # Save as WebP
        img.save(webp_path, 'WEBP', quality=quality, method=6)
        
        # Compare sizes
        png_size = os.path.getsize(input_path)
        webp_size = os.path.getsize(webp_path)
        reduction = (1 - webp_size/png_size) * 100
        
        print(f"  PNG: {png_size/1024:.1f}KB -> WebP: {webp_size/1024:.1f}KB ({reduction:.1f}% reduction)")
        
        return webp_path
        
    except Exception as e:
        print(f"  Error converting {input_path}: {e}")
        return None

def main():
    base_dir = "/home/sjoshi/claudelab/fll"
    
    print("=" * 60)
    print("WEBP CONVERSION FOR BETTER COMPRESSION")
    print("=" * 60)
    
    # Convert main field image
    print("\n1. Converting main field image to WebP...")
    field_image = os.path.join(base_dir, "images", "FLL_Unearthed_SETUP.png")
    if os.path.exists(field_image):
        convert_to_webp(field_image, quality=90, max_width=2000)
    
    # Convert mission cards
    print("\n2. Converting mission cards to WebP...")
    mission_cards_dir = os.path.join(base_dir, "mission_cards")
    if os.path.exists(mission_cards_dir):
        for filename in os.listdir(mission_cards_dir):
            if filename.endswith('.png') and not filename.endswith('.backup'):
                print(f"\nProcessing {filename}:")
                input_path = os.path.join(mission_cards_dir, filename)
                convert_to_webp(input_path, quality=85, max_width=600)
    
    print("\n" + "=" * 60)
    print("CONVERSION COMPLETE!")
    print("=" * 60)
    print("\nWebP files created alongside PNG files")
    print("Update HTML to use .webp instead of .png for better performance")

if __name__ == "__main__":
    main()