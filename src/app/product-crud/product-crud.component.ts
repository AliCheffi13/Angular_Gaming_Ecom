import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../product.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-crud',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './product-crud.component.html',
  styleUrls: ['./product-crud.component.css'],
})
export class ProductCrudComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  isEditMode: boolean = false;
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      reference: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required],
      image1: ['', Validators.required],
      image2: ['', Validators.required],
      image3: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // Charger les produits depuis le service
  loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData: Product = {
        ...this.productForm.value,
        images: [
          this.productForm.value.image1,
          this.productForm.value.image2,
          this.productForm.value.image3
        ],
      };

      if (this.isEditMode) {
        this.updateProduct(productData);
      } else {
        this.addProduct(productData);
      }
    }
  }

  addProduct(product: Product): void {
    // Generate a new ID for the new product
    const newId = this.generateNewId();
    const newProduct: Product = {
      ...product,
      id: newId.toString() // Convert ID to string to match the type
    };

    this.productService.addProduct(newProduct).subscribe(() => {
      this.loadProducts();
      this.productForm.reset();
      Swal.fire('Succès', 'Produit ajouté avec succès !', 'success');
    });
  }

  // Generate a new ID (auto-increment)
  private generateNewId(): number {
    if (this.products.length === 0) {
      return 1; // Start from 1 if there are no products yet
    }
    const lastProductId = Math.max(...this.products.map(p => Number(p.id)));
    return lastProductId + 1;
  }

  // Modifier un produit
  editProduct(product: Product): void {
    this.isEditMode = true;
    this.selectedProduct = { ...product };
    this.productForm.patchValue(this.selectedProduct);
  }

  updateProduct(product: Product): void {
    if (!this.selectedProduct) return;
  
    const updatedProduct: Product = {
      ...this.selectedProduct,
      ...product,
      images: [
        this.productForm.value.image1,
        this.productForm.value.image2,
        this.productForm.value.image3
      ],
    };
  
    console.log(updatedProduct); // Debug: afficher les informations du produit avant la requête
  
    this.productService.updateProduct(updatedProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.isEditMode = false;
        this.selectedProduct = null;
        this.productForm.reset();
        Swal.fire('Succès', 'Produit modifié avec succès !', 'success');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du produit:', error);
        Swal.fire('Erreur', 'Une erreur s\'est produite lors de la mise à jour du produit.', 'error');
        // Optionally log the error response
        if (error.status === 404) {
          console.error('Le produit spécifié n\'a pas été trouvé.');
        } else {
          console.error('Erreur:', error);
        }
      }
    });
  }
  
  deleteProduct(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe(() => {
          this.products = this.products.filter((product) => product.id !== id);
          Swal.fire('Supprimé !', 'Produit supprimé avec succès.', 'success');
        });
      }
    });
  }

  // Annuler l'édition
  cancelEdit(): void {
    this.isEditMode = false;
    this.selectedProduct = null;
    this.productForm.reset();
  }
}