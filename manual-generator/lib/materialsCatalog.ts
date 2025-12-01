// Catálogo de materiales predefinidos con clasificación automática
export const MATERIALS_CATALOG = {
    Madera: [
        'MDF 3mm', 'MDF 6mm', 'MDF 9mm', 'MDF 12mm', 'MDF 15mm', 'MDF 18mm',
        'Triplay 6mm', 'Triplay 9mm', 'Triplay 12mm', 'Triplay 15mm',
        'Aglomerado 15mm', 'Aglomerado 18mm',
        'Melamina Blanca 15mm', 'Melamina Blanca 18mm',
        'Melamina Nogal 15mm', 'Melamina Nogal 18mm',
        'Madera Pino', 'Madera Cedro', 'OSB 9mm', 'OSB 12mm'
    ],
    Metal: [
        'Aluminio Perfil 1"', 'Aluminio Perfil 2"',
        'Aluminio Lámina Cal. 18', 'Aluminio Lámina Cal. 20',
        'Acero Inoxidable Cal. 18', 'Acero Inoxidable Cal. 20',
        'Acero al Carbón Cal. 18', 'Acero al Carbón Cal. 20',
        'Tubo Cuadrado 1"', 'Tubo Cuadrado 2"',
        'Ángulo 1"', 'Ángulo 2"', 'PTR 1"', 'PTR 2"'
    ],
    Iluminacion: [
        'Tira LED Blanco Frío 5m', 'Tira LED Blanco Cálido 5m', 'Tira LED RGB 5m',
        'Foco LED 9W', 'Foco LED 12W', 'Foco LED 15W',
        'Panel LED 60x60cm', 'Reflector LED 50W', 'Reflector LED 100W',
        'Transformador 12V 5A', 'Transformador 12V 10A'
    ],
    Acabados: [
        'Pintura Vinílica Blanca', 'Pintura Vinílica Color',
        'Pintura Esmalte Blanco', 'Pintura Esmalte Color',
        'Barniz Transparente', 'Barniz Mate', 'Laca Automotriz',
        'Fondo Blanco', 'Sellador', 'Thinner',
        'Lija Grano 80', 'Lija Grano 120', 'Lija Grano 220'
    ],
    Vidrio: [
        'Cristal Templado 6mm', 'Cristal Templado 8mm', 'Cristal Templado 10mm',
        'Acrílico Transparente 3mm', 'Acrílico Transparente 6mm',
        'Acrílico Blanco 3mm', 'Acrílico Blanco 6mm',
        'Policarbonato 4mm', 'Policarbonato 6mm'
    ],
    Adhesivos: [
        'Pegamento Blanco 1L', 'Pegamento Blanco 4L',
        'Pegamento Contacto 1L', 'Pegamento Contacto 4L',
        'Silicón Transparente', 'Silicón Blanco',
        'Cinta Doble Cara 19mm', 'Cinta Doble Cara 50mm',
        'Cinta Cantera', 'Cinta Masking'
    ],
    Tornilleria: [
        'Tornillo Madera 1" (100 pzas)', 'Tornillo Madera 1.5" (100 pzas)', 'Tornillo Madera 2" (100 pzas)',
        'Tornillo Drywall 1" (100 pzas)', 'Tornillo Drywall 1.5" (100 pzas)',
        'Pija 1/4" x 1" (50 pzas)', 'Pija 1/4" x 2" (50 pzas)',
        'Taquete Plástico #8 (100 pzas)', 'Taquete Plástico #10 (100 pzas)',
        'Bisagra 2"', 'Bisagra 3"', 'Corredera 12"', 'Corredera 16"'
    ],
    Textiles: [
        'Lona Impresa m²', 'Vinil Adhesivo m²', 'Tela Tensada m²',
        'Alfombra Ferial m²', 'Tapiz m²'
    ],
    Electricos: [
        'Cable Calibre 12 AWG', 'Cable Calibre 14 AWG',
        'Contacto Doble', 'Apagador Sencillo', 'Caja Chalupa',
        'Multicontacto 4 Salidas', 'Extensión 5m', 'Canaleta 20x10mm'
    ]
};

// Función para obtener el tipo basado en el material seleccionado
export function getMaterialType(materialName: string): string {
    for (const [tipo, materiales] of Object.entries(MATERIALS_CATALOG)) {
        if (materiales.includes(materialName)) {
            return tipo;
        }
    }
    return 'Otro';
}

// Función para obtener todos los materiales en una lista plana
export function getAllMaterials(): string[] {
    return Object.values(MATERIALS_CATALOG).flat();
}

// Función para buscar materiales
export function searchMaterials(query: string): string[] {
    const allMaterials = getAllMaterials();
    const lowerQuery = query.toLowerCase();
    return allMaterials.filter(material =>
        material.toLowerCase().includes(lowerQuery)
    );
}

// Información detallada de materiales con unidades estándar y precios
export interface MaterialInfo {
    nombre: string;
    categoria: string;
    unidadVenta: string;        // "placa", "barra", "rollo", "litro", "caja", "pieza"
    cantidadPorUnidad: number;  // Cantidad que viene en 1 unidad de venta
    unidadMedida: string;       // "m²", "ml", "m", "L", "pzas"
    precioPorUnidad: number;    // Precio de 1 unidad de venta (MXN)
}

export const MATERIALS_INFO: Record<string, MaterialInfo> = {
    // MADERA - 1 placa = 2.44m × 1.22m = 2.9768 m²
    'MDF 3mm': { nombre: 'MDF 3mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 450 },
    'MDF 6mm': { nombre: 'MDF 6mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 550 },
    'MDF 9mm': { nombre: 'MDF 9mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 650 },
    'MDF 12mm': { nombre: 'MDF 12mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 750 },
    'MDF 15mm': { nombre: 'MDF 15mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 850 },
    'MDF 18mm': { nombre: 'MDF 18mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 950 },
    'Triplay 6mm': { nombre: 'Triplay 6mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 600 },
    'Triplay 9mm': { nombre: 'Triplay 9mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 750 },
    'Triplay 12mm': { nombre: 'Triplay 12mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 900 },
    'Triplay 15mm': { nombre: 'Triplay 15mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 1050 },
    'Aglomerado 15mm': { nombre: 'Aglomerado 15mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 400 },
    'Aglomerado 18mm': { nombre: 'Aglomerado 18mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 450 },
    'Melamina Blanca 15mm': { nombre: 'Melamina Blanca 15mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 1100 },
    'Melamina Blanca 18mm': { nombre: 'Melamina Blanca 18mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 1200 },
    'Melamina Nogal 15mm': { nombre: 'Melamina Nogal 15mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 1150 },
    'Melamina Nogal 18mm': { nombre: 'Melamina Nogal 18mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 1250 },
    'Madera Pino': { nombre: 'Madera Pino', categoria: 'Madera', unidadVenta: 'tabla', cantidadPorUnidad: 2.4, unidadMedida: 'ml', precioPorUnidad: 180 },
    'Madera Cedro': { nombre: 'Madera Cedro', categoria: 'Madera', unidadVenta: 'tabla', cantidadPorUnidad: 2.4, unidadMedida: 'ml', precioPorUnidad: 320 },
    'OSB 9mm': { nombre: 'OSB 9mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 500 },
    'OSB 12mm': { nombre: 'OSB 12mm', categoria: 'Madera', unidadVenta: 'placa', cantidadPorUnidad: 2.9768, unidadMedida: 'm²', precioPorUnidad: 600 },

    // METAL - 1 barra = 6 metros lineales
    'Aluminio Perfil 1"': { nombre: 'Aluminio Perfil 1"', categoria: 'Metal', unidadVenta: 'barra', cantidadPorUnidad: 6, unidadMedida: 'ml', precioPorUnidad: 380 },
    'Aluminio Perfil 2"': { nombre: 'Aluminio Perfil 2"', categoria: 'Metal', unidadVenta: 'barra', cantidadPorUnidad: 6, unidadMedida: 'ml', precioPorUnidad: 580 },
    'Aluminio Lámina Cal. 18': { nombre: 'Aluminio Lámina Cal. 18', categoria: 'Metal', unidadVenta: 'placa', cantidadPorUnidad: 2.44, unidadMedida: 'm²', precioPorUnidad: 1200 },
    'Aluminio Lámina Cal. 20': { nombre: 'Aluminio Lámina Cal. 20', categoria: 'Metal', unidadVenta: 'placa', cantidadPorUnidad: 2.44, unidadMedida: 'm²', precioPorUnidad: 1100 },
    'Acero Inoxidable Cal. 18': { nombre: 'Acero Inoxidable Cal. 18', categoria: 'Metal', unidadVenta: 'placa', cantidadPorUnidad: 2.44, unidadMedida: 'm²', precioPorUnidad: 2500 },
    'Acero Inoxidable Cal. 20': { nombre: 'Acero Inoxidable Cal. 20', categoria: 'Metal', unidadVenta: 'placa', cantidadPorUnidad: 2.44, unidadMedida: 'm²', precioPorUnidad: 2300 },
    'Acero al Carbón Cal. 18': { nombre: 'Acero al Carbón Cal. 18', categoria: 'Metal', unidadVenta: 'placa', cantidadPorUnidad: 2.44, unidadMedida: 'm²', precioPorUnidad: 800 },
    'Acero al Carbón Cal. 20': { nombre: 'Acero al Carbón Cal. 20', categoria: 'Metal', unidadVenta: 'placa', cantidadPorUnidad: 2.44, unidadMedida: 'm²', precioPorUnidad: 750 },
    'Tubo Cuadrado 1"': { nombre: 'Tubo Cuadrado 1"', categoria: 'Metal', unidadVenta: 'barra', cantidadPorUnidad: 6, unidadMedida: 'ml', precioPorUnidad: 280 },
    'Tubo Cuadrado 2"': { nombre: 'Tubo Cuadrado 2"', categoria: 'Metal', unidadVenta: 'barra', cantidadPorUnidad: 6, unidadMedida: 'ml', precioPorUnidad: 450 },
    'Ángulo 1"': { nombre: 'Ángulo 1"', categoria: 'Metal', unidadVenta: 'barra', cantidadPorUnidad: 6, unidadMedida: 'ml', precioPorUnidad: 220 },
    'Ángulo 2"': { nombre: 'Ángulo 2"', categoria: 'Metal', unidadVenta: 'barra', cantidadPorUnidad: 6, unidadMedida: 'ml', precioPorUnidad: 380 },
    'PTR 1"': { nombre: 'PTR 1"', categoria: 'Metal', unidadVenta: 'barra', cantidadPorUnidad: 6, unidadMedida: 'ml', precioPorUnidad: 300 },
    'PTR 2"': { nombre: 'PTR 2"', categoria: 'Metal', unidadVenta: 'barra', cantidadPorUnidad: 6, unidadMedida: 'ml', precioPorUnidad: 480 },

    // ILUMINACION
    'Tira LED Blanco Frío 5m': { nombre: 'Tira LED Blanco Frío 5m', categoria: 'Iluminacion', unidadVenta: 'rollo', cantidadPorUnidad: 5, unidadMedida: 'm', precioPorUnidad: 350 },
    'Tira LED Blanco Cálido 5m': { nombre: 'Tira LED Blanco Cálido 5m', categoria: 'Iluminacion', unidadVenta: 'rollo', cantidadPorUnidad: 5, unidadMedida: 'm', precioPorUnidad: 350 },
    'Tira LED RGB 5m': { nombre: 'Tira LED RGB 5m', categoria: 'Iluminacion', unidadVenta: 'rollo', cantidadPorUnidad: 5, unidadMedida: 'm', precioPorUnidad: 450 },
    'Foco LED 9W': { nombre: 'Foco LED 9W', categoria: 'Iluminacion', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 45 },
    'Foco LED 12W': { nombre: 'Foco LED 12W', categoria: 'Iluminacion', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 55 },
    'Foco LED 15W': { nombre: 'Foco LED 15W', categoria: 'Iluminacion', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 65 },
    'Panel LED 60x60cm': { nombre: 'Panel LED 60x60cm', categoria: 'Iluminacion', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 380 },
    'Reflector LED 50W': { nombre: 'Reflector LED 50W', categoria: 'Iluminacion', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 280 },
    'Reflector LED 100W': { nombre: 'Reflector LED 100W', categoria: 'Iluminacion', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 450 },
    'Transformador 12V 5A': { nombre: 'Transformador 12V 5A', categoria: 'Iluminacion', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 180 },
    'Transformador 12V 10A': { nombre: 'Transformador 12V 10A', categoria: 'Iluminacion', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 280 },

    // ACABADOS
    'Pintura Vinílica Blanca': { nombre: 'Pintura Vinílica Blanca', categoria: 'Acabados', unidadVenta: 'cubeta', cantidadPorUnidad: 4, unidadMedida: 'litro', precioPorUnidad: 320 },
    'Pintura Vinílica Color': { nombre: 'Pintura Vinílica Color', categoria: 'Acabados', unidadVenta: 'cubeta', cantidadPorUnidad: 4, unidadMedida: 'litro', precioPorUnidad: 380 },
    'Pintura Esmalte Blanco': { nombre: 'Pintura Esmalte Blanco', categoria: 'Acabados', unidadVenta: 'litro', cantidadPorUnidad: 1, unidadMedida: 'litro', precioPorUnidad: 150 },
    'Pintura Esmalte Color': { nombre: 'Pintura Esmalte Color', categoria: 'Acabados', unidadVenta: 'litro', cantidadPorUnidad: 1, unidadMedida: 'litro', precioPorUnidad: 180 },
    'Barniz Transparente': { nombre: 'Barniz Transparente', categoria: 'Acabados', unidadVenta: 'litro', cantidadPorUnidad: 1, unidadMedida: 'litro', precioPorUnidad: 160 },
    'Barniz Mate': { nombre: 'Barniz Mate', categoria: 'Acabados', unidadVenta: 'litro', cantidadPorUnidad: 1, unidadMedida: 'litro', precioPorUnidad: 170 },
    'Laca Automotriz': { nombre: 'Laca Automotriz', categoria: 'Acabados', unidadVenta: 'litro', cantidadPorUnidad: 1, unidadMedida: 'litro', precioPorUnidad: 280 },
    'Fondo Blanco': { nombre: 'Fondo Blanco', categoria: 'Acabados', unidadVenta: 'litro', cantidadPorUnidad: 1, unidadMedida: 'litro', precioPorUnidad: 120 },
    'Sellador': { nombre: 'Sellador', categoria: 'Acabados', unidadVenta: 'litro', cantidadPorUnidad: 1, unidadMedida: 'litro', precioPorUnidad: 110 },
    'Thinner': { nombre: 'Thinner', categoria: 'Acabados', unidadVenta: 'litro', cantidadPorUnidad: 1, unidadMedida: 'litro', precioPorUnidad: 45 },
    'Lija Grano 80': { nombre: 'Lija Grano 80', categoria: 'Acabados', unidadVenta: 'pliego', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 12 },
    'Lija Grano 120': { nombre: 'Lija Grano 120', categoria: 'Acabados', unidadVenta: 'pliego', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 12 },
    'Lija Grano 220': { nombre: 'Lija Grano 220', categoria: 'Acabados', unidadVenta: 'pliego', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 15 },

    // VIDRIO
    'Cristal Templado 6mm': { nombre: 'Cristal Templado 6mm', categoria: 'Vidrio', unidadVenta: 'm²', cantidadPorUnidad: 1, unidadMedida: 'm²', precioPorUnidad: 850 },
    'Cristal Templado 8mm': { nombre: 'Cristal Templado 8mm', categoria: 'Vidrio', unidadVenta: 'm²', cantidadPorUnidad: 1, unidadMedida: 'm²', precioPorUnidad: 950 },
    'Cristal Templado 10mm': { nombre: 'Cristal Templado 10mm', categoria: 'Vidrio', unidadVenta: 'm²', cantidadPorUnidad: 1, unidadMedida: 'm²', precioPorUnidad: 1100 },
    'Acrílico Transparente 3mm': { nombre: 'Acrílico Transparente 3mm', categoria: 'Vidrio', unidadVenta: 'placa', cantidadPorUnidad: 2.44, unidadMedida: 'm²', precioPorUnidad: 800 },
    'Acrílico Transparente 6mm': { nombre: 'Acrílico Transparente 6mm', categoria: 'Vidrio', unidadVenta: 'placa', cantidadPorUnidad: 2.44, unidadMedida: 'm²', precioPorUnidad: 1200 },
    'Acrílico Blanco 3mm': { nombre: 'Acrílico Blanco 3mm', categoria: 'Vidrio', unidadVenta: 'placa', cantidadPorUnidad: 2.44, unidadMedida: 'm²', precioPorUnidad: 850 },
    'Acrílico Blanco 6mm': { nombre: 'Acrílico Blanco 6mm', categoria: 'Vidrio', unidadVenta: 'placa', cantidadPorUnidad: 2.44, unidadMedida: 'm²', precioPorUnidad: 1250 },
    'Policarbonato 4mm': { nombre: 'Policarbonato 4mm', categoria: 'Vidrio', unidadVenta: 'placa', cantidadPorUnidad: 2.05, unidadMedida: 'm²', precioPorUnidad: 950 },
    'Policarbonato 6mm': { nombre: 'Policarbonato 6mm', categoria: 'Vidrio', unidadVenta: 'placa', cantidadPorUnidad: 2.05, unidadMedida: 'm²', precioPorUnidad: 1150 },

    // ADHESIVOS
    'Pegamento Blanco 1L': { nombre: 'Pegamento Blanco 1L', categoria: 'Adhesivos', unidadVenta: 'litro', cantidadPorUnidad: 1, unidadMedida: 'litro', precioPorUnidad: 85 },
    'Pegamento Blanco 4L': { nombre: 'Pegamento Blanco 4L', categoria: 'Adhesivos', unidadVenta: 'cubeta', cantidadPorUnidad: 4, unidadMedida: 'litro', precioPorUnidad: 280 },
    'Pegamento Contacto 1L': { nombre: 'Pegamento Contacto 1L', categoria: 'Adhesivos', unidadVenta: 'litro', cantidadPorUnidad: 1, unidadMedida: 'litro', precioPorUnidad: 120 },
    'Pegamento Contacto 4L': { nombre: 'Pegamento Contacto 4L', categoria: 'Adhesivos', unidadVenta: 'cubeta', cantidadPorUnidad: 4, unidadMedida: 'litro', precioPorUnidad: 420 },
    'Silicón Transparente': { nombre: 'Silicón Transparente', categoria: 'Adhesivos', unidadVenta: 'cartucho', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 35 },
    'Silicón Blanco': { nombre: 'Silicón Blanco', categoria: 'Adhesivos', unidadVenta: 'cartucho', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 35 },
    'Cinta Doble Cara 19mm': { nombre: 'Cinta Doble Cara 19mm', categoria: 'Adhesivos', unidadVenta: 'rollo', cantidadPorUnidad: 10, unidadMedida: 'm', precioPorUnidad: 45 },
    'Cinta Doble Cara 50mm': { nombre: 'Cinta Doble Cara 50mm', categoria: 'Adhesivos', unidadVenta: 'rollo', cantidadPorUnidad: 10, unidadMedida: 'm', precioPorUnidad: 85 },
    'Cinta Cantera': { nombre: 'Cinta Cantera', categoria: 'Adhesivos', unidadVenta: 'rollo', cantidadPorUnidad: 50, unidadMedida: 'm', precioPorUnidad: 65 },
    'Cinta Masking': { nombre: 'Cinta Masking', categoria: 'Adhesivos', unidadVenta: 'rollo', cantidadPorUnidad: 50, unidadMedida: 'm', precioPorUnidad: 45 },

    // TORNILLERIA
    'Tornillo Madera 1" (100 pzas)': { nombre: 'Tornillo Madera 1" (100 pzas)', categoria: 'Tornilleria', unidadVenta: 'caja', cantidadPorUnidad: 100, unidadMedida: 'pzas', precioPorUnidad: 45 },
    'Tornillo Madera 1.5" (100 pzas)': { nombre: 'Tornillo Madera 1.5" (100 pzas)', categoria: 'Tornilleria', unidadVenta: 'caja', cantidadPorUnidad: 100, unidadMedida: 'pzas', precioPorUnidad: 50 },
    'Tornillo Madera 2" (100 pzas)': { nombre: 'Tornillo Madera 2" (100 pzas)', categoria: 'Tornilleria', unidadVenta: 'caja', cantidadPorUnidad: 100, unidadMedida: 'pzas', precioPorUnidad: 55 },
    'Tornillo Drywall 1" (100 pzas)': { nombre: 'Tornillo Drywall 1" (100 pzas)', categoria: 'Tornilleria', unidadVenta: 'caja', cantidadPorUnidad: 100, unidadMedida: 'pzas', precioPorUnidad: 40 },
    'Tornillo Drywall 1.5" (100 pzas)': { nombre: 'Tornillo Drywall 1.5" (100 pzas)', categoria: 'Tornilleria', unidadVenta: 'caja', cantidadPorUnidad: 100, unidadMedida: 'pzas', precioPorUnidad: 45 },
    'Pija 1/4" x 1" (50 pzas)': { nombre: 'Pija 1/4" x 1" (50 pzas)', categoria: 'Tornilleria', unidadVenta: 'caja', cantidadPorUnidad: 50, unidadMedida: 'pzas', precioPorUnidad: 65 },
    'Pija 1/4" x 2" (50 pzas)': { nombre: 'Pija 1/4" x 2" (50 pzas)', categoria: 'Tornilleria', unidadVenta: 'caja', cantidadPorUnidad: 50, unidadMedida: 'pzas', precioPorUnidad: 75 },
    'Taquete Plástico #8 (100 pzas)': { nombre: 'Taquete Plástico #8 (100 pzas)', categoria: 'Tornilleria', unidadVenta: 'caja', cantidadPorUnidad: 100, unidadMedida: 'pzas', precioPorUnidad: 35 },
    'Taquete Plástico #10 (100 pzas)': { nombre: 'Taquete Plástico #10 (100 pzas)', categoria: 'Tornilleria', unidadVenta: 'caja', cantidadPorUnidad: 100, unidadMedida: 'pzas', precioPorUnidad: 40 },
    'Bisagra 2"': { nombre: 'Bisagra 2"', categoria: 'Tornilleria', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 18 },
    'Bisagra 3"': { nombre: 'Bisagra 3"', categoria: 'Tornilleria', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 25 },
    'Corredera 12"': { nombre: 'Corredera 12"', categoria: 'Tornilleria', unidadVenta: 'par', cantidadPorUnidad: 2, unidadMedida: 'pzas', precioPorUnidad: 85 },
    'Corredera 16"': { nombre: 'Corredera 16"', categoria: 'Tornilleria', unidadVenta: 'par', cantidadPorUnidad: 2, unidadMedida: 'pzas', precioPorUnidad: 110 },

    // TEXTILES
    'Lona Impresa m²': { nombre: 'Lona Impresa m²', categoria: 'Textiles', unidadVenta: 'm²', cantidadPorUnidad: 1, unidadMedida: 'm²', precioPorUnidad: 180 },
    'Vinil Adhesivo m²': { nombre: 'Vinil Adhesivo m²', categoria: 'Textiles', unidadVenta: 'm²', cantidadPorUnidad: 1, unidadMedida: 'm²', precioPorUnidad: 120 },
    'Tela Tensada m²': { nombre: 'Tela Tensada m²', categoria: 'Textiles', unidadVenta: 'm²', cantidadPorUnidad: 1, unidadMedida: 'm²', precioPorUnidad: 250 },
    'Alfombra Ferial m²': { nombre: 'Alfombra Ferial m²', categoria: 'Textiles', unidadVenta: 'm²', cantidadPorUnidad: 1, unidadMedida: 'm²', precioPorUnidad: 95 },
    'Tapiz m²': { nombre: 'Tapiz m²', categoria: 'Textiles', unidadVenta: 'm²', cantidadPorUnidad: 1, unidadMedida: 'm²', precioPorUnidad: 220 },

    // ELECTRICOS
    'Cable Calibre 12 AWG': { nombre: 'Cable Calibre 12 AWG', categoria: 'Electricos', unidadVenta: 'rollo', cantidadPorUnidad: 100, unidadMedida: 'm', precioPorUnidad: 850 },
    'Cable Calibre 14 AWG': { nombre: 'Cable Calibre 14 AWG', categoria: 'Electricos', unidadVenta: 'rollo', cantidadPorUnidad: 100, unidadMedida: 'm', precioPorUnidad: 650 },
    'Contacto Doble': { nombre: 'Contacto Doble', categoria: 'Electricos', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 25 },
    'Apagador Sencillo': { nombre: 'Apagador Sencillo', categoria: 'Electricos', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 18 },
    'Caja Chalupa': { nombre: 'Caja Chalupa', categoria: 'Electricos', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 12 },
    'Multicontacto 4 Salidas': { nombre: 'Multicontacto 4 Salidas', categoria: 'Electricos', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 85 },
    'Extensión 5m': { nombre: 'Extensión 5m', categoria: 'Electricos', unidadVenta: 'pieza', cantidadPorUnidad: 1, unidadMedida: 'pzas', precioPorUnidad: 120 },
    'Canaleta 20x10mm': { nombre: 'Canaleta 20x10mm', categoria: 'Electricos', unidadVenta: 'tira', cantidadPorUnidad: 2, unidadMedida: 'm', precioPorUnidad: 35 },
};
