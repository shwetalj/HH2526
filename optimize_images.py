#!/usr/bin/env python3

import os
from PIL import Image
import shutil

def optimize_image(input_path, output_path, quality=85, max_width=None):
    """Optimize a single image."""
    try:
        # Create backup
        backup_path = input_path + '.backup'
        if not os.path.exists(backup_path):
            shutil.copy2(input_path, backup_path)
            print(f"  Created backup: {backup_path}")
        
        # Open and convert image
        img = Image.open(input_path)
        
        # Convert RGBA to RGB if needed (for better compression)
        if img.mode == 'RGBA':
            # Create a white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize if needed
        if max_width and img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            print(f"  Resized to {max_width}x{new_height}")
        
        # Get original size
        original_size = os.path.getsize(input_path)
        
        # Save optimized image
        img.save(output_path, 'PNG', optimize=True, quality=quality)
        
        # Get new size
        new_size = os.path.getsize(output_path)
        
        # Calculate reduction
        reduction = (1 - new_size/original_size) * 100
        
        print(f"  Original: {original_size/1024:.1f}KB -> New: {new_size/1024:.1f}KB ({reduction:.1f}% reduction)")
        
        return True
        
    except Exception as e:
        print(f"  Error optimizing {input_path}: {e}")
        return False

def optimize_directory(directory, quality=85, max_width=None):
    """Optimize all PNG images in a directory."""
    print(f"\nOptimizing images in {directory}...")
    
    if not os.path.exists(directory):
        print(f"  Directory not found: {directory}")
        return
    
    png_files = [f for f in os.listdir(directory) if f.endswith('.png') and not f.endswith('.backup')]
    
    if not png_files:
        print(f"  No PNG files found in {directory}")
        return
    
    for filename in png_files:
        print(f"\nProcessing {filename}:")
        input_path = os.path.join(directory, filename)
        optimize_image(input_path, input_path, quality, max_width)

def main():
    base_dir = "/home/sjoshi/claudelab/fll"
    
    print("=" * 60)
    print("IMAGE OPTIMIZATION SCRIPT")
    print("=" * 60)
    
    # Optimize main game field image (keep high quality, but optimize)
    print("\n1. Optimizing main game field image...")
    field_image = os.path.join(base_dir, "images", "FLL_Unearthed_SETUP.png")
    if os.path.exists(field_image):
        optimize_image(field_image, field_image, quality=90, max_width=2000)
    
    # Optimize mission cards (medium quality, smaller size for hover display)
    print("\n2. Optimizing mission cards...")
    optimize_directory(os.path.join(base_dir, "mission_cards"), quality=80, max_width=800)
    
    # Optimize mission images (can be lower quality, not directly displayed)
    print("\n3. Optimizing mission images...")
    optimize_directory(os.path.join(base_dir, "mission_images"), quality=75, max_width=1200)
    
    print("\n" + "=" * 60)
    print("OPTIMIZATION COMPLETE!")
    print("=" * 60)
    print("\nBackup files created with .backup extension")
    print("To restore originals: rename .backup files back to .png")

if __name__ == "__main__":
    main()