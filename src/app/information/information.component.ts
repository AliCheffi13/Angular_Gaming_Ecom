import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
interface Item {
  name: string;
  quantity: number;
  price: number;
  image?: string; // Add any other properties if necessary
}
@Component({
  selector: 'app-information',
  standalone: true,
  imports: [FormsModule,RouterLink,CommonModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent implements OnInit{
  cart: Item[] = []; // Use the Item type for the cart
  totalAmountTND: number = 0;  // Total amount in TND
  totalAmountUSD: number = 0;  // Total amount in USD
  exchangeRate: number = 3.10;  // Example exchange rate (1 USD = 3.10 TND)
  userData: any;


  constructor(private cartService: CartService,private sharedService: SharedService) {}
  ngOnInit() {
    this.cartService.cart$.subscribe((data) => {
      this.cart = data;
      this.totalAmountTND = this.getTotalPriceTVA();
      this.totalAmountUSD = this.convertToUSD(this.totalAmountTND); // Convert TND to USD
    });
    this.sharedService.userData$.subscribe((data) => {
      this.userData = data;
    });
  }
  isFormValid(): boolean {
    return (
      this.userData?.name &&
      this.userData?.email &&
      this.userData?.address &&
      this.userData?.phone &&
      this.cart.length > 0 // Vérifie que le panier n'est pas vide
    );
  }
  removeFromCart(index: number) {
    this.cartService.removeFromCart(index);
  }
  
    // Method to get the total price without tax
    getTotalPriceHT(): number {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  
    // Method to get the total price including tax
    getTotalPriceTVA(): number {
      return this.getTotalPriceHT() * 1.19;  // 19% VAT
    }
      // Method to convert TND to USD using the exchange rate
  convertToUSD(amountTND: number): number {
    return amountTND / this.exchangeRate;
  }
}