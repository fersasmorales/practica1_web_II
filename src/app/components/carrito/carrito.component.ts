import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-carrito',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
carrito:any[]=[];
constructor(public carritoService:CarritoService,
  private router:Router){} //todos los metodos que tenemos en el servicio los vamos a llamar aqui
ngOnInit(){
  this.carrito=this.carritoService.obtenerCarrito();
}
generarXML(){
  this.carritoService.generarXML();
}
descargarXML(){
  this.carritoService.descargarXML();
}
eliminarProducto(producto: Producto){
  this.carritoService.eliminarProducto(producto);
  this.carrito = this.carritoService.obtenerCarrito(); //
}
volver(){
  this.router.navigate(['']);
}
}

