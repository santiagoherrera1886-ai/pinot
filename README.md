# PINOT · Audience & Media Intelligence

Aplicación estática del proyecto Pinot en Envigado. Conserva la identidad de Pinot, los perfiles de audiencia, el mapa, keywords, creatividades y medición. Incluye flows propuestos para **diciembre de 2026 y enero de 2027**, sustentados en el histórico reciente de `Flow_Adquirir_`.

## Interfaz de cristal

La capa `pinot-premium.css` aplica una estética inspirada en interfaces iOS: paneles translúcidos, desenfoque de fondo, controles en cápsulas y tarjetas redondeadas. Mantiene el color vino y los renders del proyecto, con variantes adaptables a celular, teclado y movimiento reducido.

El flow tiene cuatro vistas: Plan de medios, Audiencias, Calendario y Sustento. Las tarjetas abren su segmentación; las fases del calendario revelan inversión y foco. Los detalles y tablas conservan la información completa. El presupuesto se personaliza en un panel desplegable y sigue compartido con resumen, medios y simulador. Los gráficos de evidencia comparan la misma métrica y ventana temporal.

## Flows mensuales

- `#flow`: selector de mes, inversión por campaña, costos por objetivo, calendario de 31 días, segmentaciones, exclusiones, mensajes, metodología y fuentes.
- `#summary`: visión ejecutiva sincronizada con el mes y escenario seleccionados.
- `#media`: asignación del mismo modelo por campaña.
- `#simulator`: presupuesto libre, mix Meta/Google y escenarios base, conservador y eficiente. Guarda ajustes por mes en el navegador.
- `#flow-nov` y `#simulator-legacy`: archivo de la propuesta anterior de noviembre, identificado como modelo de CPL uniforme.
- Las metas de septiembre–noviembre siguen disponibles en el resumen, en un bloque histórico desplegable.
- CSV por mes y escenario: presupuesto, objetivo, resultados separados, calendario, segmentaciones y justificación.

### Valores iniciales (propuesta, no inversión autorizada)

| Mes | Presupuesto COP | Meta / Google | Formularios Meta | Conversiones Google | Conversaciones Meta |
| --- | ---: | --- | ---: | ---: | ---: |
| Diciembre 2026 | 8.500.000 | 75% / 25% | 136 | 12 | 255 |
| Enero 2027 | 8.500.000 | 70% / 30% | 150 | 16 | 185 |

Los tres tipos de resultados **no son personas únicas ni leads calificados**. Se mantienen separados. Search conserva la inversión de Google y PMax queda en reserva en el plan base. Esto no cambia ninguna cuenta publicitaria.

## Datos y procedencia

Fuente indicada por el usuario: https://docs.google.com/spreadsheets/d/1H9nR4-TJou1yCEajTTDk57ffb_W581v9mT9I2Ch6NNg/edit

Revisión: **20 de noviembre de 2026**. Referencia de costos: octubre completo y noviembre hasta el corte disponible del día 19.

- `Reporte Meta!A1:AA800`: campos Invertido, Leads Form, Mensajes/WA. Se excluyen registros del 20 de noviembre; el reporte se había actualizado el 20/11 a las 07:51.
- `MART_DIARIO!A1:W540`: inversión y conversiones de Search/PMax por campaña. Actualización del mart: 19/11 a las 12:20. Contraste de últimas filas con `Google Pinot!A1:K4`.
- `METAS_MENSUALES!A16:J17`: presupuesto de referencia de noviembre, COP 8.500.000. No hay presupuesto aprobado de diciembre/enero en la fuente consultada.
- `MART_RESUMEN!A100:Y107`: contexto y contraste. El agregado Meta de noviembre estaba desactualizado frente al detalle: 294 resultados / COP 2.297.921 frente a 316 resultados / COP 2.389.223. Se usa el detalle más reciente, sin sumar ambas versiones.
- Octubre Meta: COP 3.343.553, 125 formularios y 272 mensajes. Noviembre Meta al corte: COP 2.389.223, 45 formularios y 271 mensajes. No se considera cerrado noviembre ni se asumen horas de corte idénticas entre plataformas.

`flow-history.js` guarda únicamente agregados de la fuente, sin datos personales ni credenciales. No hay lectura automática del Sheets. No se editó la hoja de origen.

## Cálculo

1. Costo ponderado por línea = suma de inversión / suma de resultados del tipo correspondiente. No es promedio de CPL diarios.
2. Referencia prudente = máximo entre el costo ponderado y el costo de noviembre. Protege contra la subida reciente de Marcas y Cargos.
3. Objetivo base = referencia × 1,20 (diciembre), o × 1,10 (enero), redondeado al alza a COP 1.000; conversaciones a COP 100. Son supuestos de planificación, no estacionalidad probada.
4. Conservador = costo base × 1,25. Eficiente = costo base × 0,85, con el mismo redondeo.
5. Resultados = inversión de cada línea / su costo objetivo. Reparto de redondeo preserva el total por tipo de resultado. La asignación monetaria conserva cada peso y el calendario suma el presupuesto mensual.

Las campañas de formulario usan su inversión completa y solo sus formularios como denominador. Los mensajes adicionales no se proyectan. BBD usa toda su inversión para proyectar conversaciones y no suma sus formularios extra. La campaña de alcance Vive Fest se incluye en la tabla de gasto observado pero se excluye de los costos de captación. Google reporta conversiones cuya definición comercial requiere validación. No hay clics comparables de Google, tasas CRM o alcance deduplicado; no se inventan sesiones, ventas o visitas.

La inversión en formularios se incrementa frente a lo observado. El modelo es una sensibilidad aritmética: requiere validar capacidad de entrega, audiencia y calidad antes de ejecutar el presupuesto. El calendario responde a una hipótesis operativa de atención comercial.

## Implementación y verificación

- HTML, CSS y JavaScript nativo, sin build ni dependencias de ejecución propias.
- `flow-model.js`: cálculo compartido, sin DOM.
- `flows-2027.js` / `flows-2027.css`: interfaz mensual y exportación.
- `pinot-premium.css`: diseño adaptable, tipografía y superficies de cristal.
- `app.js`, `flow-nov.js`, `planning-2026.js`: navegación, archivo y herramientas existentes.
- `node --test tests/flow-model.test.cjs`: referencias, tendencia reciente, separación de métricas, presupuesto cero, escenarios y conservación de totales con distintos presupuestos y mixes.
- Verificación visual: navegación, meses independientes, presupuesto exacto aplicado, filtros, sincronización resumen/medios/simulador y descarga CSV.

## Publicación

Repositorio: `santiagoherrera1886-ai/pinot`, rama `main`. Proyecto Vercel: `pinot` del equipo `sa-ntiago`, sitio https://pinot-inky.vercel.app/.

Vercel sirve el sitio estático desde la raíz (Framework Other). Los directorios temporales de preview no forman parte de la publicación.

## Producto y recursos

Renders existentes en `assets/`; fuentes originales en `assets/SOURCES.md`. Las características, precios e inventario del producto deben confirmarse antes de usarlos en anuncios. El ticket comercial histórico de COP 1.300 millones es un criterio de calificación y no el precio mínimo oficial.

- https://www.pinot.com.co/
- https://www.adquirir.com.co/proyectos
- https://arquitecturayconcreto.com/proyectos/antioquia/pinot/
