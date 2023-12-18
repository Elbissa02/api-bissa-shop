import { IsString, MinLength } from "class-validator";

export class CreateVentaDto {
    @IsString()
    @MinLength(1)
    ID: string;

    @IsString()
    @MinLength(1)
    fecha: string;

    @IsString()
    @MinLength(1)
    precio: string;

    @IsString()
    clienteDNI: string;
}
