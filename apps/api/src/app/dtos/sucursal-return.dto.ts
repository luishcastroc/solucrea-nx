import { IDireccionesReturnDto } from '.';

export interface ISucursalReturnDto {
    id: string;
    nombre: string;
    telefono: string;
    direccion: IDireccionesReturnDto;
}
