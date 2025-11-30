// Custom hook for managing image previews with optimized memory handling

import { useState, useCallback, useEffect } from 'react';
import { IMAGE_CONFIG, UI_TEXT } from '@/lib/constants';

interface ImagePreview {
    file: File;
    preview: string;
    id: string;
}

interface UseImagePreviewReturn {
    images: ImagePreview[];
    previews: string[];
    addImages: (files: FileList | File[]) => Promise<{ success: boolean; errors: string[] }>;
    removeImage: (id: string) => void;
    clearImages: () => void;
    isValidating: boolean;
}

/**
 * Custom hook for managing image file previews with validation and memory cleanup
 * 
 * Features:
 * - Automatic URL cleanup to prevent memory leaks
 * - File size and format validation
 * - Support for multiple images
 * - Error handling and reporting
 * 
 * @returns Object with image state and management functions
 */
export function useImagePreview(): UseImagePreviewReturn {
    const [images, setImages] = useState<ImagePreview[]>([]);
    const [isValidating, setIsValidating] = useState(false);

    // Cleanup function to revoke object URLs
    useEffect(() => {
        return () => {
            images.forEach(img => {
                if (img.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(img.preview);
                }
            });
        };
    }, [images]);

    /**
     * Validate a single file
     */
    const validateFile = useCallback((file: File): string | null => {
        // Check file size
        if (file.size > IMAGE_CONFIG.maxFileSize) {
            return UI_TEXT.errors.imageSize;
        }

        // Check file format - use type assertion to satisfy TypeScript
        const acceptedFormats: readonly string[] = IMAGE_CONFIG.acceptedFormats;
        if (!acceptedFormats.includes(file.type)) {
            return UI_TEXT.errors.imageFormat;
        }

        return null;
    }, []);

    /**
     * Add new images with validation
     */
    const addImages = useCallback(async (files: FileList | File[]): Promise<{ success: boolean; errors: string[] }> => {
        setIsValidating(true);
        const fileArray = Array.from(files);
        const errors: string[] = [];
        const newImages: ImagePreview[] = [];

        for (const file of fileArray) {
            const error = validateFile(file);

            if (error) {
                errors.push(`${file.name}: ${error}`);
                continue;
            }

            try {
                // Create preview URL
                const preview = await createPreview(file);

                newImages.push({
                    file,
                    preview,
                    id: `${file.name}-${Date.now()}-${Math.random()}`,
                });
            } catch (err) {
                errors.push(`${file.name}: Error al crear vista previa`);
            }
        }

        if (newImages.length > 0) {
            setImages(prev => [...prev, ...newImages]);
        }

        setIsValidating(false);
        return {
            success: newImages.length > 0,
            errors,
        };
    }, [validateFile]);

    /**
     * Remove an image by ID
     */
    const removeImage = useCallback((id: string) => {
        setImages(prev => {
            const imageToRemove = prev.find(img => img.id === id);

            // Cleanup object URL
            if (imageToRemove && imageToRemove.preview.startsWith('blob:')) {
                URL.revokeObjectURL(imageToRemove.preview);
            }

            return prev.filter(img => img.id !== id);
        });
    }, []);

    /**
     * Clear all images
     */
    const clearImages = useCallback(() => {
        // Cleanup all object URLs
        images.forEach(img => {
            if (img.preview.startsWith('blob:')) {
                URL.revokeObjectURL(img.preview);
            }
        });

        setImages([]);
    }, [images]);

    // Extract preview URLs for easy access
    const previews = images.map(img => img.preview);

    return {
        images,
        previews,
        addImages,
        removeImage,
        clearImages,
        isValidating,
    };
}

/**
 * Create a preview URL from a file
 */
function createPreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        // For PDFs, use a placeholder or the file URL
        if (file.type === 'application/pdf') {
            resolve(URL.createObjectURL(file));
            return;
        }

        // For images, create a data URL
        const reader = new FileReader();

        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read file'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
}
