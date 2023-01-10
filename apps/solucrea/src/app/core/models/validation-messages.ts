import { ValidationErrors } from '@angular/forms';

export const validationMessages: ValidationErrors = {
  required: 'Campo Requerido',
  minlength: 'Valor muy pequeño',
  maxlength: 'Valor muy grande',
  pattern: 'Entrada Prohibida',
  email: 'Entrada Inválida',
  date: 'Fecha Inválida',
  curp: 'Curp Inválido',
  rfc: 'RFC Inválido',
};
