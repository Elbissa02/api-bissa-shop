// import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreateUsuarioDto } from './dto/create-usuario.dto';
// import { UpdateUsuarioDto } from './dto/update-usuario.dto';
// import { Usuario } from './entities/usuario.entity';
// import { LoginUserDto } from './dto/login.dto.ts';
// import { ClientesService } from 'src/clientes/clientes.service';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class UsuariosService {

//   constructor(
//     @InjectRepository(Usuario)
//     private readonly usuarioRepository: Repository<Usuario>,
//     private readonly clienteService: ClientesService,
//     private readonly jwtService: JwtService
//    ){
    
//   }

  
//   async login( loginUserDto: LoginUserDto ){
//     try {
//       // buscamos el usuario del email
//       const { email, password } = loginUserDto;
//       const user = await this.usuarioRepository.findOne({ 
//         where: { email },
//       select: { email: true, password: true }
//        });

//       if ( !user ) 
//         throw new UnauthorizedException ('Credenciales no válcodigoas (email)');

//       //comparamos las contraseñas 
//       if (!bcrypt.compareSync( password, user.password ))
//         throw new UnauthorizedException('Credenciales no válcodigoas (email)')
      
//       return {
//         user: { ...user }, 
//         token: this.getJwtToken({ email: user.email })
//       }
      
//     } catch (error) {
//       this.handleDBErrors(error)
//     }
//   }
//   handleDBErrors(error: any) {
//     throw new Error('Method not implemented.');
//   }
//   getJwtToken(arg0: { email: string; }) {
//     throw new Error('Method not implemented.');
//   }

//   async create(createUsuarioDto: CreateUsuarioDto) {
//     try {
//       //crea la instancia del producto con sus propiedades
//       const usuario = this.usuarioRepository.create(createUsuarioDto);
//       // Lo graba e impacta en la BD
//       await this.usuarioRepository.save(usuario);
//       return usuario;
//     } catch (error) {
//       console.log(error);
//       throw new InternalServerErrorException('Ayuda!')
//     }
//   }

//   findAll() {
//     return this.usuarioRepository.find({});
//   }

//   findOne(codigo: string) {
//     return this.usuarioRepository.findOne({
//       where: {
//         codigo
//       }
//     });  
//   }

//   update(codigo: number, updateUsuarioDto: UpdateUsuarioDto) {
//     return `This action updates a #${codigo} usuario`;
//   }

//   remove(codigo: number) {
//     return `This action removes a #${codigo} usuario`;
//   }
// }



import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Cliente } from '../clientes/entities/cliente.entity';
import { ClientesService } from '../clientes/clientes.service';
import { LoginUserDto } from './dto/login.dto.ts';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
@Injectable()
export class UsuariosService {
  constructor(
    private readonly dataSource: DataSource,


    @InjectRepository(Usuario)
    private readonly UsuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService
  ){}

  // remove(arg0: number) {
  //   throw new Error('Method not implemented.');
  // }

  async remove(codigo: number) {
    const usuario = await this.findOne(+codigo);
    await this.UsuarioRepository.remove(usuario)
  }

  // update(arg0: number, updateUsuarioDto: UpdateUsuarioDto) {
  //   throw new Error('Method not implemented.');
  // }

  async update(codigo: number, updateAuthDto: UpdateUsuarioDto) {
    const { ...rest } = updateAuthDto;
    const usuario = await this.UsuarioRepository.preload({
      codigo,
      ...rest
    });

    if(!usuario) throw new NotFoundException(`Usuario con código ${codigo} no encontrado`);

    //crear Query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //guardamos la info del usuario pero NO SE GUARDA EN LA BD
      await queryRunner.manager.save(usuario);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      // return (usuario)
      return this.findOne(+codigo);
    }
    catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBErrors(error)
    }
  }

  findOne(codigo: number) {
     return this.UsuarioRepository.findOne({
      where: {
       codigo
       }
     });  
    }
  // findAll() {
  //   throw new Error('Method not implemented.');
  // }
  
  findAll() {
    return this.UsuarioRepository.find({
    });
  }

  async login( loginUserDto: LoginUserDto ){
    try {
      // buscamos el usuario del email
      const { email, password } = loginUserDto;
      const user = await this.UsuarioRepository.findOne({ 
        where: { email },
        select: { email: true, password: true }
       });

      if ( !user ) 
        throw new UnauthorizedException ('Credenciales no válcodigoas (email)');

      //comparamos las contraseñas 
      if (!bcrypt.compareSync( password, user.password ))
        throw new UnauthorizedException('Credenciales no válcodigoas (email)')
      
      return {
        user: { ...user }, 
        token: this.getJwtToken({ email: user.email })
      }
      
    } catch (error) {
      this.handleDBErrors(error)
    }
  }
  async create(createUserDto: CreateUsuarioDto) {
    try {
      console.log("INsertando usuario: ",createUserDto);
      const { password, ...userData } = createUserDto;
      // const cliente = await this.clientesService.findOne(createUserDto.nif);
      // console.log(cliente);
      const user = this.UsuarioRepository.create({
        ...userData,
        website: "http", twitter: "twitter", isActive: true, 
        password: bcrypt.hashSync( password, 10 )
      });
      console.log (user)
      // user.cliente = cliente;
      await this.UsuarioRepository.save(user);
      // delete user.password;

      return {
        user: { ...user }, 
        token: this.getJwtToken({ email: user.email })
      }

    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  private handleDBErrors (error: any): never{
    if (error.code === '23505')
      throw new BadRequestException(error.detail)
    
    throw new InternalServerErrorException('Please Check Server Error ...')
  }

  private getJwtToken( payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  async deleteAllUsers(){
    const query = this.UsuarioRepository.createQueryBuilder('user');
    try{
      return await query
              .delete()
              .where({})
              .execute()
    }catch(error){
      this.handleDBErrors( error )
    }
  }
}


// import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DataSource, Repository } from 'typeorm';
// import { CreateUsuarioDto } from './dto/create-usuario.dto';
// import { UpdateUsuarioDto } from './dto/update-usuario.dto';
// import { LoginUserDto } from './dto/login.dto.ts';
// import { Usuario } from './entities/usuario.entity';
// import * as bcrypt from 'bcrypt';
// import { ClientesService } from '../clientes/clientes.service';
// import { JwtService } from '@nestjs/jwt/dist';
// import { JwtPayload } from './interfaces/jwt-payload.interface';

// @Injectable()
// export class UsuariosService {

//   constructor(
//     private readonly dataSource: DataSource,
    
//     @InjectRepository(Usuario)
//     private readonly usuarioRepository: Repository<Usuario>,
//     // private readonly clienteService: ClientesService,
//     private readonly jwtService: JwtService
//   ){}
  
//   async create(createUsuarioDto: CreateUsuarioDto) {
//     try {
//       // const { NIFCliente, contraseña, ...usuarioData } = createUsuarioDto;
//       const {password, ...usuarioData} = createUsuarioDto;
//       const usuario = this.usuarioRepository.create({
//         ...usuarioData,
//         password: bcrypt.hashSync( password, 10 )
//       });
//       // const cliente = await this.clienteService.findOne(NIFCliente);
//       // usuario.cliente = cliente[0];
//       await this.usuarioRepository.save(usuario);
//       delete usuario.password;
//       return {
//         user: {...usuario},
//         token: this.getJwtToken({email: usuario.email})
//       }
//     }
//     catch (error) {
//       console.log(error);
//       throw new InternalServerErrorException('Ayuda!')
//     }
//   }

//   async login (loginUsuarioDto: LoginUserDto) {
//     try {
//       // buscamos el usuario del email
//       const { email, password } = loginUsuarioDto;
//       const usuario = await this.usuarioRepository.findOne({
//         where: {email},
//         select: {email: true, password: true, nombre: true, twitter: true, website: true}
//       });

//       if (!usuario)
//         throw new UnauthorizedException ('Credenciales no válcodigoas (email)'
//       );
      
//       // comparamos las contraseñas
//       if (!bcrypt.compareSync(password, usuario.password))
//         throw new UnauthorizedException ('Credenciales no válcodigoas (contraseña)'
//       );

//       const token = this.getJwtToken({email: usuario.email})
//       return {
//         user: {...usuario},
//         token: token
//       };
//     }
//     catch (error) {
//       this.handleDBErrors (error)
//     }
//   }

//   findAll() {
//     return this.usuarioRepository.find({
//       relations: {cliente: true}
//     });
//   }

//   findOne(codigo: number) {
//     return null;
//   }

//   async update(codigo: number, UpdateUsuarioDto: UpdateUsuarioDto) {
//     const { ...rest } = UpdateUsuarioDto;
//     const usuario = await this.usuarioRepository.preload({
//       codigo,
//       ...rest
//     });

//     if(!usuario) throw new NotFoundException(`Usuario con código ${codigo} no encontrado`);

//     //crear Query runner
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       //guardamos la info del usuario pero NO SE GUARDA EN LA BD
//       await queryRunner.manager.save(usuario);
//       await queryRunner.commitTransaction();
//       await queryRunner.release();

//       // return (usuario)
//       return this.findOne(codigo);
//     }
//     catch (error) {
//       await queryRunner.rollbackTransaction();
//       await queryRunner.release();
//       this.handleDBErrors(error)
//     }
//   }

//   async remove(codigo: number) {
//     const usuario = await this.findOne(codigo);
//     await this.usuarioRepository.remove(usuario)
//   }

//   async deleteAllUsuarios() {
//     const query = this.usuarioRepository.createQueryBuilder('usuario');
//     try {
//       return await query
//       .delete()
//       .where({})
//       .execute();
//     } 
//     catch (error) {
//       this.handleDBErrors(error);
//     }
//   }

//   private handleDBErrors(error: any): never {
//     if (error.code === '23505'){
//       throw new BadRequestException(error.detail);
//     }
//     throw new InternalServerErrorException('Please Check Server Error ...');
//   }

//   private getJwtToken(payload: JwtPayload) {
//     const token = this.jwtService.sign(payload);
//     return token;
//   }
// }