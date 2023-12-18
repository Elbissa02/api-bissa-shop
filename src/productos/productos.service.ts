import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProveedoresService } from 'src/proveedores/proveedores.service';
import { VentasService } from 'src/ventas/ventas.service';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {

  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly proveedoreService: ProveedoresService,
    private readonly ventaService: VentasService
  ){
    
  }

  async create(createProductoDto: CreateProductoDto) {
    try {
      const { proveedoreDNI, ventasID, ...campos } = createProductoDto;
      //crea la instancia del producto con sus propiedades
      const producto = this.productoRepository.create({...campos});
      const proveedore = await this.proveedoreService.findOne(proveedoreDNI);
      const venta = await this.ventaService.findOne(ventasID);
      producto.proveedore = proveedore;
      producto.ventas = venta;
      // Lo graba e impacta en la BD
      await this.productoRepository.save(producto);
      return producto;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ayuda!')
    }
  }

  findAll() {
    return this.productoRepository.find({});
  }

  findOne(ID: string) {
    return this.productoRepository.findOne({
      where: {
        ID 
      }
    });  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
