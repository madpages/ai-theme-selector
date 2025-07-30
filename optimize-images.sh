#!/bin/bash

echo "🖼️  Optimizing screenshots with ImageMagick..."
echo "=============================================="

# Create optimized directory
mkdir -p screenshots-optimized

# Counter for progress
count=0
total=$(ls screenshots/*.png | wc -l)

# Optimize each image
for img in screenshots/*.png; do
    count=$((count + 1))
    filename=$(basename "$img")
    
    echo "[$count/$total] Optimizing: $filename"
    
    # Resize to max width 600px (for web gallery) and optimize
    convert "$img" \
        -resize 600x \
        -strip \
        -quality 85 \
        -define png:compression-filter=5 \
        -define png:compression-level=9 \
        -define png:compression-strategy=1 \
        "screenshots-optimized/$filename"
done

echo ""
echo "✅ All images optimized!"
echo "📁 Optimized images saved to: screenshots-optimized/"
echo ""

# Show size comparison
original_size=$(du -sh screenshots/ | cut -f1)
optimized_size=$(du -sh screenshots-optimized/ | cut -f1)

echo "📊 Size comparison:"
echo "   Original:  $original_size"
echo "   Optimized: $optimized_size"
