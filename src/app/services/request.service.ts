import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { merge, Observable, } from 'rxjs';
import { combineAll, combineLatestAll, concatMap, map, tap } from 'rxjs/operators';
import { Cocktail } from '../libs/entity/cocktail.interface';
import Transform from '../libs/helpers/transform.helper';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private _toSearch: Observable<any>[] = [];

  constructor(public http: HttpClient) {}

  getCocktailRequest(nameCocktail: string): Observable<Cocktail[]> {
    const URL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${nameCocktail}`;
    let cocktails;
    return this.http.get(URL).pipe(
      map((resp: any) => {
        console.log('map', resp);
        cocktails = Transform.cocktail(resp.drinks);
        return cocktails;
      })
    );
  }


/**
 * We make a request to the Pokemon API for Pikachu, then we make a request to the Species API for
 * Pikachu, then we make a request to the Varieties API for Pikachu, then we return the result of the
 * Varieties API request
 * @returns The observable of the getPokemon() method.
 */
 getPokemon(): Observable<any>{ //*Peticion principal
  let resMapPikachu;
  return this.http.get('https://pokeapi.co/api/v2/pokemon/pikachu').pipe( //*Hace la primer peticion a pokemon/pikachu

    concatMap((resPokemon: any) => { //*Concatena la peticion de getSpecies con la peticion pokemon/pikachu
      
      return this.getSpecies(resPokemon.species.url, resPokemon) //Le pasamos la url del endPoint de Species y la respuesta de la peticion a pokemon/pikachu
    }),
    concatMap((resSpecies: any) => { //*Concatena la peticion de getVarieties con la de getSpecies y pokemon/pikachu
      return this.getVarieties(resSpecies);
    }),
    /*
    resMapPikachu=  map((resp: any) => {
      return{
        name : resp.name,
        sprites: resp.sprites,
        species: resp.species,
        stats: resp.stats,
      }
    
    }
  ),
    */
  
    tap (res => {
      console.log('Tap2: ', res ); //Aqui ya tenemos las 3 respuestas concatenadas en una
    })
  )
}


/**
* We're taking the url of the species, and the original pokemon object, and returning an observable
* that will return the species object with the original pokemon object merged into it
* @param {string} url - the url of the species
* @param {any} original - any - this is the original object that we want to add the species data to.
* @returns The original pokemon object and the species object.
*/
getSpecies(url: string, original: any): Observable<any>{
  return this.http.get(url).pipe(
    map((resSpecies: any) => {
      
      (resSpecies.varieties as any[]).forEach(el => { //resSpecies.varieties es un arreglo de las variedad del pokemon con su url al endpoint de cada una
        this._toSearch.push(this.http.get(el.pokemon.url)) //Obtenemos cada url de las variedad y la juntamos a su peticion http para guardar las peticiones en toSearch
      })
      
      
      return{
        name : original.name,
        sprites: original.sprites,
        species: resSpecies.species,
        stats: original.stats,
      }
    
      console.log('Get Species',{
        ...resSpecies, ...original 
      })

      return {
        ...resSpecies, ...original //Regresamos la respuesta de resSpecies y la respuesta de pokemon/pikachu
      }
    })
  )
}


/**
* It takes an array of observables, and returns an observable that emits an array of the latest values
* from each of the observables
* @param {any} original - any: The original object that we want to add the sprites to.
* @returns An Observable that emits an object with the original data and the sprites array.
*/
getVarieties(original: any): Observable<any>{
  return merge(this._toSearch).pipe(  //El merge recibe Observables, entra al map tantas veces como argumentos tenga, en este caso le mandamos un arreglo de observables
    tap(res => {
      console.log('Before respose de combineLatestAll', res) //Aqui vemos que merge si entra sobre cada Observable sin ejecutarlo
    }),
    combineLatestAll(), //*1.Ejecuta los Observables del arreglo | 2.junta las respuestas en un arreglo
    // EL combine all ejecuta cada peticion del arreglo, espera su respuesta y la guarda en un arreglo
    map(res => { //Hacemos map del arreglo de respuestas que regreso combineLatestAll
      console.log('Merged', res)
      let sprites = res.map(item => { //De cada respuesta de varieties solo guardamos el name y la imagen de la variedad del pokemon
        return {
          name: item.name,
          img: item.sprites.front_default
        }
      })

      delete original['species'];

      return { //Regresamos original que son las 2 peticiones combinadas mas la nueva key que reemplzada la key sprites por la que hicimos
        ...original, 
        sprites: sprites
      }
      
    })
  )
}
}
