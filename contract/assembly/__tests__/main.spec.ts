import * as reto from '..'
import { crearReto, agregarNutriologo, mostrarRetos, setGreeting} from '..' 
import { storage, Context } from 'near-sdk-as'

describe('Greeting ', () => {
  it('should be set and read', () => {
    setGreeting('hello world')
    storage.get<string>(Context.sender)
    reto.crearReto('Hola', 'Esta','Febrero 13', 10)
    reto.mostrarRetos("Hello")
    reto.agregarNutriologo('1243','manuel')
    reto.mostrarNutriologos('hello')
  })
})
