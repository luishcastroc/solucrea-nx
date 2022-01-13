export interface ICreditoData {
    tasaInteres: number;
    interesMoratorio: number;
    monto: number;
    montoSeguro?: number;
    cargos: number;
    numeroDePagos: number;
    comisionPorApertura: number;
    modalidadSeguro: 'diferido' | 'contado' | 'sin seguro';
}
