export interface IColonias {
    id: string;
    descripcion: string;
    codigoPostal: string;
}

export interface IColoniaReturnDto {
    ciudad: {
        id: number;
        descripcion: string;
    };
    estado: {
        id: number;
        descripcion: string;
    };
    colonias: IColonias[];
}
