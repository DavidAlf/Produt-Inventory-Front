import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../servicios/products.service';
import { InventoryService } from '../../servicios/inventory.service';
import { Inventory } from '../../models/inventory.model';
import { Category } from '../../models/category.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {

  isEditable: boolean = false;
  isSave: boolean = true;
  products: Product[] = [];
  inventories: Inventory[] = [];
  id: number = 0;
  newCategory: Category = { id: 0, name: 'Electrodomesticos', description: 'newItem' };
  newProduct: Product = { id: 0, name: 'newItem', description: 'newItem', price: 0, category: this.newCategory };
  newInventory: Inventory = { id: 0, quantity: 0, date: '2024-07-25', product: this.newProduct };

  constructor(private productsService: ProductsService, private inventoryService: InventoryService) {
    this.loadData();
  }

  loadData(): void {

    this.inventoryService.get().subscribe({
      next: (data) => {
        this.inventories = data;
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          console.error("Error en la consulta", error.status, error.statusText);
        } else {
          console.error("Error inesperado", error);
        }
      }
    });

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
  }

  addItem(): void {
    this.inventoryService.add(this.newInventory).subscribe({
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

  updateField(event: any, product: any, field: keyof Inventory) {
    const newValue = event.target.innerText;
    console.log(newValue);

    product[field] = newValue;
  }

  OK(product: any): void {
    this.id = product.id;

    if (this.isEditable) {
      this.inventoryService.update(product).subscribe({
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
      this.inventoryService.delete(id)
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
