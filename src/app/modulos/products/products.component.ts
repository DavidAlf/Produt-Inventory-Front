import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ProductsService } from '../../servicios/products.service';
import { CategoriesService } from '../../servicios/categories.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  isEditable: boolean = false;
  isSave: boolean = true;
  products: Product[] = [];
  categories: Category[] = [];
  id: number = 0;
  newCategory: Category = { id: 0, name: 'Electrodomesticos', description: 'newItem' };
  newProduct: Product = { id: 0, name: 'newItem', description: 'newItem', price: 0, category: this.newCategory };

  constructor(private productsService: ProductsService, private categoriesService: CategoriesService) {
    this.loadData();
  }

  loadData(): void {

    this.productsService.get().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          console.error("Error en la consulta", error.status, error.statusText);
        } else {
          console.error("Error inesperado", error);
        }
      }
    });

    this.categoriesService.get().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          console.error("Error en la consulta", error.status, error.statusText);
        } else {
          console.error("Error inesperado", error);
        }
      }
    });
  }

  addItem(): void {
    this.productsService.add(this.newProduct).subscribe({
      next: (data) => {
        this.loadData();
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          alert("Verifique que no existe un item nuevo [newItem]")
          console.error("Error en la creación", error.status, error.statusText);
        } else {
          console.error("Error inesperado", error);
        }
      }
    });


  }

  updateField(event: any, product: any, field: keyof Product) {
    const newValue = event.target.innerText;
    console.log(newValue);
    
    product[field] = newValue;
  }

  OK(product: any): void {
    this.id = product.id;

    if (this.isEditable) {
      this.productsService.update(product).subscribe({
        next: (response) => {
          this.loadData();
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            console.error("Error en la actualizacion", error.status, error.statusText);
          } else {
            console.error("Error inesperado", error);
          }
        }
      });
    }

    this.isEditable = !this.isEditable;
    if (!this.isEditable) {
      this.id = 0;
    }
  }

  KO(id: number) {
    if (!this.isEditable) {
      this.productsService.delete(id)
        .subscribe({
          error: (error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status == 200) {
                console.log("Categoría eliminada con éxito");
                this.loadData();
              } else {
                console.error("Error en la eliminación", error.status, error.statusText);
                alert("Ocurrio un error eliminando la categoria " + id)
              }
            } else {
              console.error("Error inesperado", error);
            }
          }
        });
    }
    this.isEditable = false;
    this.id = 0;
  }


}
