'use server';

import { createCanvas, loadImage } from '@napi-rs/canvas';

// K-means clustering implementation
function kMeans(pixels: number[][], k: number, maxIterations = 20): number[][] {
  // Randomly initialize centroids from the pixels
  let centroids = pixels.slice(0, k);
  let labels = new Array(pixels.length).fill(0);
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign points to nearest centroid
    let newLabels = pixels.map((pixel, i) => {
      let minDist = Infinity;
      let label = 0;
      centroids.forEach((centroid, j) => {
        const dist = Math.sqrt(
          Math.pow(pixel[0] - centroid[0], 2) +
          Math.pow(pixel[1] - centroid[1], 2) +
          Math.pow(pixel[2] - centroid[2], 2)
        );
        if (dist < minDist) {
          minDist = dist;
          label = j;
        }
      });
      return label;
    });

    // Check for convergence
    if (labels.every((label, i) => label === newLabels[i])) {
      break;
    }
    labels = newLabels;

    // Update centroids
    centroids = centroids.map((_, i) => {
      const cluster = pixels.filter((_, j) => labels[j] === i);
      if (cluster.length === 0) return centroids[i];
      return cluster.reduce((acc, pixel) => [
        acc[0] + pixel[0] / cluster.length,
        acc[1] + pixel[1] / cluster.length,
        acc[2] + pixel[2] / cluster.length
      ], [0, 0, 0]);
    });
  }

  // Sort centroids by cluster size and color intensity
  const clusterSizes = labels.reduce((acc, label) => {
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return centroids
    .map((centroid, i) => ({
      color: centroid.map(Math.round),
      size: clusterSizes[i] || 0,
      intensity: Math.sqrt(centroid[0]**2 + centroid[1]**2 + centroid[2]**2)
    }))
    .sort((a, b) => b.size * b.intensity - a.size * a.intensity)
    .map(c => c.color);
}

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
    
    // Sample pixels (reduce data size for performance)
    const sampledPixels: number[][] = [];
    for (let i = 0; i < pixels.length; i += 320) {  // Sample every 80th pixel
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Convert to HSL to filter out very dark/light colors
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 510;
      
      // Only include colors with reasonable lightness
      if (l > 0.1 && l < 0.9) {
        sampledPixels.push([r, g, b]);
      }
    }

    if (sampledPixels.length < 5) return defaultColors;

    // Use k-means clustering to find dominant colors
    const dominantColors = kMeans(sampledPixels, 5);

    // Apply slight saturation and brightness boost
    const enhancedColors = dominantColors.map(color => {
      // Convert to HSL
      const [r, g, b] = color;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;
      const d = max - min;
      const s = max === 0 ? 0 : d / max;

      // Boost saturation and brightness slightly
      const newS = Math.min(1, s * 1.2);
      const newL = Math.min(255, l * 1.1);

      // Simple RGB boost (for demonstration - a proper HSL->RGB conversion would be better)
      return color.map(c => Math.round(Math.min(255, c * 1.1)));
    });

    // Return exactly 5 colors
    return enhancedColors.map(color => `rgb(${color.join(',')})`) as [string, string, string, string, string];
    
  } catch (error) {
    console.error('Error extracting colors:', error);
    return null;
  }
}