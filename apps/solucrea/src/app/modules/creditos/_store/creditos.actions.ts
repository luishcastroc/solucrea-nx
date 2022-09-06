import { IClienteReturnDto } from 'api/dtos';
import { Prisma, Status } from '@prisma/client';
import { EditMode } from 'app/core/models';

export class GetAllCreditos {
    static readonly type = '[Creditos] Get All';
    constructor(public status: Status) {}
}

export class GetAllCreditosCliente {
    static readonly type = '[Creditos Cliente] Get All';
    constructor(public id: string | null, public status: Status) {}
}

export class ModeCredito {
    static readonly type = '[Creditos] Edit Mode';
    constructor(public payload: EditMode) {}
}

export class GetCreditosConfiguration {
    static readonly type = '[Creditos] Get Creditos Config';
}

export class ClearCreditosState {
    static readonly type = '[Creditos] Clear State';
}

export class ClearCreditosDetails {
    static readonly type = '[Creditos] Clear Details State';
}

export class GetClientesCount {
    static readonly type = '[Creditos] Get Clientes Count';
}

export class GetCreditosCount {
    static readonly type = '[Creditos] Get Creditos Count';
    constructor(public id: string | null) {}
}

export class GetTurnosCount {
    static readonly type = '[Creditos] Get Turnos Count';
}

export class GetClienteData {
    static readonly type = '[Creditos] Get Cliente Data';
    constructor(public id: string) {}
}

export class GetClienteWhere {
    static readonly type = '[Creditos] Get Cliente Where';
    constructor(public data: string) {}
}

export class SelectCliente {
    static readonly type = '[Creditos] Select Cliente';
    constructor(public cliente: IClienteReturnDto | undefined) {}
}

export class SelectClienteReferral {
    static readonly type = '[Creditos] Select Cliente Referral';
    constructor(public cliente: IClienteReturnDto) {}
}

export class SelectProducto {
    static readonly type = '[Creditos] Select Producto';
    constructor(public clienteId: string | null, public productId: string | null) {}
}

export class SelectParentesco {
    static readonly type = '[Creditos] Select Parentesco';
    constructor(public id: string) {}
}

export class SelectModalidadSeguro {
    static readonly type = '[Creditos] Select Modalidad de Seguro';
    constructor(public id: string) {}
}

export class SelectSeguro {
    static readonly type = '[Creditos] Select Seguro';
    constructor(public id: string) {}
}

export class SelectCredito {
    static readonly type = '[Creditos] Select Crédito';
    constructor(public id: string) {}
}

export class GetSucursalesWhereCaja {
    static readonly type = '[Creditos] Get Sucursales Where Caja';
    constructor(public minAmount: number, public maxAmount: number) {}
}

export class CreateCredito {
    static readonly type = '[Credito] Create Credito';
    constructor(public data: Prisma.CreditoCreateInput) {}
}

export class SavePago {
    static readonly type = '[Credito] Save Pago';
    constructor(public data: Prisma.PagoCreateInput) {}
}
