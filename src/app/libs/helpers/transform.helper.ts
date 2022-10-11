import { Cocktail } from "../entity/cocktail.interface";

export default class Transform {

    static cocktail(cocktails: any[]): Cocktail[] {

        let ingredients: string[] = [];
        let bebidas = cocktails.map(cocktail => {
            ingredients = [];
            Object.keys(cocktail).forEach((key) => {
                if (key.includes('strIngredient') && cocktail[key] !== null) {
                    ingredients.push(cocktail[key])
                }
            })
            return {
                name: cocktail.strDrink,
                imgUrl: cocktail.strDrinkThumb,
                ingredients: ingredients
            };
        })
        return bebidas;
    }
}