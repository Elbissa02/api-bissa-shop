import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientesService } from 'src/clientes/clientes.service';
import { Producto } from 'src/productos/entities/producto.entity';
import { Repository } from 'typeorm';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Venta } from './entities/venta.entity';

@Injectable()
export class VentasService {

  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    private readonly clienteService: ClientesService,
  ){
    
  }


  async create(createVentaDto: CreateVentaDto) {
    try {
      const { clienteDNI, ...campos } = createVentaDto;
      //crea la instancia del producto con sus propiedades
      const venta = this.ventaRepository.create({
        ...campos,
      });
      const cliente = await this.clienteService.findOne(clienteDNI);
      venta.cliente = cliente;
      // Lo graba e impacta en la BD
      await this.ventaRepository.save(venta);
      return venta;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ayuda!')
    }
  }

  findAll() {
    return this.ventaRepository.find({});
  }

  findOne(ID: string) {
    return this.ventaRepository.findOne({
      where: {
        ID
      }
    });  }

  update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  remove(id: number) {
    return `This action removes a #${id} venta`;
  }
}
