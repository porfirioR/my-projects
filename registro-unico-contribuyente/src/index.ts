import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function calculateParaguayanRuc(document: string) {
  let checkDigit = -1
  if(document && document.length >= 6 && !isNaN(+document)) {
    let multiplier = 2
    const module = 11
    const reverseDocument = document.split('').reverse()
    let result = 0
    reverseDocument.forEach(value => {
      result += multiplier * +value
      multiplier++
      if (multiplier > module) {
        multiplier = 2
      }
    })
    const rest = result % module
    checkDigit = rest > 1 ? module - rest : 0
  }
  return checkDigit
}

function youWishToContinue() {
  rl.question('¿Desea consultar otra cédula?\n-Continuar: Si/s\n-Salir(Cualquier Letra)\nIngrese Respuesta:', (x: string) => {
    const options = ['si', 's']
    if (options.includes(x.toLowerCase())) {
      insertValue()
    } else {
      rl.close()
    }
  })
}

function insertValue() {
  rl.question('Introduzca su cédula (más de 5 dígitos): ', (inputNumber) => {
    const ruc = calculateParaguayanRuc(inputNumber)
    console.log('*********************')
    console.log('*********************')
    const message = ruc != -1 ? `Su ruc es: ${inputNumber}-${ruc}` : 'Valor ingresado inválido, solo se permiten números (más de 4 dígitos)'
    console.log(message)
    console.log('*********************')
    console.log('*********************')
    youWishToContinue()
  })
}

function main() {
  insertValue()
}

main()