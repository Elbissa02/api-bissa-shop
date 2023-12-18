import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { ProveedoresModule } from 'src/proveedores/proveedores.module';
import { VentasModule } from 'src/ventas/ventas.module';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
  imports: [
    TypeOrmModule.forFeature([Producto]),
    ProveedoresModule,
    VentasModule
  ],
  exports: [ProductosService]
})
export class ProductosModule {}
