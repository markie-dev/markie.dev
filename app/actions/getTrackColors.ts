'use server';

import { createCanvas, loadImage } from '@napi-rs/canvas';

export async function getTrackColors(imageUrl: string) {
  if (!imageUrl) return null;

  const defaultColors: [string, string, string, string, string] = [
    'rgb(58, 58, 58)',
    'rgb(78, 78, 78)',
    'rgb(98, 98, 98)',
    'rgb(118, 118, 118)',
    'rgb(138, 138, 138)'
  ];

  try {
    // Ensure the URL is absolute
    const fullUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : new URL(imageUrl, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString();
    
    const response = await fetch(fullUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const image = await loadImage(buffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    const colors: number[][] = [];
    
    // Sample pixels at regular intervals
    for (let i = 0; i < pixels.length; i += 80) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Calculate HSL values
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 510;  // Lightness
      const s = max === 0 ? 0 : (max - min) / max;  // Saturation
      
      // Only collect vibrant colors (high saturation, moderate lightness)
      if (s > 0.3 && l > 0.2 && l < 0.8) {
        colors.push([r, g, b]);
      }
    }

    // Sort colors by vibrancy (saturation * brightness)
    colors.sort((a, b) => {
      const vibrancyA = Math.max(...a) * (Math.max(...a) - Math.min(...a)) / 255;
      const vibrancyB = Math.max(...b) * (Math.max(...b) - Math.min(...b)) / 255;
      return vibrancyB - vibrancyA;
    });

    if (colors.length < 5) return defaultColors;

    // Get 5 distinct colors by taking every Nth color from the sorted array
    const step = Math.floor(colors.length / 5);
    const selectedColors = [0, 1, 2, 3, 4].map(i => 
      colors[Math.min(i * step, colors.length - 1)]
        .map(c => Math.round(Math.min(255, c * 1.1))) // Slight brightness boost
    );

    // Return exactly 5 colors with the correct type
    return selectedColors.map(color => `rgb(${color.join(',')})`) as [string, string, string, string, string];
    
  } catch (error) {
    console.error('Error extracting colors:', error);
    return null;
  }
}