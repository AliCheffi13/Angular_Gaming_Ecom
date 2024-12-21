import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private userDataSource = new BehaviorSubject<any>({
    name: '',
    email: '',
    address: '',
    phone: '',
    shipping: 'delivery',
    payment: 'paypal',
    acceptPolicy: false,
  });

  userData$ = this.userDataSource.asObservable();

  updateUserData(data: any) {
    this.userDataSource.next(data);
  }
}
