import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedore } from './entities/proveedore.entity';

@Module({
  controllers: [ProveedoresController],
  providers: [ProveedoresService],
  imports: [TypeOrmModule.forFeature([Proveedore])],
  exports: [ProveedoresService]
})
export class ProveedoresModule {}
