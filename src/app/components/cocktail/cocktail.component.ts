import { Component, OnInit } from '@angular/core';
import { Cocktail } from 'src/app/libs/entity/cocktail.interface';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-cocktail',
  templateUrl: './cocktail.component.html',
  styleUrls: ['./cocktail.component.scss']
})
export class CocktailComponent implements OnInit {

  public cocktails : Cocktail[] = [];
  constructor(public cocktailService: RequestService) { }

  ngOnInit(): void {
    this.cocktailService.getCocktailRequest('margarita').subscribe({
      next: data=>{        
        this.cocktails =data;
      }
    })
  }

}
