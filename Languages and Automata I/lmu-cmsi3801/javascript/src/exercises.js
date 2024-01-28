import crypto from "crypto"

export function change(amount) {
  if (amount < 0) {
    throw new RangeError("Change amount cannot be negative.")
  }

  let amountCopy = amount
  let change = [25, 10, 5]
  let answer = []

  change.map((element) => {
    answer.push(Math.floor(amountCopy / element))
    amountCopy -= Math.floor(amountCopy / element) * element
  })
  answer.push(amountCopy)

  return answer
}

export function stretched(phrase) {
  let extended = ""
  let spaceless = phrase.replaceAll(" ", "")
  let letters = [...spaceless]
  let repeats = 0

  letters.map(
    (char) => (repeats++, (extended = extended.concat(char.repeat(repeats))))
  )
  return extended
}

export function say(str) {
  let answer = ""
  if (str || str === "") {
    answer = str
    function recursionIsPain(anotherStr) {
      if (anotherStr || anotherStr === "") {
        answer = answer.concat(" ", anotherStr)
        return recursionIsPain
      } else {
        return answer
      }
    }
    return recursionIsPain
  } else {
    return ""
  }
}

export function powers(base, limit, callback) {
  let exp = 0

  do {
    callback(base ** exp)
    exp++
  } while (base ** exp <= limit)
}

export function* powersGenerator(base, limit) {
  let exp = 0

  do {
    yield base ** exp
    exp++
  } while (base ** exp <= limit)
}

export function makeCryptoFunctions(obj) {
  const { forKey: key, using: algorithm, withIV: iv } = obj

  function cipher(str) {
    const encrypter = crypto.createCipheriv(algorithm, key, iv)
    let encryptedMsg = encrypter.update(str, "utf-8", "hex")
    encryptedMsg += encrypter.final("hex")
    return encryptedMsg
  }
  function decipher(hexStr) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    let decryptedMsg = decipher.update(hexStr, "hex", "utf-8")
    decryptedMsg += decipher.final("utf-8")
    return decryptedMsg
  }

  return [cipher, decipher]
}

export function topTenScorers(input) {
  return Object.entries(input)
    .flatMap(([teamName, players]) =>
      players.map((player) => [...player, teamName])
    )
    .filter((player) => player[1] > 14)
    .map((player) => [player[0], player[2] / player[1], player[3]])
    .sort((x, y) => y[1] - x[1])
    .slice(0, 10)
    .map((p) => ({ name: p[0], ppg: p[1], team: p[2] }))
}

export function interpret(str) {
  let input = str.split(/(\s+)/).filter((word) => word !== " ")

  let answer = []
  let stack = []

  let first
  let second

  input.forEach((element) => {
    if (Number(element)) {
      stack.push(Number(element))
      return
      //return does the same thing as 'continue' does in a loop
    }
    if (["+", "-", "*", "/", "SWAP"].includes(element) && stack.length > 1) {
      first = stack.pop()
      second = stack.pop()
    } else if (
      ["NEG", "SQRT", "DUP", "SWAP", "PRINT", "+", "-", "*", "/"].includes(
        element
      ) &&
      stack.length === 0
    ) {
      throw new Error("Uncaught Error: Not enough operands")
    }
    switch (element) {
      case "+":
        stack.push(second + first)
        break
      case "-":
        stack.push(second - first)
        break
      case "*":
        stack.push(second * first)
        break
      case "/":
        stack.push(second / first)
        break
      case "NEG":
        stack.push(-1 * stack.pop())
        break
      case "SQRT":
        stack.push(Math.sqrt(stack.pop()))
        break
      case "DUP":
        stack.push(stack[stack.length - 1])
        break
      case "SWAP":
        stack.push(first)
        stack.push(second)
        break
      case "PRINT":
        answer.push(stack.pop())
        break
      default:
        throw new Error("Uncaught Error: Illegal Instruction: " + element)
    }
  })
  return answer
}
