import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CartService } from "../cart.service";
import { SharedService } from "../shared.service";
import { loadStripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

interface Item {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

declare const paypal: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit {
  cart: Item[] = [];
  totalAmountTND: number = 0;
  totalAmountUSD: number = 0;
  exchangeRate: number = 3.10;
  userData: any;
  invoiceData: any = null;

  stripePromise: Promise<any>;
  stripe!: any;
  elements!: StripeElements;
  cardElement!: StripeCardElement;

  @ViewChild('cardElementContainer') cardElementContainer!: ElementRef;

  constructor(private cartService: CartService, private sharedService: SharedService) {
    this.stripePromise = loadStripe('pk_test_51QUTy0BFqTvYEDDpFb2jkJCyZxizTiOYc1eEt1pz2KwhD8FWGCsom58i2Gr3GVBHnACmIBUaT1xmfSP5IZrxxcTV001eY4QKwH');
  }

  ngOnInit() {
    this.cartService.cart$.subscribe((data) => {
      this.cart = data;
      this.totalAmountTND = this.getTotalPriceTVA();
      this.totalAmountUSD = this.convertToUSD(this.totalAmountTND);
    });
    this.sharedService.userData$.subscribe((data) => {
      this.userData = data;
    });
  }

  ngAfterViewInit() {
    this.stripePromise.then((stripe) => {
      this.stripe = stripe;
      this.elements = stripe.elements();
      this.cardElement = this.elements.create('card');
      this.cardElement.mount(this.cardElementContainer.nativeElement);
    });

    this.initializePayPalButton();
  }

  initializePayPalButton() {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.totalAmountUSD.toFixed(2),
            },
          }],
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert(`Transaction réussie par ${details.payer.name.given_name}`);
          this.invoiceData = {
            user: this.userData,
            items: this.cart,
            total: this.totalAmountTND,
            transactionId: details.id,
            date: new Date().toLocaleString(),
          };
        });
      },
      onError: (err: any) => {
        console.error('Erreur PayPal :', err);
        alert('Une erreur est survenue avec PayPal.');
      },
    }).render('#paypal-button-container');
  }

  async payWithStripe() {
    if (!this.stripe || !this.cardElement) {
      alert('Stripe n\'est pas initialisé.');
      return;
    }

    const paymentIntent = await this.createPaymentIntent();
    if (!paymentIntent) {
      alert('Impossible de créer un Payment Intent.');
      return;
    }

    const { client_secret } = paymentIntent;

    const result = await this.stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: this.cardElement,
        billing_details: {
          name: this.userData.name,
        },
      },
    });

    if (result.error) {
      console.error('Erreur de paiement Stripe:', result.error.message);
    } else if (result.paymentIntent?.status === 'succeeded') {
      alert('Paiement réussi avec Stripe');
      this.invoiceData = {
        user: this.userData,
        items: this.cart,
        total: this.totalAmountTND,
        transactionId: result.paymentIntent.id,
        date: new Date().toLocaleString(),
      };
    }
  }

  async createPaymentIntent() {
    try {
      const response = await fetch('/create-payment-intent', {
        method: 'POST',
        body: JSON.stringify({ amount: this.totalAmountTND * 100 }), // Stripe attend un montant en cents
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du Payment Intent:', error);
      return null;
    }
  }

  getTotalPriceHT(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTotalPriceTVA(): number {
    return this.getTotalPriceHT() * 1.19;
  }

  convertToUSD(amountTND: number): number {
    return amountTND / this.exchangeRate;
  }

  printInvoice() {
    const printWindow = window.open('', '_blank', 'width=600,height=400');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>Facture</title></head>
        <body>
          <h2>Facture</h2>
          <p><strong>Nom:</strong> ${this.invoiceData.user.name}</p>
          <p><strong>Total TTC :</strong> ${this.invoiceData.total} TND</p>
          <p><strong>ID de transaction :</strong> ${this.invoiceData.transactionId}</p>
          <button onclick="window.print()">Imprimer la facture</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}
