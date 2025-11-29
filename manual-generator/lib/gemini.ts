// Gemini AI Client Configuration

import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeRenderWithGemini(
  imagesData: Array<{ base64: string; mimeType: string }>,
  dimensiones: { frente: number; fondo: number; altura: number },
  especificaciones: string
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const imageCount = imagesData.length;
  const imageText = imageCount === 1 ? 'esta imagen de render' : `estas ${imageCount} imágenes de render`;

  const prompt = `Eres un experto en fabricación y producción de displays, stands, muebles y estructuras comerciales. 

Analiza ${imageText} y genera un manual de producción COMPLETO Y DETALLADO.

**DIMENSIONES GENERALES DEL PROYECTO:**
- Frente: ${dimensiones.frente} cm
- Fondo: ${dimensiones.fondo} cm
- Altura: ${dimensiones.altura} cm

**ESPECIFICACIONES DEL CLIENTE:**
${especificaciones}

${imageCount > 1 ? '**NOTA:** Se proporcionan múltiples vistas del proyecto. Analiza todas las imágenes para obtener una comprensión completa de la estructura, componentes y detalles desde diferentes ángulos.' : ''}

**INSTRUCCIONES:**

1. **IDENTIFICA TODOS LOS COMPONENTES** visibles en el render (paredes, paneles, logos, repisas, estructuras, bases, cubiertas, elementos decorativos, etc.)

2. **CALCULA DIMENSIONES PROPORCIONALES** de cada componente basándote en las dimensiones generales proporcionadas. Sé preciso y realista.

3. **SUGIERE MATERIALES APROPIADOS** para cada componente considerando:
   - Las especificaciones del cliente
   - La función del componente
   - Estándares de la industria
   - Durabilidad y costo
   - **RESTRICCIÓN DE MATERIAL**: El tamaño máximo de tablero estándar es **244 cm x 122 cm**.

4. **CALCULA CANTIDADES DE MATERIAL** necesarias (m², metros lineales, piezas, etc.)
   - **IMPORTANTE**: Si un componente excede **244 cm x 122 cm**, **DEBES DIVIDIRLO** en múltiples partes lógicas (ej. 'Panel A - Parte 1', 'Panel A - Parte 2') que quepan en el material.
   - Asegura líneas de unión limpias o encastres.
   - Asegura que todas las dimensiones sean **ESCALA REAL** basadas en las proporciones del render.

5. **IDENTIFICA LA FORMA GEOMÉTRICA** de cada componente:
   - 'rectangulo': Para formas rectangulares o cuadradas.
   - 'circulo': Para formas circulares o elípticas.
   - 'triangulo': Para formas triangulares.
   - 'L': Para formas en L.
   - 'irregular': Para formas complejas que no encajan en las anteriores.

6. **PARA FORMAS IRREGULARES Y VISTAS 3D (CRÍTICO)**:
   - **VISTA FRONTAL INDIVIDUAL OBLIGATORIA**: Para CADA componente, debes generar su geometría como si la estuvieras viendo COMPLETAMENTE DE FRENTE (proyección ortográfica 2D).
   - **NORMALIZACIÓN**: Ignora la perspectiva cónica, inclinación o rotación que tenga la pieza en el render. "Aplana" la pieza mentalmente.
   - **SIN DISTORSIONES**: La forma debe representar la pieza física real lista para corte.
   - **CARA PRINCIPAL**: En superficies inclinadas, usa la proyección ortográfica de la cara principal de corte.
   - **DESPLIEGUE**: Si es una pieza 3D que se fabrica plana y se dobla, proporciona la vista desplegada (flat pattern).
   - **PATH DE CORTE (\`svgPath\`)**: Proporciona el path SVG (atributo 'd') del contorno de corte, asumiendo un viewBox de 0 0 100 100.
   - **PATH DE PLIEGUE (\`foldPath\`)**: Si la pieza tiene pliegues internos, proporciona un path SVG separado para estas líneas.

7. **IDENTIFICA CONSUMIBLES** necesarios:
   - Iluminación (tipo, cantidad de metros de tira LED, watts, etc.)
   - Pintura (tipo, color, litros necesarios)
   - Adhesivos y pegamentos
   - Tornillería y herrajes
   - Vinilos (impreso o de corte, m²)

8. **DETERMINA QUÉ PIEZAS NECESITAN ARCHIVOS VECTORIALES** para corte CNC, láser o plóter (logos, letras, formas complejas)

9. **PROPORCIONA NOTAS DE FABRICACIÓN** para cada componente (procesos necesarios, acabados, ensamblaje)

10. **OPTIMIZACIÓN DE MATERIALES**: Agrupa componentes por tipo de material y sugiere cómo cortarlos de tableros estándar:
   - Para MDF/madera: tableros de 244x122 cm
   - Para acrílico: láminas de 200x100 cm
   - Calcula el porcentaje de aprovechamiento del material
   - Sugiere disposición de cortes para minimizar desperdicio

11. **SECUENCIA DE ENSAMBLAJE DETALLADA**: Proporciona pasos específicos con:
   - Descripción clara de cada paso
   - Componentes involucrados (IDs)
   - Tiempo estimado por paso
   - Herramientas necesarias
   - Advertencias de seguridad si aplica

**IMPORTANTE:**
- IGNORA completamente la creación de muebles (sillas, mesas, sofás, etc.) a menos que sean parte estructural del display.
- IGNORA la adquisición de electrónica (TVs, tablets, computadoras, etc.). Céntrate solo en la estructura que los soporta.

**FORMATO DE RESPUESTA:**

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin \`\`\`json) con esta estructura EXACTA:

{
  "proyecto": {
    "nombre": "Nombre descriptivo del proyecto basado en la imagen",
    "descripcion": "Descripción breve del proyecto"
  },
  "componentes": [
    {
      "id": "comp-1",
      "nombre": "Nombre del componente",
      "descripcion": "Descripción detallada",
      "dimensiones": {
        "largo": 100,
        "ancho": 50,
        "alto": 200,
        "unidad": "cm",
        "forma": "rectangulo"
      },
      "svgPath": "M10 10 H 90 V 90 H 10 Z", // Path de corte (contorno externo)
      "foldPath": "M10 50 H 90", // Path de pliegue (líneas internas, opcional)
      "material": {
        "tipo": "MDF 15mm",
        "especificaciones": "MDF de 15mm de espesor, acabado liso",
        "cantidad": 2.5,
        "unidadCantidad": "m²"
      },
      "proceso": ["Corte CNC", "Lijado", "Pintura", "Ensamblaje"],
      "notas": "Notas específicas de fabricación",
      "requiereArchivo": true
    }
  ],
  "consumibles": [
    {
      "id": "cons-1",
      "nombre": "Tira LED blanco cálido",
      "tipo": "iluminacion",
      "cantidad": 5,
      "unidad": "metros",
      "especificaciones": "Tira LED 12V, 60 LEDs/metro, blanco cálido 3000K"
    }
  ],
  "optimizacionMateriales": [
    {
      "material": "MDF 15mm",
      "boardSize": "244x122 cm",
      "components": ["comp-1", "comp-2"],
      "efficiency": 85,
      "suggestions": [
        "Cortar panel frontal (200x100cm) en la esquina superior izquierda",
        "Aprovechar el espacio restante para paneles laterales (50x100cm cada uno)",
        "Desperdicio estimado: 15% (puede usarse para refuerzos)"
      ]
    }
  ],
  "secuenciaEnsamblaje": [
    {
      "step": 1,
      "description": "Cortar todos los paneles de MDF según dimensiones",
      "components": ["comp-1", "comp-2", "comp-3"],
      "estimatedTime": "45 minutos",
      "tools": ["Sierra CNC", "Cinta métrica", "Lápiz"],
      "warnings": ["Usar protección auditiva y gafas de seguridad"]
    },
    {
      "step": 2,
      "description": "Lijar todas las superficies cortadas",
      "components": ["comp-1", "comp-2", "comp-3"],
      "estimatedTime": "30 minutos",
      "tools": ["Lijadora orbital", "Lija grano 120 y 220"],
      "warnings": ["Usar mascarilla antipolvo"]
    }
  ],
  "notasGenerales": [
    "Verificar nivelación durante ensamblaje",
    "Usar tornillos de 1.5 pulgadas para MDF",
    "Aplicar 2 capas de pintura con lijado intermedio"
  ]
}

SÉ MUY DETALLADO Y PRECISO. Este manual será usado para fabricación real. Asegúrate de que las vistas SVG sean proyecciones ortográficas frontales perfectas.`;

  // Build content array with all images
  const content: any[] = [];

  // Add all images first
  imagesData.forEach(({ base64, mimeType }) => {
    content.push({
      inlineData: {
        mimeType: mimeType,
        data: base64,
      },
    });
  });

  // Add prompt text
  content.push({ text: prompt });

  const result = await model.generateContent(content);

  const response = await result.response;
  const text = response.text();

  // Parse JSON response
  try {
    // Remove markdown code blocks if present
    let jsonText = text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    const parsedData = JSON.parse(jsonText);
    return parsedData;
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    console.error('Raw response:', text);
    throw new Error('Failed to parse AI response. Please try again.');
  }
}
