import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { Usuario } from "../entities/usuario.entity";
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor (
        @InjectRepository (Usuario)
        private readonly userRepository: Repository<Usuario>,
        configService: ConfigService 
    ){
        //llamamos al constructor del padre
        super({
            secretOrKey: configService.get('JWT_SECRET'),            
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            //el token lo mandamos como un parametro 'token' del la seccion 'auth' de la request
            // y  de tipo 'Bearer Token' 
        })
    }

    async validate ( payload: JwtPayload ): Promise<Usuario>{
        const { email } = payload;
        const user = await this.userRepository.findOneBy({ email });

        if (!user )
            throw new UnauthorizedException('Token no valido');
        
        if (!user.isActive ) //existe pero no activo
            throw new UnauthorizedException('usuario no activo');
        
        //si pasa validate --> el user se añade a la REQUEST 
        //y el usuario estára disponible en todos los lados del proceso de esta petición
        //usaremos DECORADORES personalizados para extraer el usuario REGISTRADO de la REQUEST
        return user;
    }

}