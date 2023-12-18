import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService],
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    UsuariosModule
  ],
  exports: [ClientesService]
})
export class ClientesModule {}
