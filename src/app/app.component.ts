import { Component } from '@angular/core';
import { ProductoComponent } from './components/producto/producto.component';
import { RouterModule } from '@angular/router';
import { CarritoComponent } from './components/carrito/carrito.component';


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [ProductoComponent, RouterModule, CarritoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template:`<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'angular-fer-gabs';
}
