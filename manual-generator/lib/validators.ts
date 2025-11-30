// Validation utilities for form inputs and data

import { VALIDATION, UI_TEXT } from './constants';
import { ProjectDimensions } from './types';

/**
 * Validation result type
 */
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validate project dimensions
 */
export function validateDimensions(dimensions: ProjectDimensions): ValidationResult {
    const { frente, fondo, altura } = dimensions;

    // Check if all values are numbers
    if (isNaN(frente) || isNaN(fondo) || isNaN(altura)) {
        return {
            isValid: false,
            error: 'Todas las dimensiones deben ser números válidos',
        };
    }

    // Check minimum values
    if (frente < VALIDATION.dimensions.min || fondo < VALIDATION.dimensions.min || altura < VALIDATION.dimensions.min) {
        return {
            isValid: false,
            error: UI_TEXT.errors.dimensionMin,
        };
    }

    // Check maximum values
    if (frente > VALIDATION.dimensions.max || fondo > VALIDATION.dimensions.max || altura > VALIDATION.dimensions.max) {
        return {
            isValid: false,
            error: UI_TEXT.errors.dimensionMax,
        };
    }

    return { isValid: true };
}

/**
 * Validate project name
 */
export function validateProjectName(name: string): ValidationResult {
    const trimmed = name.trim();

    if (trimmed.length < VALIDATION.projectName.minLength) {
        return {
            isValid: false,
            error: UI_TEXT.errors.projectNameShort,
        };
    }

    if (trimmed.length > VALIDATION.projectName.maxLength) {
        return {
            isValid: false,
            error: UI_TEXT.errors.projectNameLong,
        };
    }

    return { isValid: true };
}

/**
 * Validate project description
 */
export function validateDescription(description: string): ValidationResult {
    const trimmed = description.trim();

    if (trimmed.length < VALIDATION.description.minLength) {
        return {
            isValid: false,
            error: UI_TEXT.errors.descriptionShort,
        };
    }

    if (trimmed.length > VALIDATION.description.maxLength) {
        return {
            isValid: false,
            error: UI_TEXT.errors.descriptionLong,
        };
    }

    return { isValid: true };
}

/**
 * Validate specifications text
 */
export function validateSpecifications(specs: string): ValidationResult {
    if (specs.length > VALIDATION.specifications.maxLength) {
        return {
            isValid: false,
            error: `Las especificaciones no pueden exceder ${VALIDATION.specifications.maxLength} caracteres`,
        };
    }

    return { isValid: true };
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSize: number): ValidationResult {
    if (file.size > maxSize) {
        return {
            isValid: false,
            error: `El archivo ${file.name} es demasiado grande`,
        };
    }

    return { isValid: true };
}

/**
 * Validate file type
 */
export function validateFileType(file: File, acceptedTypes: string[]): ValidationResult {
    if (!acceptedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: `El archivo ${file.name} no es un formato válido`,
        };
    }

    return { isValid: true };
}

/**
 * Validate that at least one image is provided
 */
export function validateHasImages(images: File[]): ValidationResult {
    if (images.length === 0) {
        return {
            isValid: false,
            error: UI_TEXT.errors.noImages,
        };
    }

    return { isValid: true };
}

/**
 * Comprehensive form validation
 */
export interface FormData {
    imagenes: File[];
    dimensiones: ProjectDimensions;
    especificaciones: string;
}

export interface FormValidationResult {
    isValid: boolean;
    errors: {
        images?: string;
        dimensions?: string;
        specifications?: string;
    };
}

export function validateForm(data: FormData): FormValidationResult {
    const errors: FormValidationResult['errors'] = {};

    // Validate images
    const imagesResult = validateHasImages(data.imagenes);
    if (!imagesResult.isValid) {
        errors.images = imagesResult.error;
    }

    // Validate dimensions
    const dimensionsResult = validateDimensions(data.dimensiones);
    if (!dimensionsResult.isValid) {
        errors.dimensions = dimensionsResult.error;
    }

    // Validate specifications
    const specsResult = validateSpecifications(data.especificaciones);
    if (!specsResult.isValid) {
        errors.specifications = specsResult.error;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}
