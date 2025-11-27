# 🏭 Generador de Manuales de Producción con IA

Plataforma web que utiliza inteligencia artificial (Gemini 2.0 Flash) para analizar renders de proyectos y generar manuales de producción detallados con listas de materiales, dimensiones precisas, y archivos vectoriales para fabricación.

## ✨ Características

- 🤖 **Análisis con IA**: Utiliza Gemini 2.0 Flash para analizar renders y extraer componentes
- 📐 **Cálculo de Dimensiones**: Calcula dimensiones proporcionales de cada componente
- 🧱 **Sugerencia de Materiales**: Recomienda materiales apropiados basados en especificaciones
- 📊 **Cálculo de Cantidades**: Determina cantidades exactas de materiales necesarios
- 💡 **Consumibles**: Calcula iluminación, pintura, adhesivos, tornillería, etc.
- 📄 **Archivos de Corte**: Genera archivos SVG para CNC, láser y plóter
- 💾 **Exportación**: Descarga manuales en PDF y DOCX
- 🎨 **Interfaz Moderna**: Diseño oscuro premium con animaciones suaves

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ y npm
- API Key de Google AI Studio (Gemini)

### Pasos

1. **Navega al directorio del proyecto:**
   ```bash
   cd production-manual-generator
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura la API Key:**
   
   La API key ya está configurada en `.env.local`. Si necesitas cambiarla:
   ```
   GEMINI_API_KEY=tu_api_key_aqui
   ```

4. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador:**
   
   Visita [http://localhost:3000](http://localhost:3000)

## 📖 Uso

1. **Sube un render** de tu proyecto (imagen o PDF)
2. **Ingresa las dimensiones generales** (Frente, Fondo, Altura en cm)
3. **Describe las especificaciones** del proyecto:
   - Materiales preferidos
   - Acabados
   - Tipo de iluminación
   - Colores
   - Cualquier detalle importante
4. **Haz clic en "Generar Manual"**
5. **Espera 30-60 segundos** mientras la IA analiza tu proyecto
6. **Revisa el manual generado** con todos los componentes y especificaciones
7. **Descarga** el manual en PDF, DOCX, o los archivos SVG

## 🏗️ Estructura del Proyecto

```
production-manual-generator/
├── app/
│   ├── api/
│   │   └── generate-manual/
│   │       └── route.ts          # API endpoint principal
│   ├── page.tsx                   # Página principal
│   ├── layout.tsx                 # Layout raíz
│   ├── globals.css                # Estilos globales
│   └── page.module.css            # Estilos de página
├── components/
│   ├── InputForm.tsx              # Formulario de entrada
│   ├── ManualViewer.tsx           # Visualizador del manual
│   ├── ComponentCard.tsx          # Tarjeta de componente
│   └── DownloadButtons.tsx        # Botones de descarga
├── lib/
│   ├── gemini.ts                  # Cliente de Gemini AI
│   ├── svg-generator.ts           # Generador de SVGs
│   ├── document-generator.ts      # Generador PDF/DOCX
│   ├── types.ts                   # Tipos TypeScript
│   └── utils.ts                   # Utilidades
└── package.json
```

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **IA**: Google Gemini 2.0 Flash
- **Generación PDF**: jsPDF
- **Generación DOCX**: docx
- **Compresión**: JSZip
- **Estilos**: CSS Modules

## 📝 Ejemplo de Especificaciones

```
Material principal: MDF de 15mm
Acabado: Pintura blanca mate con detalles en negro
Iluminación: Tiras LED blanco cálido 3000K
Logo: Acrílico transparente de 5mm con corte láser
Estructura: Perfiles PTR de 1" x 1"
Repisas: Vidrio templado de 6mm
```

## 🎯 Características Futuras

- ✅ Optimización de cortes en tableros
- ✅ Secuencia de ensamblaje interactiva
- ✅ Base de datos de materiales personalizable
- ✅ Cálculo de costos estimados
- ✅ Exportación a formatos CAD

## 📄 Licencia

Este proyecto fue creado como proyecto académico.

## 🤝 Soporte

Para preguntas o problemas, contacta al desarrollador.

---

**Powered by Gemini 2.0 Flash** 🚀
