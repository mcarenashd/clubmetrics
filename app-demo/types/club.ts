export type Club = {
  // Identidad
  id_club: string
  nombre_club: string

  // CAP1 — Perfil Estructural
  P01_tipo_club: string
  P01_tipo_label: string
  P11_año_fundacion: number
  P12_ciudad: string
  P13_departamento: string
  P14_modelo_negocio: string
  P14_modelo_label: string
  tamaño: string
  D01_sedes: number
  D02_area_terreno_m2: number
  D03_area_construida_m2: number
  C01_socios_titulares: number
  C02_comunidad_total: number
  C03_ingresos_mens_prom: number
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
  P10_tiene_sindicato: number

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

  // CAP5 — Infraestructura y Deportes
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
  S16_canchas_squash: number
  S19_salas_video: number
  S20_parques_ninos: number
  S33_hoyos_golf: number
  S34_mesas_billar: number
  S36_salones: number
  S37_torneos_eventos_total: number
  S38_salones_comedor: number
  S39_bares: number
  S40_cafeterias: number
  S41_km_ciclovia: number
  S42_maquinas_gym: number
  S43_ocupacion_golf_pct: number
  S25_vestier_h: number
  S26_vestier_m: number
  S28_saunas: number

  // CAP6 — CAPEX y Reservas (MM COP)
  CAP6_fondo_reserva_COP_MM: number
  CAP6_deuda_total_COP_MM: number
  CAP6_efectivo_COP_MM: number

  // CAP7 — Nómina
  N01_nom_estrategico_COP_miles_mes: number
  N02_nom_ab_COP_miles_mes: number
  N03_nom_deportivo_COP_miles_mes: number
  N04_nom_soporte_COP_miles_mes: number
  N05_emp_estrategico_cant: number
  N06_emp_ab_cant: number
  N07_emp_deportivo_indef_cant: number
  N08_emp_deportivo_otra_cant: number
  N09_emp_tenis_golf_indef_cant: number
  N10_emp_deportivo_otra2_cant: number
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

  // KPIs derivados — pre-calculados en el JSON
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
  KPI_servicios_por_comunidad: number
  KPI_ratio_maquinas_socio: number
  KPI_pct_gasto_personal_ingresos: number
  KPI_pct_sp_ingresos: number
  KPI_pct_impuestos_ingresos: number
  KPI_pct_mant_ingresos: number
  KPI_pct_mant_preventivo: number
  KPI_pct_inventario_ingresos: number
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
  KPI_pct_socios_activos: number
  KPI_pct_socios_dormidos: number
  KPI_pct_socios_en_riesgo: number
  KPI_tasa_retencion_anual_pct: number
  KPI_pct_acciones_alquiler: number
  KPI_visitas_promedio_mes: number
  KPI_indice_activacion_nuevos_pct: number
  KPI_razon_liquidez_corriente: number
  KPI_prueba_acida: number
  KPI_indice_endeudamiento_pct: number
  KPI_cobertura_intereses: number
  KPI_deuda_neta_ebitda: number
}

export type Semaforo = 'verde' | 'ambar' | 'rojo' | 'gris'

export type SegmentoStats = {
  promedio: number
  p25: number
  p50: number
  p75: number
  min: number
  max: number
  count: number
}

export type DemoUser = {
  email: string
  password: string
  clubId: string
  nombre: string
  cargo: string
}
