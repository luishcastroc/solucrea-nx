import { Frecuencia } from '@prisma/client';
export const defaultFrecuencias = [
  {
    label: 'Diario',
    value: Frecuencia.DIARIO,
    description: 'Pago diario comenzando al día siguiente del préstamo',
  },
  {
    label: 'Semanal',
    value: Frecuencia.SEMANAL,
    description:
      'Pago semanal comenzando el mismo dîa de la semana en el cual se otorgó el préstamo',
  },
  {
    label: 'Quincenal',
    value: Frecuencia.QUINCENAL,
    description:
      'Pago quincenal comenzando el mismo dîa de la semana en el cual se otorgó el préstamo',
  },
  {
    label: 'Mensual',
    value: Frecuencia.MENSUAL,
    description:
      'Pago mensual comenzando el mismo dîa de la semana en el cual se otorgó el préstamo',
  },
  {
    label: 'Bimestral',
    value: Frecuencia.BIMESTRAL,
    description:
      'Pago bimestral comenzando el mismo dîa de la semana en el cual se otorgó el préstamo',
  },
  {
    label: 'Trimestral',
    value: Frecuencia.TRIMESTRAL,
    description:
      'Pago trimestral comenzando el mismo dîa de la semana en el cual se otorgó el préstamo',
  },
  {
    label: 'Cuatrimestral',
    value: Frecuencia.CUATRIMESTRAL,
    description:
      'Pago cuatrimestral comenzando el mismo dîa de la semana en el cual se otorgó el préstamo',
  },
  {
    label: 'Semestral',
    value: Frecuencia.SEMESTRAL,
    description:
      'Pago semestral comenzando el mismo dîa de la semana en el cual se otorgó el préstamo',
  },
  {
    label: 'Anual',
    value: Frecuencia.ANUAL,
    description:
      'Pago anual comenzando el mismo dîa de la semana en el cual se otorgó el préstamo',
  },
];
