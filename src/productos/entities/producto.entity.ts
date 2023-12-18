import { Proveedore } from "src/proveedores/entities/proveedore.entity";
import { Venta } from "src/ventas/entities/venta.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Producto {
    @PrimaryColumn()
    ID: string;

    @Column('text')
    nombre: string;

    @Column('text')
    stock: string;

    @Column('text')
    precio: string;

    @Column('text')
    descripcion?: string;

    @Column('text')
    imagen: string;
    
    @ManyToOne(
        () => Proveedore,
        (proveedore) => proveedore.productos,
        {onDelete: "CASCADE"}
    )
    proveedore?: Proveedore;

    @ManyToOne(
        () => Venta,
        (venta) => venta.producto,
        {onDelete: "CASCADE"}
    )
    ventas: Venta;
}





