import { IsString, MinLength } from "class-validator";

export class CreateClienteDto {
    @IsString()
    @MinLength(9)
    DNI: string;

    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @MinLength(1)
    apellido: string;

    @IsString()
    @MinLength(5)
    direccion: string;

    @IsString()
    @MinLength(8)
    telefono: string;

    @IsString()
    @MinLength(1)
    usuarioId: number;
}
