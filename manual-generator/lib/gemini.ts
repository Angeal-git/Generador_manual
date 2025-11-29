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

4. **CALCULA CANTIDADES DE MATERIAL** necesarias (m², metros lineales, piezas, etc.)

5. **IDENTIFICA LA FORMA GEOMÉTRICA** de cada componente:
   - 'rectangulo': Para formas rectangulares o cuadradas.
   - 'circulo': Para formas circulares o elípticas.
   - 'triangulo': Para formas triangulares.
   - 'L': Para formas en L.
   - 'irregular': Para formas complejas que no encajan en las anteriores.

6. **PARA FORMAS IRREGULARES**, intenta proporcionar una descripción simplificada del path SVG (atributo 'd') si es posible, asumiendo un viewBox de 0 0 100 100.

7. **IDENTIFICA CONSUMIBLES** necesarios:
   - Iluminación (tipo, cantidad de metros de tira LED, watts, etc.)
   - Pintura (tipo, color, litros necesarios)
   - Adhesivos y pegamentos
   - Tornillería y herrajes
   - Vinilos (impreso o de corte, m²)

8. **DETERMINA QUÉ PIEZAS NECESITAN ARCHIVOS VECTORIALES** para corte CNC, láser o plóter (logos, letras, formas complejas)

9. **PROPORCIONA NOTAS DE FABRICACIÓN** para cada componente (procesos necesarios, acabados, ensamblaje)

10. **SUGIERE UNA SECUENCIA DE ENSAMBLAJE** lógica

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
      "svgPath": "M10 10 H 90 V 90 H 10 Z", // Solo si es irregular
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
    },
    {
      "id": "cons-2",
      "nombre": "Pintura blanca mate",
      "tipo": "pintura",
      "cantidad": 2,
      "unidad": "litros",
      "especificaciones": "Pintura acrílica blanca mate para MDF"
    }
  ],
  "secuenciaEnsamblaje": [
    "1. Cortar todos los paneles de MDF según dimensiones",
    "2. Lijar y preparar superficies",
    "3. Aplicar pintura base",
    "4. Ensamblar estructura principal",
    "5. Instalar iluminación LED",
    "6. Colocar logos y vinilos",
    "7. Realizar acabados finales"
  ],
  "notasGenerales": [
    "Verificar nivelación durante ensamblaje",
    "Usar tornillos de 1.5 pulgadas para MDF",
    "Aplicar 2 capas de pintura con lijado intermedio"
  ]
}

SÉ MUY DETALLADO Y PRECISO. Este manual será usado para fabricación real.`;

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
