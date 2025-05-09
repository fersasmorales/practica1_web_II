import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto';
import { AfterViewInit } from '@angular/core';
declare var paypal: any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-carrito',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements AfterViewInit {
carrito:any[]=[];
Toast = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });

constructor(
  public carritoService:CarritoService,
  private router:Router){} //todos los metodos que tenemos en el servicio los vamos a llamar aqui
ngOnInit(){
  this.carrito=this.carritoService.obtenerCarrito();
}

ngAfterViewInit() {
  if (this.carrito.length > 0) {
    this.renderizarBotonPaypal();
  }
}

eliminarProducto(producto: any) {
  this.carritoService.eliminarProducto(producto);
  this.carrito = this.carritoService.obtenerCarrito();

  const container = document.getElementById('paypal-button-container');
  if (this.carrito.length > 0) {
    this.renderizarBotonPaypal();
  } else if (container) {
    container.innerHTML = '';
  }
}


generarXML(){
  this.carritoService.generarXML();
}
descargarXML(){
  this.carritoService.descargarXML();
}
volver(){
  this.router.navigate(['']);
}

getTotal(): number {
  if (!this.carrito || this.carrito.length === 0) {
    return 0;
  }

  return this.carrito.reduce((acc, producto) => acc + Number(producto.precio), 0);
}


renderizarBotonPaypal() {
  const container = document.getElementById('paypal-button-container');
  if (container) container.innerHTML = '';

  const total = this.getTotal().toFixed(2);

  paypal.Buttons({
    createOrder: (data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: this.getTotal().toFixed(2)
          }
          
        }]
      });
    },
    onApprove: (data: any, actions: any) => {
      return actions.order.capture().then((details: any) => {
        this.Toast.fire({
          icon: 'success',
          title: '¡Éxito!',
          position: 'top-end',
          text: 'Pago completado por ' + details.payer.name.given_name
        });
        this.carritoService.vaciarCarrito();
        this.carrito = [];
        const container = document.getElementById('paypal-button-container');
        if (container) container.innerHTML = '';
      });
    },
    onError: (err: any) => {
      console.error(err);
      alert('Error en el pago');
    }
  }).render('#paypal-button-container');
}
}

