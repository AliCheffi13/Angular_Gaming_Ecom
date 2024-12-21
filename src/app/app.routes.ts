import { Routes } from "@angular/router";
import { CartComponent } from "./cart/cart.component";
import { HomeComponent } from "./home/home.component";
import { PaymentComponent } from "./payment/payment.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { InformationComponent } from "./information/information.component";
import { PaymentGuard } from "./guards/payment-guard.guard";
import { ProductCrudComponent } from "./product-crud/product-crud.component";
import { CategoryComponent } from "./category/category.component";
import { CategoryDetailComponent } from "./category-detail/category-detail.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },              // Page d'accueil
  { path: 'category', component: CategoryComponent },
  { path: 'category/:categoryName', component: CategoryDetailComponent },
  { path: 'crud', component: ProductCrudComponent },
  { path: 'payment', component: PaymentComponent, canActivate: [PaymentGuard] },
  { path: 'product/:id', component: ProductDetailsComponent }, // Détails d'un produit
  { path: 'cart', component: CartComponent },          // Page du panier
  { path: 'information', component: InformationComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },   // Redirection des routes inconnues
  
];
