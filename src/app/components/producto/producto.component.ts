import { Component,OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { HttpClientModule } from '@angular/common/http'; 
import Swal from 'sweetalert2';


@Component({
  selector: 'app-producto',   
  standalone:true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './producto.component.html',
  styleUrls:  ['./producto.component.css']
})

export class ProductoComponent implements OnInit {
  productos: any[] = [];

  Toast = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productoService.obtenerProductos().subscribe(data => {
      this.productos = data as any[];
    });
  }

  agregarAlCarrito(producto: any) {
    this.carritoService.agregarProducto(producto);
    this.Toast.fire({
      icon: 'success',
      title: '¡Éxito!',
      position: 'top-end',
      text: 'Tu producto se ha agregado correctamente.'
    });
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }

  irAInventario() {
    this.router.navigate(['/inventario']);
  }
}

/*export class ProductoComponent implements OnInit{
 productos:any[]=[];
constructor(
  private productoService:ProductoService,
  private carritoService:CarritoService,
  private router:Router
){}
ngOnInit(): void {
  this.productoService.obtenerProductos().subscribe(productos => {
    this.productos = productos;
  }, error => {
    console.error('Error al obtener productos:', error);
  });
}

agregarAlCarrito(producto:any){
this.carritoService.agregarProducto(producto);
alert(`${producto.nombre} ha sido agregado al carrito`);
}
irAlCarrito(){
  this.router.navigate(['/carrito']);
}
irAInventario(){
  this.router.navigate(['/inventario']);
}

}*/
