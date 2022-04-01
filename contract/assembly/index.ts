/**
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import { context, logging, storage, PersistentVector, PersistentMap, PersistentUnorderedMap, u128, datetime, Context } from 'near-sdk-as'
/**
 * == CLASSES ====================================================================
 */

//dejamos las líneas del código del smartContract que viene por default
const DEFAULT_MESSAGE = 'Hello'

//creamos las clases Reto, Nutriologo y Paciente
@nearBindgen
 class Reto {
    retoId: string;
    nombreReto: string;
   // numIntegrantes: u32;
    fechaInicio: string;
    monto: u32;
    pacientes: PersistentVector<Paciente>; //utilizamos una collección de NEAR

//Método constructor 
    constructor(retoId: string, nombreReto: string, fechaInicio: string, monto: u32){
      this.retoId = context.blockIndex.toString();
      this.nombreReto = nombreReto;
      //this.numIntegrantes = numIntegrantes;
      this.fechaInicio = datetime.block_datetime().toString().split('T')[0];
      this.monto = monto;
      this.pacientes = new PersistentVector<Paciente>(`${context.blockIndex}`);
    }

//agregar pacientes
    /**agregarPaciente(paciente: Paciente): void{
        this.pacientes.push(paciente);
        logging.log(`El paciente ${paciente.accountId} ha sido agregado exitosamente al reto`)
    }

 //mostrar los pacientes 
    consultarPacientes(): PersistentVector<Paciente>{
      return this.pacientes;
    }*/
 }

@nearBindgen
 class Nutriologo {
    nutId: string;
    nombreNut: string;
    
    constructor(nutId: string, nombreNut: string){
      this.nutId = nutId;
      this.nombreNut = nombreNut;
    }
 }

  @nearBindgen
 class Paciente{
    accountId: string;
    nombreP: string;
    edad: u64;
    talla: u64;
    imc: u64;

    constructor(accountId: string, nombreP: string, edad: u64, talla: u64, imc: u64){
      this.accountId = accountId;
      this.nombreP = nombreP;
      this.edad = edad;
      this.talla = talla;
      this.imc = imc;
    }

 }
 
//Coleccion para almacenar los retos
const retos = new PersistentMap<string, Reto>("r");
const nutris = new PersistentMap<string, Nutriologo>("nut");

/**
 *    Metodos del smartcontract
 */
 export function crearReto(retoId: string, nombreReto: string, fechaInicio: string, monto: u32): void{
    //validamos los campos.
    assert(retoId != "", "Campo vacio, ingrese un valor");
    assert(nombreReto != "", "Campo vacio, ingrese un valor");
    assert(monto > 0, "el monto debe ser mayor a 0");

    let reto = new Reto(retoId, nombreReto, fechaInicio, monto);

    retos.set(retoId, reto);

    logging.log("reto creado de manera exitosa")
    
   // return reto;
 }


export function mostrarRetos(retoId: string): Reto | null {
  return retos.get(retoId);
}

export function agregarNutriologo(nutId: string, nombreNut: string): void {
    assert(nutId != "", "Campo vacio, ingrese un valor");
    assert(nombreNut != "", "Campo vacio, ingrese un valor");

    let nutri = new Nutriologo(nutId, nombreNut);

    nutris.set(nutId, nutri);

    logging.log("Nutriologo agregado correctamente :)")
}

export function mostrarNutriologos(nutId: string): Nutriologo | null {
  return nutris.get(nutId);
}
/**
 * Account IDs in NEAR are just strings.
 */

// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!
export function getGreeting(accountId: string): string | null {
  // This uses raw `storage.get`, a low-level way to interact with on-chain
  // storage for simple contracts.
  // If you have something more complex, check out persistent collections:
  // https://docs.near.org/docs/concepts/data-storage#assemblyscript-collection-types
  return storage.get<string>(accountId, DEFAULT_MESSAGE)
}

export function setGreeting(message: string): void {
  const accountId = Context.sender
  // Use logging.log to record logs permanently to the blockchain!
  logging.log(`Saving greeting "${message}" for account "${accountId}"`)
  storage.set(accountId, message)
}
