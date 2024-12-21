import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentGuard implements CanActivate {
  constructor(private sharedService: SharedService, private router: Router) {}

  canActivate(): boolean {
    const userData = this.sharedService['userDataSource'].getValue(); // Utiliser getValue() pour accéder aux données
    if (userData?.name && userData?.email && userData?.address && userData?.phone) {
      return true;
    }
    this.router.navigate(['/information']); // Redirection si les données sont manquantes
    return false;
  }
}
