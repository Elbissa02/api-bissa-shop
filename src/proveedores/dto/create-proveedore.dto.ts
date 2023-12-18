import { IsString, MinLength } from "class-validator";

export class CreateProveedoreDto {
    @IsString()
    @MinLength(9)
    DNI: string;

    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @MinLength(5)
    direccion: string;

    @IsString()
    @MinLength(8)
    telefono: string;
}
