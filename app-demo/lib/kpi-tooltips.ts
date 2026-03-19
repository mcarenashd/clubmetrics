/**
 * Diccionario de tooltips explicativos para cada indicador del benchmark.
 * Cada entrada tiene:
 * - desc: Qué mide el indicador (1 línea clara)
 * - ref: Referencia sectorial o regla de lectura
 * - icon: Emoji opcional para dar contexto visual rápido
 */

export type KpiTooltip = {
  desc: string
  ref: string
  icon?: string
}

export const KPI_TOOLTIPS: Record<string, KpiTooltip> = {
  // ── CAP1: Perfil Estructural ──
  KPI_indice_cupo_pct: {
    desc: 'Porcentaje de acciones ocupadas por socios activos. Mide qué tan lleno está el club.',
    ref: '>90% = posible lista de espera. <80% = capacidad ociosa.',
    icon: '📊',
  },
  C01_socios_titulares: {
    desc: 'Número de socios titulares que pagan cuota de sostenimiento.',
    ref: 'Dato estructural del club. Denominador de muchos ratios.',
    icon: '👥',
  },
  C02_comunidad_total: {
    desc: 'Incluye titulares + beneficiarios + dependientes. Es la población real que usa el club.',
    ref: 'Generalmente 2x-3.5x los socios titulares.',
    icon: '👨‍👩‍👧‍👦',
  },
  C04_acciones_totales_emitidas: {
    desc: 'Acciones emitidas por el club, estén o no en manos de un socio activo.',
    ref: 'Si hay muchas acciones sin socio = oportunidad de captación o acción en alquiler.',
    icon: '📜',
  },

  // ── CAP2: Ingresos y Membresías ──
  KPI_arpu_mensual_COP_miles: {
    desc: 'Ingreso promedio mensual que genera cada socio titular (cuotas + consumos + eventos).',
    ref: '>$500K COP = eficiente para club mediano. >$800K = club premium.',
    icon: '💰',
  },
  KPI_churn_rate_pct: {
    desc: 'Porcentaje de socios que se retiraron en el último año. Menor es mejor.',
    ref: '<3% = óptimo. 3-5% = aceptable. >5% = alerta crítica.',
    icon: '📉',
  },
  KPI_depend_cuotas_pct: {
    desc: 'Qué porcentaje de los ingresos totales viene de cuotas de sostenimiento.',
    ref: '>70% = alta dependencia (riesgo si bajan socios). Ideal: diversificar fuentes.',
    icon: '⚖️',
  },
  KPI_yield_transferencia_pct: {
    desc: 'Precio de mercado de la acción vs su valor nominal. Mide demanda de membresía.',
    ref: '>100% = acción valorizada. <90% = presión bajista, posible fuga de socios.',
    icon: '📈',
  },
  KPI_ratio_depend_cuotas: {
    desc: 'Cuotas de sostenimiento divididas entre gastos operativos. ¿Las cuotas cubren el costo de operar?',
    ref: '>1.0x = las cuotas cubren la operación. <0.8x = el club depende de otros ingresos para sobrevivir.',
    icon: '🔢',
  },
  P06_valor_accion_COP_miles: {
    desc: 'Precio de venta de una acción del club en el mercado.',
    ref: 'Varía por tipo de club. Campestre grande: $50M-$250M COP. Ciudad pequeño: $6M-$30M COP.',
    icon: '🏷️',
  },
  KPI_margen_ab_pct: {
    desc: 'Rentabilidad del negocio de Alimentos y Bebidas (restaurante, bar, catering).',
    ref: '>30% = eficiente. <20% = revisar modelo gastronómico y control de inventarios.',
    icon: '🍽️',
  },

  // ── CAP3: Tarifas y Márgenes ──
  KPI_margen_contribucion_restaurante_pct: {
    desc: 'Margen de contribución del restaurante después de costos directos.',
    ref: '>25% = saludable. <20% = posible subsidio cruzado con cuotas.',
    icon: '🍴',
  },
  KPI_margen_contribucion_eventos_pct: {
    desc: 'Rentabilidad de la línea de eventos y banquetes.',
    ref: '>35% = muy rentable. <25% = revisar estructura de precios.',
    icon: '🎉',
  },
  KPI_margen_contribucion_deportes_pct: {
    desc: 'Rentabilidad de la operación deportiva (canchas, clases, torneos).',
    ref: '>30% = buen negocio. <20% = más amenidad que negocio.',
    icon: '⚽',
  },
  KPI_servicios_por_comunidad: {
    desc: 'Cantidad de servicios y amenidades por cada 1.000 miembros de la comunidad.',
    ref: 'Mayor = oferta más completa. Útil para medir amplitud de la propuesta de valor.',
    icon: '🏊',
  },
  T01_cuota_sostenimiento_COP_miles: {
    desc: 'Cuota mensual de sostenimiento sin IVA que paga cada socio titular.',
    ref: 'Comparar contra clubes del mismo tipo y tamaño para evaluar competitividad.',
    icon: '💳',
  },

  // ── CAP4: Deportes e Infraestructura ──
  S05_ocupacion_tenis_pct: {
    desc: 'Porcentaje de horas disponibles de canchas de tenis que realmente se usan.',
    ref: '>65% = buena demanda. <40% = subutilizado, revisar programación y horarios.',
    icon: '🎾',
  },
  S43_ocupacion_golf_pct: {
    desc: 'Ocupación del campo de golf medida por rounds jugados vs capacidad.',
    ref: '>60% = buena utilización. <40% = revisar tarifas y programas de fidelización.',
    icon: '⛳',
  },
  S12_ocupacion_piscina_pct: {
    desc: 'Ocupación promedio de las piscinas del club.',
    ref: '>60% = alta demanda. Considerar ampliar horarios o capacidad si supera 80%.',
    icon: '🏊',
  },
  KPI_socios_por_cancha_tenis: {
    desc: 'Cuántos socios hay por cada cancha de tenis. Mide presión sobre el recurso.',
    ref: '<100 = holgura. 100-200 = adecuado. >200 = posible saturación.',
    icon: '🎾',
  },
  KPI_ratio_maquinas_socio: {
    desc: 'Máquinas de gimnasio disponibles por socio. Mide capacidad del gym.',
    ref: '1 máquina por cada 80-120 socios en club premium. <1:150 = congestionado.',
    icon: '🏋️',
  },
  S37_torneos_eventos_total: {
    desc: 'Total de torneos y eventos deportivos organizados en el año.',
    ref: 'Mayor actividad deportiva = mayor retención de socios y sentido de comunidad.',
    icon: '🏆',
  },

  // ── CAP5: OPEX y Costos ──
  KPI_pct_gasto_personal_ingresos: {
    desc: 'Qué porcentaje de los ingresos se va en nómina y personal.',
    ref: '40-55% = rango normal. >55% = club posiblemente sobredotado.',
    icon: '👷',
  },
  KPI_pct_sp_ingresos: {
    desc: 'Servicios públicos (agua, luz, gas) como porcentaje de los ingresos.',
    ref: '8-15% según tipo de club. Campestres con riego = más alto.',
    icon: '💡',
  },
  KPI_pct_impuestos_ingresos: {
    desc: 'Predial e impuestos locales como porcentaje de los ingresos.',
    ref: '4-8% es el rango típico. Campestres con terreno grande = más alto.',
    icon: '🏛️',
  },
  KPI_pct_mant_ingresos: {
    desc: 'Gasto en mantenimiento de infraestructura como porcentaje de ingresos.',
    ref: '7-12% = inversión adecuada. <5% = posible deterioro de instalaciones.',
    icon: '🔧',
  },
  KPI_pct_mant_preventivo: {
    desc: 'Qué porcentaje del mantenimiento es preventivo vs correctivo.',
    ref: '>60% preventivo = gestión proactiva. <40% = se repara cuando se rompe.',
    icon: '🛡️',
  },
  KPI_gasto_sp_m2_COP: {
    desc: 'Gasto en servicios públicos por metro cuadrado construido.',
    ref: 'Útil para comparar eficiencia energética entre clubes de tamaño similar.',
    icon: '⚡',
  },
  KPI_costo_mant_m2_COP: {
    desc: 'Costo de mantenimiento por metro cuadrado construido.',
    ref: 'Menor = más eficiente. Comparar solo contra clubes con infraestructura similar.',
    icon: '🏗️',
  },
  K01_dso_dias: {
    desc: 'Días promedio que tarda el club en cobrar lo que le deben los socios.',
    ref: '<30 días = excelente. 30-45 = aceptable. >45 = alerta de cartera morosa.',
    icon: '📅',
  },
  KPI_pct_inventario_ingresos: {
    desc: 'Inventarios (principalmente A&B) como porcentaje de los ingresos.',
    ref: '3-6% = rango normal. >6% = posible sobre-stock o merma alta.',
    icon: '📦',
  },

  // ── CAP6: CAPEX y Reservas ──
  KPI_reinversion_capex_pct: {
    desc: 'Porcentaje de los ingresos que se invierte en mejoras de infraestructura.',
    ref: '>5% = club que invierte en su futuro. <3% = acumula deuda invisible de mantenimiento.',
    icon: '🏗️',
  },
  KPI_reserve_funding_ratio_pct: {
    desc: 'Qué tan fondeado está el fondo de reserva vs la deuda total.',
    ref: '>70% = club resiliente. <50% = consume patrimonio futuro de los socios.',
    icon: '🏦',
  },
  KPI_dias_reserva_capital: {
    desc: 'Cuántos días podría operar el club solo con su fondo de reserva.',
    ref: '>60 días = colchón mínimo. >120 días = muy bien fondeado.',
    icon: '⏳',
  },
  KPI_relacion_reserva_deuda: {
    desc: 'Fondo de reserva dividido entre deuda total. Mide capacidad de respaldo.',
    ref: '>0.5 = reserva cubre la mitad de la deuda. <0.2 = altamente expuesto.',
    icon: '⚖️',
  },
  KPI_tasa_reinversion_capex: {
    desc: 'CAPEX dividido entre EBITDA. Cuánto de lo que genera se reinvierte.',
    ref: '0.3-0.5x = equilibrado. >1.0x = invierte más de lo que genera (requiere deuda).',
    icon: '🔄',
  },
  KPI_pct_cuota_reserva: {
    desc: 'Porcentaje de la cuota que se destina al fondo de reserva.',
    ref: '>5% = política sana. <3% = el club no ahorra para el futuro.',
    icon: '💰',
  },
  KPI_ratio_cuotas_extraordinarias_pct: {
    desc: 'Cuotas extraordinarias como porcentaje de los ingresos recurrentes.',
    ref: '<10% = bien planificado. >20% = posible mala planificación financiera.',
    icon: '⚠️',
  },

  // ── CAP7: Capital Humano ──
  KPI_ratio_emp_socio: {
    desc: 'Empleados totales dividido entre socios titulares. Menor = más eficiente.',
    ref: '1 empleado por cada 8-15 socios según tipo. >0.25 = posiblemente sobredotado.',
    icon: '👥',
  },
  KPI_nom_por_socio_COP_miles: {
    desc: 'Costo mensual de nómina total dividido entre número de socios.',
    ref: 'Útil para comparar la carga laboral por socio entre clubes del mismo segmento.',
    icon: '💼',
  },
  KPI_ingreso_por_COP_nom: {
    desc: 'Por cada peso invertido en nómina, cuántos pesos de ingreso genera el club.',
    ref: '>3x = eficiente. <2.5x = la nómina consume demasiado del ingreso.',
    icon: '📊',
  },
  KPI_rotacion_operativa_pct: {
    desc: 'Porcentaje de personal operativo que rota (se va) al año. Menor es mejor.',
    ref: '<20% = estable. >35% = alta rotación, impacta calidad del servicio y NPS.',
    icon: '🔄',
  },
  KPI_rotacion_administrativa_pct: {
    desc: 'Rotación del personal administrativo al año. Menor es mejor.',
    ref: '<10% = estable. >20% = problemas de clima laboral o competitividad salarial.',
    icon: '🔄',
  },
  KPI_horas_formacion_emp_año: {
    desc: 'Horas de capacitación promedio por empleado al año.',
    ref: '>20h = inversión en talento. <12h = mínimo, posible impacto en servicio.',
    icon: '🎓',
  },
  KPI_pct_personal_frontoffice: {
    desc: 'Porcentaje del personal dedicado a atención directa al socio.',
    ref: '>55% = orientado al servicio. <50% = posible exceso de burocracia.',
    icon: '🤝',
  },
  KPI_pct_personal_deportes: {
    desc: 'Porcentaje del personal dedicado al área deportiva y recreativa.',
    ref: '15-25% es el rango típico. Varía según si el club es deportivo o social.',
    icon: '🏃',
  },
  KPI_pct_sindicalizados: {
    desc: 'Porcentaje de empleados sindicalizados. Solo aplica si el club tiene sindicato.',
    ref: 'Dato sensible. Clubes con sindicato suelen tener mayor costo laboral fijo.',
    icon: '✊',
  },

  // ── CAP8: Experiencia del Socio ──
  KPI_nps: {
    desc: 'Net Promoter Score: probabilidad de que un socio recomiende el club (escala -100 a 100).',
    ref: '>40 = excelente. 20-40 = bueno. <20 = alerta crítica.',
    icon: '⭐',
  },
  KPI_satisfaccion: {
    desc: 'Satisfacción general del socio en escala de 1 a 5.',
    ref: '>4.0 = muy satisfechos. <3.5 = requiere acción inmediata.',
    icon: '😊',
  },
  KPI_pct_socios_activos: {
    desc: 'Socios que visitan el club al menos 1 vez al mes.',
    ref: '>65% = base activa saludable. <55% = muchos socios no usan el club.',
    icon: '✅',
  },
  KPI_pct_socios_dormidos: {
    desc: 'Socios que visitan menos de 1 vez al mes. Son ingresos en riesgo.',
    ref: '<25% = aceptable. >30% = espiral descendente de ingresos.',
    icon: '😴',
  },
  KPI_pct_socios_en_riesgo: {
    desc: 'Socios cuya frecuencia de visita cayó más de 50%. Próximos a retirarse.',
    ref: '<10% = normal. >15% = activar campaña de retención urgente.',
    icon: '🚨',
  },
  KPI_tasa_retencion_anual_pct: {
    desc: 'Porcentaje de socios que permanecen en el club de un año al siguiente.',
    ref: '>95% = excelente. <90% = pérdida significativa de base.',
    icon: '🔒',
  },
  KPI_pct_acciones_alquiler: {
    desc: 'Acciones que están en modalidad de alquiler (socios económicamente dormidos).',
    ref: '<8% = normal. >12% = señal de desinterés generalizado en la membresía.',
    icon: '🔑',
  },
  KPI_visitas_promedio_mes: {
    desc: 'Visitas promedio al club por socio por mes.',
    ref: '>4 visitas = muy activo. <3 = baja vinculación, riesgo de churn.',
    icon: '🚶',
  },
  KPI_indice_activacion_nuevos_pct: {
    desc: 'Porcentaje de socios nuevos que visitan más de 2 veces en su primer mes.',
    ref: '>60% = buena incorporación. <40% = falla en el onboarding del socio.',
    icon: '🆕',
  },

  // ── CAP9: Solvencia Financiera ──
  KPI_ebitda_margen_pct: {
    desc: 'Utilidad operativa (EBITDA) como porcentaje de los ingresos. Mide rentabilidad.',
    ref: '8-18% = normal para club sin hotel. >25% = excepcional.',
    icon: '📊',
  },
  KPI_razon_liquidez_corriente: {
    desc: 'Activo corriente / pasivo corriente. ¿Puede el club pagar sus deudas de corto plazo?',
    ref: '>1.5x = holgura financiera. <1.0x = riesgo de iliquidez.',
    icon: '💧',
  },
  KPI_prueba_acida: {
    desc: 'Como la liquidez corriente pero sin contar inventarios. Más conservadora.',
    ref: '>0.8x = saludable. <0.6x = dependencia excesiva del inventario.',
    icon: '🧪',
  },
  KPI_indice_endeudamiento_pct: {
    desc: 'Pasivos totales divididos entre activos totales. Menor es mejor.',
    ref: '<30% = bajo endeudamiento. >50% = alto riesgo financiero.',
    icon: '📉',
  },
  KPI_cobertura_intereses: {
    desc: 'EBITDA dividido entre gastos financieros. ¿Cuántas veces puede pagar sus intereses?',
    ref: '>4x = cómodo. 2-4x = ajustado. <2x = estrés financiero.',
    icon: '🛡️',
  },
  KPI_deuda_neta_ebitda: {
    desc: 'Deuda neta (deuda total - efectivo) dividida entre EBITDA. Años para pagar la deuda.',
    ref: '<2x = saludable. 2-3.5x = monitorear. >3.5x = insostenible.',
    icon: '⏰',
  },

  // ── Otros / Infraestructura ──
  KPI_venta_silla_mes_COP_miles: {
    desc: 'Ingreso mensual promedio por silla de restaurante. Mide productividad gastronómica.',
    ref: '>$500K = buen rendimiento. <$200K = baja rotación o precios muy bajos.',
    icon: '🪑',
  },
  KPI_salario_minimo_smlv: {
    desc: 'Salario mínimo pagado por el club expresado en SMLV.',
    ref: '1.0 SMLV = mínimo legal. >1.3 SMLV = política salarial competitiva.',
    icon: '💵',
  },
}

/**
 * Obtiene el tooltip de un KPI. Retorna undefined si no existe.
 */
export function getKpiTooltip(key: string): KpiTooltip | undefined {
  return KPI_TOOLTIPS[key]
}
