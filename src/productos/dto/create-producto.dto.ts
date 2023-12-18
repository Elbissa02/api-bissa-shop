import { IsString, MinLength } from "class-validator";

export class CreateProductoDto {
    @IsString()
    @MinLength(1)
    ID: string;

    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @MinLength(1)
    stock: string;

    @IsString()
    @MinLength(1)
    precio: string;

    @IsString()
    proveedoreDNI: string;

    @IsString()
    ventasID: string;
}
