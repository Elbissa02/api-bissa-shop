import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Venta } from "src/ventas/entities/venta.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Cliente {
    @PrimaryColumn()
    DNI: string;

    @Column('text')
    nombre: string;

    @Column('text')
    apellido: string;

    @Column('text')
    direccion: string;

    @Column('text')
    telefono: string;

    @OneToOne(
        () => Usuario,
        (usuario) => usuario.cliente,
        {onDelete: "CASCADE"}
    )
    @JoinColumn()
    usuario?: Usuario;

    @OneToMany(
        () => Venta,
        (venta) => venta.cliente,
        {onDelete: "CASCADE", eager: true}
    )
    ventas?: Venta[];
}
