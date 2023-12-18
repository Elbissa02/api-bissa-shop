import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {
    @IsString()
    @MinLength(1)
    codigo: number;

    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @MinLength(5)
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    website?: string;

   

    @IsString()
    @MinLength(8)
    @IsOptional()
    twitter?: string;
}
