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
  productoEditando: Producto | null = null;
  opcionSeleccionado: number  = 0;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
selectedImagePath: string | null = null;

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
  modificar = false;
  agregarFormulario() {
    this.agregar = !this.agregar;
    this.modificar = false;
  }
  modificarFormulario() {
    this.modificar = !this.modificar;
    this.agregar = false;
  }

  agregarProducto(nombre: string, precio: number, cantidad:number, imagen:string) {
    const filePath = "C:\\fakepath\\camisetaverde.jpeg";
    const fileName = filePath.split("\\").pop();  // "camisetaverde.jpeg"
    const imagePath = `assets/${fileName}`;
    const rutaImagen = imagen.startsWith('assets/') ? imagen : `assets/${imagen}`;
        const nuevoProducto: Producto = {
          id: this.productos.length + 1,
          nombre,
          precio,
          cantidad,
          imagen: imagePath
        };
    
        this.productos.push(nuevoProducto);
        this.generarXML();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Extraer solo el nombre del archivo sin la ruta "fakepath"
        const fileName = file.name.replace("C:\\fakepath\\", "");

        // Guardar la ruta correcta en assets/
        this.selectedImagePath = `assets/${fileName}`;
    }
}


  editarProducto(id: number,nombre: string, precio: number, cantidad: number, imagen: string) {
    this.productoEditando = { id, nombre, precio, cantidad, imagen };
    this.modificar = true;
    
  }
  modificarProducto(nombre: string, precio: number, cantidad: number, imagen: string) {
    if (this.productoEditando) {
      // Actualizar valores
      
      this.productoEditando.nombre = nombre;
      this.productoEditando.precio = precio;
      this.productoEditando.cantidad = cantidad;
  
      // Si se seleccionó una nueva imagen, actualizarla
      if (this.selectedFile) {
        this.productoEditando.imagen = URL.createObjectURL(this.selectedFile);
      }
  
      // Buscar el índice del producto en la lista y actualizarlo
      const index = this.productos.findIndex(p => p.id === this.productoEditando!.id);
      if (index !== -1) {
        this.productos[index] = { ...this.productoEditando };
      }
  
      // Resetear variables
      this.productoEditando = null;
      this.modificar = false;
      this.selectedFile = null;
      this.generarXML();
    }
  }

  generarXML() {
    const xmlProductos = this.productos.map(prod => {
      return `
        <producto>
          <id>${prod.id}</id>
          <nombre>${prod.nombre}</nombre>
          <precio>${prod.precio}</precio>
          <cantidad>${prod.cantidad}</cantidad>
          <imagen>${prod.imagen}</imagen> <!-- Ya tiene la ruta relativa -->
          <descripcion>${prod.descripcion || ""}</descripcion>
        </producto>`;
    }).join('');
  
    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <productos>
      ${xmlProductos}
    </productos>`;
  
    this.http.post('http://localhost:3000/guardar-xml', { xml: xmlString })
      .subscribe(
        response => console.log("✅ XML guardado correctamente:", response),
        error => console.error("❌ Error al guardar XML:", error)
      );
  }
  
  
  

  capturar(){
    this.opcionSeleccionado;
    alert(`${this.opcionSeleccionado} opcion`);
  }




  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.generarXML();
  }


}