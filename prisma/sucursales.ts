/* eslint-disable @typescript-eslint/naming-convention */
import { Prisma, PrismaClient, TipoDireccion } from '@prisma/client';

export interface IDireccion {
    calle: string;
    numero: string;
    cruzamientos: string;
    codigoPostal: string;
    colonia: string;
}

export interface ICreateSucursalDto {
    nombre: string;
    telefono: string;
    direccion: IDireccion;
}

const prisma = new PrismaClient();

export const createSucursal = async (sucursal: ICreateSucursalDto): Promise<Prisma.SucursalCreateInput | null> => {
    const { nombre, telefono, direccion: direccionIn } = sucursal;
    const colonia = await prisma.colonia.findFirstOrThrow({
        where: { codigoPostal: direccionIn.codigoPostal, descripcion: direccionIn.colonia },
    });
    if (colonia) {
        const direccion: Prisma.DireccionCreateNestedOneWithoutSucursalesInput = {
            create: {
                tipo: TipoDireccion.SUCURSAL,
                calle: direccionIn.calle,
                numero: direccionIn.numero,
                cruzamientos: direccionIn.cruzamientos,
                colonia: { connect: { id: colonia.id } },
                creadoPor: 'ADMIN',
            },
        };
        const sucursalReturn: Prisma.SucursalCreateInput = {
            nombre,
            telefono,
            direccion,
        };

        return Promise.resolve(sucursalReturn);
    }
    return Promise.resolve(null);
};
