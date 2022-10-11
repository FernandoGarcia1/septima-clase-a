import { Component, OnInit } from '@angular/core';
import { InfoService } from 'src/app/services/info.service';

@Component({
  selector: 'app-uno',
  templateUrl: './uno.component.html',
  styleUrls: ['./uno.component.scss']
})
export class UnoComponent implements OnInit {

  constructor(private info : InfoService) { }

  ngOnInit(): void {
  }


  onClick(){
  this.info.data$.next({
    name: 'Fer',
    password: '1234'
  })
  }
}
