# PINOT · Luxury Audience & Media Intelligence

Dashboard editorial interactivo para planificar la captación digital de compradores de alto valor para **Pinot Apartamentos**, ubicado en **Loma de las Brujas, Envigado (Antioquia)**.

## Contenido

- **Visión ejecutiva:** KPIs, insight de calidad, inversión por plataforma, fotografía del producto.
- **4 clústeres:** familias consolidadas, ejecutivos, patrimonio/inversión y upgrade residencial. Motivación, edad descriptiva, señales, mensajes, piezas y biblioteca de intereses sugeridos de Meta.
- **Territorios:** mapa interactivo real de OpenStreetMap con centros aproximados de sectores y notas de prioridad.
- **Arquitectura de medios:** seis campañas Meta + Google con reparto y roles diferentes.
- **Keyword intelligence:** 44 palabras clave semilla organizadas en marca, ubicación, premium e inversión; prioridad, match y negativas iniciales.
- **Creative studio:** tres conceptos de anuncios con imágenes publicadas por Pinot y guía de formato.
- **Simulador:** presupuesto mensual entre COP $3M y $20M, CPL entre $30k y $160k, mix Google/Meta editable, asignación por clúster y exportación CSV.
- **Medición:** funnel Lead → MQL → SQL → visita → separación, formulario y checklist de integración.

## Supuestos y límites

| Variable | Valor inicial |
| --- | --- |
| Presupuesto | COP $8.500.000 / mes |
| CPL **objetivo**, no real | COP $70.000 |
| Leads proyectados | 121 aprox. (8.500.000 / 70.000, redondeado) |
| Mix de inversión | Meta 55% / Google 45% |
| Clústeres | 35% / 30% / 20% / 15% |
| Umbral comercial de segmentación | COP $1.300 millones |

**Importante:** la cifra de COP $1.300 millones es el criterio comercial solicitado para calificar prospectos, **no** el precio mínimo oficial de toda la oferta. Adquirir comunica precios desde aproximadamente COP $1.248 millones; validar precio, tipología e inventario antes de ponerlo en campañas.

El dashboard es **una propuesta estratégica, no un reporte de resultados en tiempo real**. No está conectado a Meta Ads, Google Ads, Google Keyword Planner ni CRM. Los CPL, leads, allocations y prioridades de zonas son hipótesis de trabajo. Las edades describen buyer personas y no son filtros obligatorios ni prueba de capacidad de compra. Los intereses sugeridos deben comprobarse dentro de Meta Ads Manager. No hay cifras falsas de reach, búsquedas o CPC. El mapa usa coordenadas de centros de sector aproximadas.

## Tecnología

Sitio estático con HTML5, CSS3 y JavaScript nativo. Utiliza **Leaflet 1.9.4 y OpenStreetMap** para el mapa, Google Fonts y renders de la web pública de Pinot. No requiere dependencias npm, build ni claves de API.

La capa visual `editorial.css` unifica las ocho secciones con tipografía Cormorant Garamond, tonos vino y marfil y una portada editorial con galería manual. Las imágenes optimizadas se sirven desde `assets/`; sus fuentes están documentadas en `assets/SOURCES.md`. La navegación móvil incluye cierre con Escape, control de foco y fondo bloqueado; las animaciones respetan la preferencia de movimiento reducido.

## Uso local

Abrir `index.html` o servirlo mediante `python3 -m http.server 8080`. Navegar a `http://localhost:8080`. El mapa, fuentes e imágenes requieren conexión a internet.

## Despliegue Vercel

Vincular el repositorio `santiagoherrera1886-ai/pinot` al proyecto **pinot** del equipo **sa-ntiago**. Configurar **Framework Preset: Other**, **Root Directory: /**, sin Build Command y sin Output Directory personalizada. Cada push a `main` desplegará producción *solo si* la vinculación y permisos están configurados.

## Fuentes del producto

- https://www.pinot.com.co/
- https://www.adquirir.com.co/proyectos
- https://arquitecturayconcreto.com/proyectos/antioquia/pinot/

Última actualización de estrategia: 14 octubre 2026. Rediseño visual: 15 octubre 2026.


## Metas mensuales del Apps Script (2026)

La sección **Metas por mes** de la visión ejecutiva conserva el modelo de metas iniciales del código `ADQUIRIR - FLOW_ADQUIRIR DATA MARTS` (V7, noviembre). No reemplaza ni simula datos reales; el dashboard continúa siendo una planeación estática independiente de Google Sheets.

| Período | Meta presupuesto total | Meta presupuesto para CPL | Meta leads | Google presupuesto total | Google presupuesto para CPL | Google leads |
|---|---:|---:|---:|---:|---:|---:|
| Septiembre 2026 | 5.560.000 | 4.060.000 | 59 | 2.940.000 | 2.940.000 | 59 |
| Octubre 2026 | 5.560.000 | 4.060.000 | 220 | 2.940.000 | 2.940.000 | 160 |
| Noviembre 2026 | 5.950.000 | 5.950.000 | 85 | 2.550.000 | 2.550.000 | 36 |

En septiembre y octubre, la diferencia de COP 1.500.000 de Meta corresponde a una activación de alcance/frecuencia excluida del cálculo de CPL, de acuerdo con el Apps Script. El simulador independiente de noviembre mantiene la hipótesis de COP 70.000 CPL combinado y 70% Meta / 30% Google. El redondeo por plataforma de 85 + 36 leads da un CPL ponderado de COP 70.248 aprox.
