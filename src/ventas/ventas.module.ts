import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { ClientesModule } from 'src/clientes/clientes.module';
import { Producto } from 'src/productos/entities/producto.entity';

@Module({
  controllers: [VentasController],
  providers: [VentasService],
  imports: [
    TypeOrmModule.forFeature([Venta]),
    ClientesModule
  ],
  exports: [VentasService]
})
export class VentasModule {}
