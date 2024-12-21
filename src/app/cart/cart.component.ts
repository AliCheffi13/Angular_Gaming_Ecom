import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  @Input() cart: any[] = [];
  @Input() isOpen: boolean = false;
  @Output() closeCart = new EventEmitter<void>(); // Événement pour informer le parent

  get totalPrice() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  constructor(private cartService: CartService, private router: Router) {
  }
  ngOnInit() {
    this.cartService.cart$.subscribe((data) => {
      this.cart = data;
    });
  }
  removeFromCart(index: number) {
    this.cartService.removeFromCart(index);
  }

  close() {
    this.closeCart.emit();
  }
  clearCart() {
    this.cartService.clearCart();
  }
  goToCheckout() {
    if (this.cart.length > 0) {
      this.router.navigate(['/information']); // Rediriger vers la page de paiement
    }
}


}