/**
 * Client-side Browser-native Image Compression Utility
 * Resizes high-resolution photos (e.g. 5-10MB phone camera shots) to max 1600px width/height
 * and compresses to high-quality JPEG (~200-450KB) using standard HTML5 Canvas.
 * No external dependencies or paid APIs required.
 */

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
  width: number;
  height: number;
}

/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * @param file The input File from an <input type="file">
 * @param maxWidth Max width/height dimension (default: 1600px)
 * @param quality JPEG quality 0.0 - 1.0 (default: 0.82)
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1600,
  maxHeight: number = 1600,
  quality: number = 0.82
): Promise<CompressionResult> {
  const originalSize = file.size;

  // If the file is not an image (e.g. svg or invalid), return original
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      reductionPercentage: 0,
      width: 0,
      height: 0,
    };
  }

  return new Promise<CompressionResult>((resolve) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate new dimensions while preserving aspect ratio
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              // Width constrained
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              // Height constrained
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) {
            // Fallback to original file if 2d context is unavailable
            resolve({
              file,
              originalSize,
              compressedSize: originalSize,
              reductionPercentage: 0,
              width: img.width,
              height: img.height,
            });
            return;
          }

          // Enable high-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Fill white background in case of transparency converting to jpeg
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Draw scaled image
          ctx.drawImage(img, 0, 0, width, height);

          // Output to JPEG blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve({
                  file,
                  originalSize,
                  compressedSize: originalSize,
                  reductionPercentage: 0,
                  width,
                  height,
                });
                return;
              }

              // Create a new File object with a clean name and .jpg extension
              const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
              const compressedFile = new File([blob], `${baseName}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });

              const compressedSize = compressedFile.size;
              const reductionPercentage = Math.max(
                0,
                Math.round(((originalSize - compressedSize) / originalSize) * 100)
              );

              resolve({
                file: compressedFile,
                originalSize,
                compressedSize,
                reductionPercentage,
                width,
                height,
              });
            },
            'image/jpeg',
            quality
          );
        } catch (canvasErr) {
          console.warn('Canvas image compression failed, falling back to original file:', canvasErr);
          resolve({
            file,
            originalSize,
            compressedSize: originalSize,
            reductionPercentage: 0,
            width: img.width,
            height: img.height,
          });
        }
      };

      img.onerror = () => {
        console.warn('Image load error during compression, using original file');
        resolve({
          file,
          originalSize,
          compressedSize: originalSize,
          reductionPercentage: 0,
          width: 0,
          height: 0,
        });
      };

      if (typeof readerEvent.target?.result === 'string') {
        img.src = readerEvent.target.result;
      } else {
        resolve({
          file,
          originalSize,
          compressedSize: originalSize,
          reductionPercentage: 0,
          width: 0,
          height: 0,
        });
      }
    };

    reader.onerror = () => {
      resolve({
        file,
        originalSize,
        compressedSize: originalSize,
        reductionPercentage: 0,
        width: 0,
        height: 0,
      });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to readable string (e.g. "3.4 MB", "420 KB")
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
