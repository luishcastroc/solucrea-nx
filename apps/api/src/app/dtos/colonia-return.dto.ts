export interface IColoniaReturnDto {
    id: string;
    descripcion: string;
    codigoPostal: string;
    ciudad: {
        id: number;
        descripcion: string;
        estado: {
            id: number;
            descripcion: string;
        };
    };
}
