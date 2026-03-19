
# CLAUDE.md — ClubMetrics App

> Contexto completo del proyecto. Leer antes de cualquier tarea.

---

## 1. ¿Qué es ClubMetrics?

ClubMetrics es la  **primera plataforma de benchmarking especializada en clubes sociales y deportivos de Latinoamérica** . Permite a Gerentes Generales y Juntas Directivas comparar más de 80 indicadores financieros, operativos y de capital humano contra clubes similares del sector, de forma  **anónima, rigurosa y accionable** .

**Propósito:** Equipar a los líderes de clubes con datos reales del sector para que tomen decisiones con contexto, no por intuición ni tradición.

**Estado actual:** Demo funcional para presentar a primeros clientes. Los datos son sintéticos (30 clubes, 167 variables). No hay backend real aún.

**Landing page:** https://clubmetrics.vercel.app

---

## 2. Stack tecnológico

```
Frontend:     Next.js 14 (App Router)
Estilos:      Tailwind CSS
Gráficas:     Recharts
Iconos:       Lucide React
Fuente:       Inter (Google Fonts)
Fuente mono:  JetBrains Mono (para IDs anónimos)
Deploy:       Vercel
Datos demo:   /data/clubmetrics_v2.json (30 clubes, 167 variables)
```

**Dependencias:**

```bash
npm install recharts lucide-react
npm install @radix-ui/react-tooltip @radix-ui/react-tabs
```

---

## 3. Paleta de colores

```js
const colors = {
  azulPrincipal:  '#1464A0',   // Fondos, CTAs, cabeceras, sidebar activo
  azulOscuro:     '#0D4A7A',   // Fondo sidebar, hover, footer
  verdeEsmeralda: '#3DC99A',   // Acento, íconos, gráficas positivas
  verdeOscuro:    '#2BA87E',   // Hover verde, bordes activos
  textoPrincipal: '#1E2B3C',
  textoSecundario:'#4A5568',
  fondoSuave:     '#F0F4F8',
  bordes:         '#D1D9E0',
  blanco:         '#FFFFFF',
  verde:          '#27AE60',   // Semáforo positivo · percentil >75
  ambar:          '#F39C12',   // Semáforo medio · percentil 25-75
  rojo:           '#E74C3C',   // Semáforo alerta · percentil <25
  gris:           '#A0AEC0',   // Sin datos
  grafica: ['#1464A0','#3DC99A','#F39C12','#E74C3C','#4A5568','#9B59B6'],
}
```

**tailwind.config.js:**

```js
extend: { colors: { brand: {
  azul: '#1464A0', azulOscuro: '#0D4A7A',
  verde: '#3DC99A', verdeOscuro: '#2BA87E',
}}}
```

---

## 4. Tipografía

```
H1 módulo:    Inter Bold 32px    · #1464A0
H2:           Inter SemiBold 24px · #1E2B3C
Body:         Inter Regular 15px  · #4A5568
KPI Value:    Inter Bold 32-36px  · #1464A0 o color semáforo
KPI Label:    Inter Bold 11px · MAYÚSCULAS · tracking 0.08em · #4A5568
IDs anónimos: JetBrains Mono 12px · fondo #F0F4F8 · padding 2px 6px · border-radius 4px
```

---

## 5. Estructura de carpetas

```
/clubmetrics-app
├── CLAUDE.md
├── /app
│   ├── page.tsx                       ← redirige a /login
│   ├── /login/page.tsx
│   └── /dashboard
│       ├── layout.tsx                 ← sidebar + header compartido
│       ├── page.tsx                   ← Resumen Ejecutivo
│       ├── /perfil/page.tsx           ← CAP1: Perfil Estructural
│       ├── /ingresos/page.tsx         ← CAP2: Ingresos y Membresías
│       ├── /tarifas/page.tsx          ← CAP3: Tarifas y Márgenes
│       ├── /deportes/page.tsx         ← CAP4: Deportes y Recreación
│       ├── /opex/page.tsx             ← CAP5: OPEX y Costos
│       ├── /capex/page.tsx            ← CAP6: CAPEX y Reservas
│       ├── /capital-humano/page.tsx   ← CAP7: Capital Humano
│       ├── /experiencia/page.tsx      ← CAP8: Experiencia del Socio
│       ├── /solvencia/page.tsx        ← CAP9: Solvencia Financiera
│       └── /posicionamiento/page.tsx  ← Vista competitiva cruzada
├── /components
│   ├── /ui
│   │   ├── KPICard.tsx
│   │   ├── PercentileBar.tsx
│   │   ├── BenchmarkTable.tsx
│   │   ├── SemaforoTag.tsx
│   │   ├── AnonymousTag.tsx
│   │   └── ProtectedBadge.tsx
│   ├── /charts
│   │   ├── BarComparativo.tsx
│   │   ├── RadarDiagnostico.tsx
│   │   ├── ScatterPositioning.tsx
│   │   ├── DonutDistribucion.tsx
│   │   └── StackedBar100.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── PageHeader.tsx
├── /data
│   └── clubmetrics_v2.json            ← 30 clubes, 167 variables — FUENTE DE VERDAD
├── /lib
│   ├── data.ts
│   ├── benchmark.ts
│   └── anonymize.ts
├── /public
│   ├── logo.png                       ← logo horizontal completo (fondo blanco)
│   └── logo-icon.png                  ← isotipo solo (fondo blanco)
└── /types
    └── club.ts
```

---

## 6. Los 9 capítulos del benchmark — especificación completa

Esta es la estructura oficial del producto. Cada capítulo = un módulo en la app.

---

### CAP1 — Perfil Estructural y Demográfico

**Ruta:** `/dashboard/perfil`
**Propósito:** Contextualizar el club. Es el denominador de todos los ratios del benchmark.

**Indicadores:**

* Índice de ocupación de cupo: `socios / acciones_emitidas × 100` — ref >90% = posible lista de espera
* Pirámide demográfica por edad (<35, 35-50, 51-65, >65) — >85% mayores de 50 = riesgo sucesión
* Antigüedad promedio base de socios
* Superficie terreno y construida vs comunidad
* Modelo de negocio (socios / corporativo / inmobiliario / mixto)
* Tipo de club (ciudad / campestre / mixto)

**Variables JSON:**

```
C01_socios_titulares, C02_comunidad_total, C04_acciones_totales_emitidas
C05_socios_baja_año, C06_socios_nuevos_año, P11_año_fundacion
D02_area_terreno_m2, D03_area_construida_m2, D01_sedes
P01_tipo_label, P14_modelo_label, tamaño, P12_ciudad, P13_departamento
KPI_indice_cupo_pct
```

**Visualización:** Barras apiladas distribución de socios por edad comparativo segmento.

---

### CAP2 — Estructura de Ingresos y Membresías

**Ruta:** `/dashboard/ingresos`
**Propósito:** Modelo de ingresos, monetización y salud de la membresía.

**Indicadores:**

* ARPU mensual por socio — KPI central. Ref: >$5M COP eficiente para country
* Churn Rate anual — alerta >5%. Semáforo INVERTIDO (menor = mejor)
* % cuotas sobre ingresos totales — dependencia alta >70%
* % venta de derechos sobre ingresos — riesgo si >15%
* Ratio dependencia cuotas (cuotas / gastos operativos) — sostenible si >1.0
* Yield de transferencia (precio mercado / nominal × 100) — <90% = presión bajista
* Valor acción vs promedio segmento
* Composición de ingresos por fuente: cuotas, A&B, deportes, eventos, derechos

**Variables JSON:**

```
F01_ingresos_totales_COP_MM, F02_ingresos_cuotas_COP_MM, F03_ingresos_ab_COP_MM
F05_ingresos_deportivos_COP_MM, F06_ingresos_eventos_COP_MM, F07_ingresos_torneos_COP_MM
F08_ingresos_derechos_COP_MM, P06_valor_accion_COP_miles
P02_cuota_sin_iva_COP_miles, P03_cuota_con_iva_COP_miles
KPI_arpu_mensual_COP_miles, KPI_churn_rate_pct, KPI_depend_cuotas_pct
KPI_yield_transferencia_pct, KPI_ratio_depend_cuotas, KPI_indice_cupo_pct
```

**Visualizaciones:**

* Barras horizontales ARPU ordenadas de mayor a menor
* Barras apiladas 100% composición de ingresos por fuente

---

### CAP3 — Servicios, Tarifas y Oferta Deportiva

**Ruta:** `/dashboard/tarifas`
**Propósito:** Posicionamiento tarifario y rentabilidad por línea de servicio.

**Indicadores:**

* Margen contribución restaurante — ref >25%. <20% = revisar modelo gastronómico
* Margen contribución eventos — ref >35%
* Margen contribución deportes
* Green fee fin de semana y entre semana
* Clase tenis privada vs grupal
* Tarifa gimnasio (si cobra adicional)
* Pesebrera mensual (si aplica hípica)
* Número de servicios / comunidad (amplitud de oferta)
* Servicio más utilizado (identificado por visitas)

**Variables JSON:**

```
T01_cuota_sostenimiento_COP_miles, T02_tarifa_invitado_COP_miles
T03_green_fee_fs_COP_miles, T04_green_fee_sem_COP_miles
T05_clase_tenis_priv_COP_miles, T06_clase_tenis_grupo_COP_miles
T07_uso_gym_COP_miles, T08_pesebrera_COP_miles
T09_corte_cab_COP_miles, T10_corte_dama_COP_miles
KPI_margen_contribucion_restaurante_pct
KPI_margen_contribucion_eventos_pct
KPI_margen_contribucion_deportes_pct
KPI_servicios_por_comunidad, G05_costo_directo_ab_COP_MM
```

**Visualización:** Barras agrupadas margen de contribución por servicio comparativo segmento.

---

### CAP4 — Gestión de Deportes, Fitness y Recreación

**Ruta:** `/dashboard/deportes`
**Propósito:** Eficiencia de escenarios deportivos y vida deportiva del club.

**Indicadores:**

* Ocupación canchas tenis — ref >65%. <40% = subutilizado, revisar programación
* Ocupación golf — ref >60% en clubs campestres
* Ocupación piscina
* Total torneos y eventos anuales — mayor actividad = mayor retención de socios
* Torneos por disciplina: golf, tenis, natación, billar
* % ingresos de eventos y torneos — riesgo si >20% (dependencia climática)
* Ratio máquinas gimnasio / socios — ref: 1 máquina cada 80-120 socios en premium
* Inventario de escenarios: canchas tenis, pádel, hoyos golf, piscinas

**Variables JSON:**

```
S05_ocupacion_tenis_pct, S43_ocupacion_golf_pct, S12_ocupacion_piscina_pct
S37_torneos_eventos_total, S03_torneos_golf, S06_torneos_tenis
S13_torneos_natacion, S34_mesas_billar, S42_maquinas_gym
S04_canchas_tenis, S07_canchas_padel, S11_piscinas, S33_hoyos_golf
S01_area_golf_m2, S02_rounds_mes, S10_sillas_ab
KPI_ratio_maquinas_socio, KPI_socios_por_cancha_tenis
F06_ingresos_eventos_COP_MM, F07_ingresos_torneos_COP_MM
```

**Visualización:** Barras agrupadas por escenario (golf/tenis/piscina/gym) con % ocupación vs segmento.

---

### CAP5 — Eficiencia de Costos y OPEX

**Ruta:** `/dashboard/opex`
**Propósito:** Estructura y eficiencia de los principales rubros de gasto operativo.

**Indicadores:**

* % gasto personal sobre ingresos — ref sectorial: 40-55%. >55% = sobredotado
* % servicios públicos sobre ingresos — ref: 8-15% según tipo de club
* % impuestos (predial) sobre ingresos — ref: 4-8%
* % mantenimiento sobre ingresos — ref: 7-12%
* % mantenimiento preventivo vs correctivo — ref >60% preventivo = gestión proactiva
* Gasto mantenimiento por m² — comparativo clubs mismo tamaño
* DSO / días rotación de cartera — alerta >45 días. Semáforo INVERTIDO
* % inventarios sobre ingresos — ref: 3-6%
* Distribución % cuota de administración por concepto

**Variables JSON:**

```
G01_gasto_sp_COP_MM, G02_gasto_mant_COP_MM, G03_gasto_predial_COP_MM
G04_inventarios_COP_MM, K01_dso_dias
KPI_pct_gasto_personal_ingresos, KPI_pct_sp_ingresos
KPI_pct_impuestos_ingresos, KPI_pct_mant_ingresos
KPI_pct_mant_preventivo, KPI_costo_mant_m2_COP, KPI_gasto_sp_m2_COP
KPI_pct_inventario_ingresos
```

**Visualización:** Donut por club mostrando distribución del gasto operativo (personal / SP / mant / impuestos / otros).

---

### CAP6 — Inversiones y CAPEX

**Ruta:** `/dashboard/capex`
**Propósito:** Reinversión en infraestructura, salud de reservas y sostenibilidad de largo plazo.

**Indicadores:**

* % ingresos en CAPEX — ref >5% para sostenibilidad. <3% = deuda invisible de infraestructura
* Reserve Funding Ratio — ref >70%. <50% = club consume patrimonio futuro de los socios
* Días de reserva de capital — ref >60 días mínimo operativo
* Relación reserva / deuda total — ref >0.5
* Tasa de reinversión de capital (CAPEX / EBITDA) — ref: 0.3-0.5x
* % cuota destinado a reserva — ref >5%
* Ratio cuotas extraordinarias — ref <10%. Alta = planificación deficiente

**Variables JSON:**

```
I01_capex_COP_MM, CAP6_fondo_reserva_COP_MM
CAP6_deuda_total_COP_MM, CAP6_efectivo_COP_MM
KPI_reserve_funding_ratio_pct, KPI_dias_reserva_capital
KPI_relacion_reserva_deuda, KPI_tasa_reinversion_capex
KPI_pct_cuota_reserva, KPI_ratio_cuotas_extraordinarias_pct
KPI_reinversion_capex_pct
```

**Visualización:** Scatter plot — eje X: días de reserva, eje Y: Reserve Funding Ratio, tamaño burbuja: % CAPEX. Cuadrante superior derecho = alta resiliencia.

---

### CAP7 — Capital Humano y Cultura Organizacional

**Ruta:** `/dashboard/capital-humano`
**Propósito:** Eficiencia laboral, rotación, salarios y desarrollo del talento.

**Indicadores:**

* Ratio empleados / socio — ref: 1 por 8-15 socios según tipo. Semáforo INVERTIDO
* % personal front-office (atención directa al socio) — ref >55%. <50% = exceso burocracia
* % personal área deportiva
* Rotación operativa anual — ref <20%. Alta rotación ↔ caída en NPS. Semáforo INVERTIDO
* Rotación administrativa anual — ref <10%. Semáforo INVERTIDO
* Horas de formación por empleado/año — ref >20h. Correlación inversa con rotación
* Distribución nómina por bloque: estratégico (N01), A&B (N02), deportivo (N03), soporte (N04)
* Distribución por rangos salariales: hasta 1 SMLV, 1-4, 4-8, 8-12, 12-16, >16 SMLV
* Tipo de contrato: indefinido TC, prestación de servicios, indefinido no TC
* % sindicalizados (dato sensible — mostrar solo si tiene sindicato)
* Nómina total como % de ingresos

**Variables JSON:**

```
N01_nom_estrategico_COP_miles_mes, N02_nom_ab_COP_miles_mes
N03_nom_deportivo_COP_miles_mes, N04_nom_soporte_COP_miles_mes
N05_emp_estrategico_cant, N06_emp_ab_cant
N07_emp_deportivo_indef_cant, N08_emp_deportivo_otra_cant, N11_emp_soporte_cant
N12_sal_hasta_1smlv, N13_sal_1a4smlv, N14_sal_4a8smlv
N15_sal_8a12smlv, N16_sal_12a16smlv, N17_sal_mas16smlv
N18_pct_atencion_socio, N19_pct_soporte_back
N20_emp_indefinido_tc, N21_emp_prestacion_servicios, N22_emp_indefinido_no_tc
P10_tiene_sindicato
KPI_ratio_emp_socio, KPI_nom_por_socio_COP_miles, KPI_ingreso_por_COP_nom
KPI_rotacion_operativa_pct, KPI_rotacion_administrativa_pct
KPI_horas_formacion_emp_año, KPI_pct_sindicalizados
KPI_pct_personal_frontoffice, KPI_pct_personal_deportes
KPI_pct_gasto_personal_ingresos, KPI_salario_minimo_smlv
```

**Visualizaciones:**

* Donut distribución nómina por bloque funcional
* Scatter rotación vs horas de formación (correlación inversa)
* Barras rangos salariales comparativo segmento

---

### CAP8 — Experiencia del Socio y Analítica de Uso

**Ruta:** `/dashboard/experiencia`
**Propósito:** Satisfacción, fidelización y patrones de uso.

**Indicadores:**

* NPS (Net Promoter Score) — ref >40 excelente, <20 alerta crítica
* Tasa de retención anual (100% - Churn) — ref >95%
* Visitas promedio por socio por mes
* Segmentación socios por frecuencia de visita:
  * Activos (>1 visita/mes) — ref >65%
  * Dormidos (<1 visita/mes) — ref <25%. >30% = espiral descendente de ingresos
  * En riesgo (frecuencia cayendo >50%) — ref <10%
* % acciones en alquiler (socios dormidos económicos) — ref <8%
* Índice de activación de socios nuevos — % con >2 visitas en primer mes
* Satisfacción general (escala 1-5)

**Variables JSON:**

```
KPI_nps, KPI_satisfaccion
KPI_pct_socios_activos, KPI_pct_socios_dormidos, KPI_pct_socios_en_riesgo
KPI_tasa_retencion_anual_pct, KPI_pct_acciones_alquiler
KPI_visitas_promedio_mes, KPI_indice_activacion_nuevos_pct
KPI_churn_rate_pct
```

**Visualizaciones:**

* Barras horizontales NPS con línea de referencia sectorial (>40)
* Barras apiladas 100%: activos / dormidos / en riesgo comparativo segmento

---

### CAP9 — Ratios de Solvencia y Salud Financiera

**Ruta:** `/dashboard/solvencia`
**Propósito:** Sostenibilidad financiera, liquidez y capacidad de endeudamiento.

**Indicadores:**

* EBITDA y margen EBITDA — ref: 8-18% clubs sin hotel, hasta 25% con alojamiento
* Razón de liquidez corriente (activo corriente / pasivo corriente) — ref >1.2x. <1.0 = riesgo iliquidez
* Prueba ácida ((activo corriente - inventarios) / pasivo corriente) — ref >0.8x
* Índice de endeudamiento total (pasivos / activos × 100) — ref <50%. Semáforo INVERTIDO
* Cobertura de intereses (EBITDA / gastos financieros) — ref >3.0x. <2.0x = estrés financiero
* Deuda Neta / EBITDA — ref <3.0x. >3.5x = insostenible. Semáforo INVERTIDO
* DSO rotación de cartera — ref <45 días. Semáforo INVERTIDO

**Variables JSON:**

```
F04_ebitda_COP_MM, CAP9_activo_corriente_COP_MM, CAP9_pasivo_corriente_COP_MM
CAP9_gastos_financieros_COP_MM, CAP9_activos_totales_COP_MM
CAP6_deuda_total_COP_MM, CAP6_efectivo_COP_MM, G04_inventarios_COP_MM
KPI_ebitda_margen_pct, KPI_razon_liquidez_corriente, KPI_prueba_acida
KPI_indice_endeudamiento_pct, KPI_cobertura_intereses
KPI_deuda_neta_ebitda, K01_dso_dias
```

**Visualización:** Radar de salud financiera con 6 ejes: Liquidez · EBITDA% · Endeudamiento · Cobertura intereses · Rotación cartera · Reserve Funding.

---

## 7. Módulo de Posicionamiento Competitivo

**Ruta:** `/dashboard/posicionamiento`
**Propósito:** Vista cruzada del club frente al sector.

**Contenido:**

* Scatter ARPU vs Churn — club propio en azul destacado, otros anónimos en gris
* Scatter EBITDA% vs NPS — posicionamiento financiero + experiencia
* Ranking tabla del segmento con clubs como CLB-001, CLB-002 (fila propia siempre resaltada)
* Cuadrante estratégico con 4 zonas: Líder / Eficiente / Vulnerable / En riesgo

---

## 8. Sidebar con mini KPIs — especificación completa

```
Ancho: 220px · Fondo: #0D4A7A · Posición: fixed · Height: 100vh

Cada ítem del menú:
  Línea 1: nombre del módulo (Inter 13px, rgba(255,255,255,0.75))
  Línea 2: KPI más relevante del módulo + percentil vs segmento (Inter 10px, rgba(255,255,255,0.38))
  Derecha: punto semáforo 8px calculado en tiempo real

Ítem activo: fondo #1464A0 · border-left 3px #3DC99A · texto blanco

KPI que muestra cada módulo:
  Resumen Ejecutivo  → NPS · alertas activas (KPIs en rojo)
  Perfil             → Índice de cupo (%) · P[X]
  Ingresos           → ARPU mensual · P[X]
  Tarifas            → Margen restaurante (%) · semáforo
  Deportes           → Ocupación tenis (%) · P[X]
  OPEX               → % gasto personal · P[X]
  CAPEX              → Reserve Funding Ratio · semáforo
  Capital Humano     → Ratio emp/socio · P[X]
  Experiencia        → NPS · tasa retención
  Solvencia          → Margen EBITDA · semáforo liquidez
  Posicionamiento    → Percentil global del segmento

Mini scoreboard global (encima del footer):
  Fondo: rgba(255,255,255,0.05) · border-radius 10px
  Conteo: verde / ámbar / rojo de todos los KPIs del club
  Badge percentil global: fondo rgba(61,201,154,0.15) · texto #3DC99A

Footer sidebar:
  Avatar circular con iniciales · fondo #1464A0 · texto #3DC99A
  Nombre del club (truncado con ellipsis)
  ID anónimo en JetBrains Mono: CLB-005 · color rgba(61,201,154,0.6)
```

---

## 9. Modelo de datos completo — tipos TypeScript

```typescript
// /types/club.ts
type Club = {
  // Identidad
  id_club: string              // "CLB-001" a "CLB-030"
  nombre_club: string          // SOLO visible para el club propio, NUNCA mostrar de otros

  // CAP1 — Perfil
  P01_tipo_club: string        // "1"=Ciudad "2"=Campestre "3"=Mixto
  P01_tipo_label: string
  P11_año_fundacion: number
  P12_ciudad: string
  P13_departamento: string
  P14_modelo_negocio: string   // "1"=Socios "2"=Corporativo "3"=Inmobiliario "4"=Mixto
  P14_modelo_label: string
  tamaño: string               // "Grande" | "Mediano" | "Pequeño"
  D01_sedes: number
  D02_area_terreno_m2: number
  D03_area_construida_m2: number
  C01_socios_titulares: number
  C02_comunidad_total: number
  C04_acciones_totales_emitidas: number
  C05_socios_baja_año: number
  C06_socios_nuevos_año: number
  P02_cuota_sin_iva_COP_miles: number
  P03_cuota_con_iva_COP_miles: number
  P04_consumo_minimo_COP_miles: number
  P05_acciones_venta: number
  P06_valor_accion_COP_miles: number
  P07_valor_derecho_COP_miles: number
  P08_valor_traspaso_COP_miles: number
  P09_derechos_vendidos_año: number
  P10_tiene_sindicato: number  // 0 | 1

  // CAP2 — Ingresos (MM COP anuales)
  F01_ingresos_totales_COP_MM: number
  F02_ingresos_cuotas_COP_MM: number
  F03_ingresos_ab_COP_MM: number
  F04_ebitda_COP_MM: number
  F05_ingresos_deportivos_COP_MM: number
  F06_ingresos_eventos_COP_MM: number
  F07_ingresos_torneos_COP_MM: number
  F08_ingresos_derechos_COP_MM: number

  // CAP3 — Gastos OPEX (MM COP)
  G01_gasto_sp_COP_MM: number
  G02_gasto_mant_COP_MM: number
  G03_gasto_predial_COP_MM: number
  G04_inventarios_COP_MM: number
  G05_costo_directo_ab_COP_MM: number
  I01_capex_COP_MM: number

  // CAP4 — Tarifas (COP miles)
  T01_cuota_sostenimiento_COP_miles: number
  T02_tarifa_invitado_COP_miles: number
  T03_green_fee_fs_COP_miles: number
  T04_green_fee_sem_COP_miles: number
  T05_clase_tenis_priv_COP_miles: number
  T06_clase_tenis_grupo_COP_miles: number
  T07_uso_gym_COP_miles: number
  T08_pesebrera_COP_miles: number
  T09_corte_cab_COP_miles: number
  T10_corte_dama_COP_miles: number
  T11_manicure_COP_miles: number
  T12_pedicura_COP_miles: number
  K01_dso_dias: number

  // CAP5 — Infraestructura
  S01_area_golf_m2: number
  S02_rounds_mes: number
  S03_torneos_golf: number
  S04_canchas_tenis: number
  S05_ocupacion_tenis_pct: number
  S06_torneos_tenis: number
  S07_canchas_padel: number
  S08_pesebreras: number
  S10_sillas_ab: number
  S11_piscinas: number
  S12_ocupacion_piscina_pct: number
  S13_torneos_natacion: number
  S14_canchas_futbol: number
  S33_hoyos_golf: number
  S34_mesas_billar: number
  S36_salones: number
  S37_torneos_eventos_total: number
  S42_maquinas_gym: number
  S43_ocupacion_golf_pct: number

  // CAP6 — CAPEX y Reservas (MM COP)
  CAP6_fondo_reserva_COP_MM: number
  CAP6_deuda_total_COP_MM: number
  CAP6_efectivo_COP_MM: number

  // CAP7 — Nómina (COP miles/mes y cantidades)
  N01_nom_estrategico_COP_miles_mes: number
  N02_nom_ab_COP_miles_mes: number
  N03_nom_deportivo_COP_miles_mes: number
  N04_nom_soporte_COP_miles_mes: number
  N05_emp_estrategico_cant: number
  N06_emp_ab_cant: number
  N07_emp_deportivo_indef_cant: number
  N08_emp_deportivo_otra_cant: number
  N11_emp_soporte_cant: number
  N12_sal_hasta_1smlv: number
  N13_sal_1a4smlv: number
  N14_sal_4a8smlv: number
  N15_sal_8a12smlv: number
  N16_sal_12a16smlv: number
  N17_sal_mas16smlv: number
  N18_pct_atencion_socio: number
  N19_pct_soporte_back: number
  N20_emp_indefinido_tc: number
  N21_emp_prestacion_servicios: number
  N22_emp_indefinido_no_tc: number

  // CAP9 — Solvencia (MM COP)
  CAP9_activo_corriente_COP_MM: number
  CAP9_pasivo_corriente_COP_MM: number
  CAP9_gastos_financieros_COP_MM: number
  CAP9_activos_totales_COP_MM: number

  // KPIs derivados (pre-calculados, listos para usar)
  KPI_churn_rate_pct: number
  KPI_arpu_mensual_COP_miles: number
  KPI_ebitda_margen_pct: number
  KPI_margen_ab_pct: number
  KPI_depend_cuotas_pct: number
  KPI_ratio_emp_socio: number
  KPI_nom_por_socio_COP_miles: number
  KPI_ingreso_por_COP_nom: number
  KPI_venta_silla_mes_COP_miles: number
  KPI_gasto_sp_m2_COP: number
  KPI_costo_mant_m2_COP: number
  KPI_socios_por_cancha_tenis: number
  KPI_reinversion_capex_pct: number
  KPI_nps: number
  KPI_satisfaccion: number
  KPI_yield_transferencia_pct: number
  KPI_ratio_depend_cuotas: number
  KPI_indice_cupo_pct: number
  KPI_margen_contribucion_restaurante_pct: number
  KPI_margen_contribucion_eventos_pct: number
  KPI_margen_contribucion_deportes_pct: number
  KPI_ratio_maquinas_socio: number
  KPI_servicios_por_comunidad: number
  KPI_pct_socios_activos: number
  KPI_pct_socios_dormidos: number
  KPI_pct_socios_en_riesgo: number
  KPI_tasa_retencion_anual_pct: number
  KPI_pct_acciones_alquiler: number
  KPI_visitas_promedio_mes: number
  KPI_indice_activacion_nuevos_pct: number
  KPI_reserve_funding_ratio_pct: number
  KPI_dias_reserva_capital: number
  KPI_relacion_reserva_deuda: number
  KPI_tasa_reinversion_capex: number
  KPI_pct_cuota_reserva: number
  KPI_ratio_cuotas_extraordinarias_pct: number
  KPI_rotacion_operativa_pct: number
  KPI_rotacion_administrativa_pct: number
  KPI_horas_formacion_emp_año: number
  KPI_pct_sindicalizados: number
  KPI_pct_personal_frontoffice: number
  KPI_pct_personal_deportes: number
  KPI_salario_minimo_smlv: number
  KPI_razon_liquidez_corriente: number
  KPI_prueba_acida: number
  KPI_indice_endeudamiento_pct: number
  KPI_cobertura_intereses: number
  KPI_deuda_neta_ebitda: number
  KPI_pct_gasto_personal_ingresos: number
  KPI_pct_sp_ingresos: number
  KPI_pct_impuestos_ingresos: number
  KPI_pct_mant_ingresos: number
  KPI_pct_mant_preventivo: number
  KPI_pct_inventario_ingresos: number
}
```

---

## 10. Lógica de benchmarking

### Segmentación (NUNCA comparar entre segmentos distintos)

```
Segmento = P01_tipo_label + " — " + tamaño
"Campestre — Grande" (4 clubs) | "Campestre — Mediano" (4)
"Ciudad — Grande" (1) | "Ciudad — Mediano" (6) | "Ciudad — Pequeño" (7)
"Mixto — Mediano" (4) | "Mixto — Pequeño" (4)
REGLA: Si segmento <5 clubs → bloquear visualización con mensaje
```

### lib/benchmark.ts

```typescript
export function getPercentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  const idx = Math.floor((p / 100) * sorted.length)
  return sorted[Math.min(idx, sorted.length - 1)]
}

export function getSemaforo(
  value: number, p25: number, p75: number, higherIsBetter = true
): 'verde' | 'ambar' | 'rojo' {
  if (higherIsBetter) {
    if (value >= p75) return 'verde'
    if (value >= p25) return 'ambar'
    return 'rojo'
  } else {
    if (value <= p25) return 'verde'
    if (value <= p75) return 'ambar'
    return 'rojo'
  }
}

// Semáforo absoluto para indicadores con umbrales sectoriales conocidos
export function getSemaforoAbsoluto(kpi: string, value: number): 'verde' | 'ambar' | 'rojo' {
  const thresholds: Record<string, { verde: [number,number], ambar: [number,number] }> = {
    KPI_churn_rate_pct:            { verde: [0,3],    ambar: [3,5]    },  // menor mejor
    KPI_ebitda_margen_pct:         { verde: [12,100], ambar: [8,12]   },
    KPI_razon_liquidez_corriente:  { verde: [1.5,99], ambar: [1.0,1.5]},
    KPI_reserve_funding_ratio_pct: { verde: [70,100], ambar: [50,70]  },
    KPI_nps:                       { verde: [40,100], ambar: [20,40]  },
    KPI_tasa_retencion_anual_pct:  { verde: [95,100], ambar: [90,95]  },
    KPI_cobertura_intereses:       { verde: [4,99],   ambar: [2,4]    },
    KPI_deuda_neta_ebitda:         { verde: [0,2],    ambar: [2,3.5]  },  // menor mejor
    KPI_pct_gasto_personal_ingr:   { verde: [0,45],   ambar: [45,55]  },  // menor mejor
    K01_dso_dias:                  { verde: [0,30],   ambar: [30,45]  },  // menor mejor
  }
  // fallback a verde si no hay umbral definido
  const t = thresholds[kpi]
  if (!t) return 'verde'
  if (value >= t.verde[0] && value <= t.verde[1]) return 'verde'
  if (value >= t.ambar[0] && value <= t.ambar[1]) return 'ambar'
  return 'rojo'
}
```

### Indicadores donde MENOR ES MEJOR (pasar higherIsBetter=false):

```
KPI_churn_rate_pct, K01_dso_dias, KPI_ratio_emp_socio
KPI_costo_mant_m2_COP, KPI_gasto_sp_m2_COP
KPI_rotacion_operativa_pct, KPI_rotacion_administrativa_pct
KPI_pct_socios_dormidos, KPI_pct_socios_en_riesgo
KPI_pct_acciones_alquiler, KPI_ratio_cuotas_extraordinarias_pct
KPI_indice_endeudamiento_pct, KPI_deuda_neta_ebitda
KPI_pct_gasto_personal_ingresos, KPI_pct_sp_ingresos
KPI_pct_impuestos_ingresos
```

---

## 11. lib/data.ts — funciones principales

```typescript
import data from '@/data/clubmetrics_v2.json'
import type { Club } from '@/types/club'

export const getClub = (id: string) =>
  data.find(c => c.id_club === id) as Club | undefined

export const getSegmento = (club: Club) =>
  `${club.P01_tipo_label} — ${club.tamaño}`

export const getSegmentoClubs = (myClubId: string): Club[] => {
  const myClub = getClub(myClubId)!
  const seg = getSegmento(myClub)
  return (data as Club[]).filter(c => getSegmento(c) === seg && c.id_club !== myClubId)
}

export const getSegmentoStats = (myClubId: string, kpiKey: keyof Club) => {
  const peers = getSegmentoClubs(myClubId)
  const values = peers.map(c => c[kpiKey] as number).filter(v => v != null && !isNaN(v))
  if (values.length < 2) return null
  return {
    promedio: Math.round(values.reduce((a, b) => a + b, 0) / values.length * 10) / 10,
    p25: getPercentile(values, 25),
    p50: getPercentile(values, 50),
    p75: getPercentile(values, 75),
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length,
  }
}

export const getClubPercentil = (myClubId: string, kpiKey: keyof Club, higherIsBetter = true): number => {
  const myClub = getClub(myClubId)!
  const myValue = myClub[kpiKey] as number
  const peers = getSegmentoClubs(myClubId)
  const allValues = [...peers.map(c => c[kpiKey] as number), myValue].sort((a, b) => a - b)
  const rank = allValues.indexOf(myValue)
  const pct = Math.round((rank / Math.max(allValues.length - 1, 1)) * 100)
  return higherIsBetter ? pct : 100 - pct
}

// Cuenta alertas activas (KPIs en rojo) del club
export const getAlertasActivas = (myClubId: string): number => {
  // Lista de KPIs críticos a monitorear
  const kpisMonitoreados = [
    'KPI_churn_rate_pct','KPI_ebitda_margen_pct','KPI_razon_liquidez_corriente',
    'KPI_reserve_funding_ratio_pct','KPI_nps','K01_dso_dias',
    'KPI_rotacion_operativa_pct','KPI_pct_socios_en_riesgo','KPI_deuda_neta_ebitda',
  ]
  let alertas = 0
  kpisMonitoreados.forEach(kpi => {
    const stats = getSegmentoStats(myClubId, kpi as keyof Club)
    if (!stats) return
    const myClub = getClub(myClubId)!
    const value = myClub[kpi as keyof Club] as number
    const sem = getSemaforo(value, stats.p25, stats.p75)
    if (sem === 'rojo') alertas++
  })
  return alertas
}
```

---

## 12. Login de demo

```typescript
// Credenciales hardcodeadas para la demo — no hay auth real
const DEMO_USERS = [
  {
    email: 'demo@clubmetrics.co',
    password: 'clubmetrics2026',
    clubId: 'CLB-005',
    nombre: 'Club Campestre Bucaramanga',
    cargo: 'Gerente General',
  },
  {
    email: 'admin@clubmetrics.co',
    password: 'admin2026',
    clubId: 'CLB-001',
    nombre: 'Club Campestre El Nogal',
    cargo: 'Gerente General',
  },
]
```

---

## 13. Especificaciones componentes UI

### KPICard

```tsx
// Capa 1: Label — Inter Bold 11px MAYÚSCULAS #4A5568 tracking 0.08em
// Capa 2: Valor — Inter Bold 34px #1464A0 (o color semáforo si crítico)
// Capa 3: Comparativo — "▲ 12% vs promedio" Inter Regular 12px verde/rojo
// Capa 4: Semáforo badge — border-radius 20px padding 3px 10px Inter Bold 11px
// Contenedor: border-radius 12px · shadow-sm · padding 20px · bg white · border #D1D9E0
```

### PercentileBar

```tsx
// Barra fondo: #D1D9E0 · h-2 · rounded-full · ancho 100%
// Zona P25-P75: #93C5FD opacity-40
// Marcador "Tu club": círculo 14px · color semáforo · z-10 · tooltip con valor
// Líneas P25/P50/P75: dashed 1px #4A5568 · etiqueta 9px debajo
// Label arriba-izquierda · valor arriba-derecha
```

### BenchmarkTable

```tsx
// Header: fondo #1464A0 · texto blanco · Inter Bold 11px MAYÚSCULAS
// Fila "Tu club ★": fondo #EBF2FA · border-left 3px #1464A0 · Inter SemiBold
// Filas sector: alternas white/#F0F4F8 · etiquetas "Promedio" "P25" "P75" "Club A" "Club B"
// Valores positivos vs promedio: #27AE60 con ▲
// Valores negativos vs promedio: #E74C3C con ▼
// Footer: "Datos anonimizados · Benchmark Sectorial ClubMetrics 2026" · gris 11px
```

### Espaciado (tokens — múltiplos de 4px)

```
xs: 4px · sm: 8px · md: 12px · lg: 16px · xl: 20px · 2xl: 24px · 3xl: 32px · 4xl: 48px
```

### Grid principal

```
12 columnas · gap 24px · max-width 1280px · sidebar fijo 220px
```

---

## 14. Reglas absolutas de anonimización

1. **Nunca** mostrar nombre real de otro club — en tablas, tooltips, gráficas, URLs
2. **Tu club siempre** como "Tu club ★" diferenciado visualmente
3. **Otros clubs:** "Club A", "Club B", "Promedio segmento", "P25", "P75"
4. **IDs anónimos** en JetBrains Mono: `CLB-047`
5. **Badge "🔒 Datos protegidos"** visible en header de cada página
6. **Banner en tablas:** *"Los clubes del sector aparecen con códigos anónimos. Solo tú conoces tu posición."*
7. **Segmento <5 clubs** → no mostrar comparativos, mostrar: *"Tu segmento aún tiene pocos participantes. Te notificamos cuando esté disponible."*

---

## 15. Plan de desarrollo — Demo 2 semanas

```
Día 1:     Setup Next.js + Tailwind + dependencias + estructura de carpetas
Día 2:     Tipos TypeScript + lib/data.ts + lib/benchmark.ts + lib/anonymize.ts
Día 3:     Pantalla de login
Día 4:     Layout con Sidebar (mini KPIs según sección 8)
Día 5-6:   Componentes base: KPICard · PercentileBar · BenchmarkTable · SemaforoTag
Día 7:     Dashboard (Resumen Ejecutivo) — 6 KPI cards + radar diagnóstico
Día 8:     CAP2 (Ingresos) + CAP6 (CAPEX/Reservas) — más impacto en junta directiva
Día 9:     CAP7 (Capital Humano) — donut nómina + scatter rotación/formación
Día 10:    CAP8 (Experiencia) — NPS + segmentación activos/dormidos/riesgo
Día 11:    CAP9 (Solvencia) — radar financiero + tabla comparativa
Día 12:    CAP3 (Tarifas) + CAP4 (Deportes) + CAP5 (OPEX)
Día 13:    Posicionamiento + CAP1 (Perfil) + pulir estilos
Día 14:    Deploy Vercel + testing + ensayo presentación
```

**Módulos no terminados para la demo:** marcar con badge gris "Próximamente" en sidebar — genera expectativa sin mostrar vacíos.

---

## 16. Identidad de marca — resumen

```
Nombre:   ClubMetrics (siempre una sola palabra, C y M en mayúsculas)
Logo:     /public/logo.png — horizontal completo, fondo BLANCO siempre
Isotipo:  /public/logo-icon.png — solo ícono, fondo BLANCO
Email:    clubmetricsbenchmark@gmail.com
Tono:     Analítico · Directo · Confiable · Profesional · Latinoamericano
```

---

## 17. Reglas generales de desarrollo

1. Anonimización primero — antes de renderizar cualquier comparativo
2. Todo KPI comparativo lleva semáforo visual (nunca un número solo)
3. Mostrar siempre: valor del club + promedio segmento + percentil
4. Sin datos = mensaje claro, nunca 0 o null sin explicación
5. Segmento <5 clubs = bloquear con mensaje explicativo
6. Monetario siempre en COP (miles COP o MM COP según magnitud, nunca USD)
7. Responsive mínimo 768px. Mobile es secundario.
8. Inter como única fuente de UI. JetBrains Mono solo para IDs anónimos.
9. Recharts para todas las gráficas (no Chart.js, no D3 directo)
10. No inventar datos — todo calculado desde clubmetrics_v2.json

---

## 18. Recursos del proyecto

| Archivo                                      | Descripción                                  |
| -------------------------------------------- | --------------------------------------------- |
| `CLAUDE.md`                                | Este archivo — fuente de verdad del proyecto |
| `/data/clubmetrics_v2.json`                | 30 clubes sintéticos, 167 variables          |
| `/public/logo.png`                         | Logo horizontal con texto (fondo blanco)      |
| `/public/logo-icon.png`                    | Isotipo solo (fondo blanco)                   |
| `Indicadores_y_Variables_3_v2.xlsx`        | Framework original de indicadores             |
| `Benchmark_Sectorial_Clubes_Colombia.docx` | Documento con los 9 capítulos                |
| `ClubMetrics_Manual_de_Marca.pdf`          | Manual de marca completo con Design System    |

---

*Versión 2.0 · Marzo 2026 · ClubMetrics — Benchmark Clubes Sociales y Deportivos*
