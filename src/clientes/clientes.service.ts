import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly usuarioService: UsuariosService
  ){
    
  }

  // async create(createClienteDto: CreateClienteDto) {
  //   try {
  //     const { usuarioCodigo, ...campos } = createClienteDto;
  //     //crea la instancia del producto con sus propiedades
  //     const usuario = await this.usuarioService.findOne(usuarioCodigo);
  //     const cliente = this.clienteRepository.create({...campos});
  //     cliente.usuario = usuario;
  //     // Lo graba e impacta en la BD
  //     await this.clienteRepository.save(cliente);
  //     return cliente;
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException('Ayuda!')
  //   }
  //  }

  async create(createClienteDto: CreateClienteDto) {
    try {
      const { usuarioId, ...campos } = createClienteDto;
      const usuario = await this.usuarioService.findOne(usuarioId);
      
      
      const cliente = this.clienteRepository.create({ ...campos });
      cliente.usuario = usuario;
  
      await this.clienteRepository.save(cliente);
      return cliente;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ayuda!');
    }
  }
  

  findAll() {
    return this.clienteRepository.find({});
  }

  findOne(DNI: string) {
    return this.clienteRepository.findOne({
      where: {
        DNI
      }
    });
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }
}
