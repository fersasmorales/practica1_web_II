import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Importa el módulo
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-inventario',
  standalone:true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit{
  productos:any[]=[];
  opcionSeleccionado: number  = 0;


  constructor(
    private productoService:ProductoService,
    private router:Router,
    private http: HttpClient
  ) {}


  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe(productos => {
      this.productos = productos;
    }, error => {
      console.error('Error al obtener productos:', error);
    });
  }
  volver() {
    this.router.navigate(['']);
  }

  agregar = false;
  eliminar = false;
  modificar = false;
  agregarFormulario() {
    this.agregar = !this.agregar;
    this.modificar = false;
    this.eliminar = false;
  }
  eliminarFormulario() {
    this.eliminar = !this.eliminar;
    this.modificar = false;
    this.agregar = false;
  }
  modificarFormulario() {
    this.modificar = !this.modificar;
    this.agregar = false;
    this.eliminar = false;
  }

  agregarProducto(nombre: string, precio: number, cantidad:number, imagen:string) {
    const nuevoId = Math.max(...this.productos.map(p => p.id), 0) + 1;  // Se asegura que el ID sea único

    const producto = new Producto(nuevoId, nombre, precio, cantidad, imagen);
    this.productos.push(producto);
    alert(`${imagen}`);
  }

  onFileChange(){
  }


  generarXML() {
    this.http.post('http://localhost:3000/guardarProductos', this.productos)
      .subscribe(response => {
        console.log('Productos guardados:', response);
        alert('¡Productos guardados en productos.xml!');
      }, error => {
        console.error('Error al guardar:', error);
        alert('Error al guardar los productos.');
      });
  }
  

  capturar(){
    this.opcionSeleccionado;
    alert(`${this.opcionSeleccionado} opcion`);
  }




  eliminarProducto(id: number) {
    this.productos = this.productos.filter(producto => producto.id !== id);
  }


  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

}