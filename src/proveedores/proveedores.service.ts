import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
import { Proveedore } from './entities/proveedore.entity';

@Injectable()
export class ProveedoresService {


  constructor(
    @InjectRepository(Proveedore)
    private readonly proveedoreRepository: Repository<Proveedore>
  ){
    
  }

  async create(createProveedoreDto: CreateProveedoreDto) {
    try {
      //crea la instancia del producto con sus propiedades
      const proveedore = this.proveedoreRepository.create(createProveedoreDto);
      // Lo graba e impacta en la BD
      await this.proveedoreRepository.save(proveedore);
      return proveedore;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ayuda!')
    }
  }

  findAll() {
    return this.proveedoreRepository.find({});
  }

  findOne(DNI: string) {
    return this.proveedoreRepository.findOne({
      where: {
        DNI
      }
    });  }

  update(id: number, updateProveedoreDto: UpdateProveedoreDto) {
    return `This action updates a #${id} proveedore`;
  }

  remove(id: number) {
    return `This action removes a #${id} proveedore`;
  }
}
