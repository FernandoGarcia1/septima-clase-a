import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserForm } from '../libs/entity/user-form.interface';



@Injectable({
  providedIn: 'root'
})
export class InfoService {

  public data$: BehaviorSubject<UserForm> = new BehaviorSubject({
    name : '',
    password : '',
  });
  constructor() { }


  onClick(){    
  }
}
