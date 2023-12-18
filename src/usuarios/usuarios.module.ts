import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientesModule } from 'src/clientes/clientes.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, JwtStrategy],
  imports: [ 
    // ClientesModule,
    ConfigModule,
    TypeOrmModule.forFeature( [ Usuario ]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => {
        console.log ('JWT Secret --> ', configService.get('JWT_SECRET'));
        // console.log ('JWT: ', process.env.JWT_SECRET);
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
              expiresIn: '2h'
          }
        }
      }
    })
  ],
  exports: [ TypeOrmModule, UsuariosService, JwtStrategy, PassportModule, JwtModule ]
})
export class UsuariosModule {}
