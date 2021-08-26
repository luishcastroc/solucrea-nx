import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
export const curpValidator =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toUpperCase();

        const digitoVerificador = (curp17) => {
            //Fuente https://consultas.curp.gob.mx/CurpSP/
            const diccionario = '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
            let lngSuma = 0.0;
            let lngDigito = 0.0;
            for (let i = 0; i < 17; i++) {
                lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
            }
            lngDigito = 10 - (lngSuma % 10);
            if (lngDigito === 10) {
                return 0;
            }
            return lngDigito;
        };

        const curpValida = (curp) => {
            const re =
                // eslint-disable-next-line max-len
                /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
            const valid = curp.match(re);

            if (!valid) {
                //Coincide con el formato general?
                return false;
            }

            //Validar que coincida el dígito verificador

            if (Number(valid[2]) !== digitoVerificador(valid[1])) {
                return false;
            }

            return true; //valid
        };

        if (!value) {
            return null;
        }

        return !curpValida(value) ? { curp: true } : null;
    };

export const rfcValidator =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toUpperCase();

        const rfcValido = (rfc, aceptarGenerico = true) => {
            const re =
                /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
            const valid = rfc.match(re);

            if (!valid) {
                //Coincide con el formato general del regex?
                return false;
            }

            //Separar el dígito verificador del resto del RFC
            const digitoVerificador = valid.pop();
            const rfcSinDigito = valid.slice(1).join('');
            const len = rfcSinDigito.length;

            //Obtener el digito esperado
            const diccionario = '0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ';
            const indice = len + 1;
            let suma;
            let digitoEsperado;

            if (len === 12) {
                suma = 0;
            } else {
                suma = 481;
            } //Ajuste para persona moral

            for (let i = 0; i < len; i++) {
                suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
            }
            digitoEsperado = 11 - (suma % 11);
            if (digitoEsperado === 11) {
                digitoEsperado = 0;
            } else if (digitoEsperado === 10) {
                digitoEsperado = 'A';
            }

            //El dígito verificador coincide con el esperado?
            // o es un RFC Genérico (ventas a público general)?
            if (
                Number(digitoVerificador) !== digitoEsperado &&
                (!aceptarGenerico || rfcSinDigito + digitoVerificador !== 'XAXX010101000')
            ) {
                return false;
            } else if (!aceptarGenerico && rfcSinDigito + digitoVerificador === 'XEXX010101000') {
                return false;
            }
            return true;
        };

        if (!value) {
            return null;
        }

        return !rfcValido(value) ? { rfc: true } : null;
    };
