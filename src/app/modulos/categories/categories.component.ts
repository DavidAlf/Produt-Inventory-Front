import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Category } from '../../models/category.model';
import { CategoriesService } from '../../servicios/categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

  isEditable: boolean = false;
  isSave: boolean = true;
  categories: Category[] = [];
  id: number = 0;
  newCategory: Category = { id: 0, name: 'newItem', description: 'newItem' };

  constructor(private categoriesService: CategoriesService) {
    this.loadData();
  }

  loadData(): void {
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
    this.categoriesService.add(this.newCategory).subscribe({
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

  updateField(event: any, category: any, field: keyof Category) {
    const newValue = event.target.innerText;
    category[field] = newValue;
  }

  OK(category: any): void {
    this.id = category.id;

    if (this.isEditable) {
      this.categoriesService.update(category).subscribe({
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
      this.categoriesService.delete(id)
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
