import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnInit {

  public pokemon$!: Observable<any>
  constructor(public pokemonRequest : RequestService) { 
    this.pokemon$ = this.pokemonRequest.getPokemon();
    console.log('Component:',this.pokemon$)
  }

  ngOnInit(): void {
  }

}
