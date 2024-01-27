/**
 * Lexer and recursive descent parser
 * Takes a string representing a polynomial and responds with the derivative of the polynomial.
 * CMSI 3802 HW 2
 * Authors: Marvin Pramana, Warren Binder, Garrett Marzo, Evan Sciancalepore, and Narada Utoro Dewo.
 */

export function derivative(poly) {
  return differentiate([...parse([...tokenize(poly)])]);
}

class Term {
  constructor(coefficient, exponent) {
    this.coefficient = Number(coefficient);
    this.exponent = Number(exponent);
  }
}
class Operator {
  constructor(lexeme) {
    this.lexeme = lexeme;
  }
}

function* tokenize(s) {
  const term = /(\d+(\.\d+)?)?x(\^(-)?\d+)?|\d+(\.\d+)?/g;
  const operator = /[+-]/g;

  if (/\^\d+\./.test(s)) {
    throw new Error("Decimal in exponent.");
  }
  for (let i = 0; i < s.length; i++) {
    if (!/[\s\d\.x\^+-]/.test(s[i])) {
      throw new Error("Bad Character");
    }
    if (i > 0 && s[i].match(operator) && s[i - 1].match(operator)) {
      throw new Error("Cannot have double operators");
    }
  }

  let terms;
  s.match(term) != null ? (terms = [...s.match(term)].flat()) : null;
  s = s.replace(/\^(-)+/, ""); // Get rid of the negatives in exponents to ensure our operator count is correct
  let operators;
  s.match(operator) != null
    ? (operators = [...s.match(operator)].flat())
    : null;

  if (terms.length === 1 && Number.isInteger(Number(terms[0]))) {
    yield new Term(0, 0);
    return;
  }

  if (s[0] === "-" || s[1] === "-") {
    yield new Operator("-");
    operators.shift();
  }

  for (let i = 0; i < terms.length; i++) {
    let [coefficient, exponent] = terms[i].split("x");
    if (coefficient === "") coefficient = 1;
    exponent != undefined ? (exponent = exponent.replace("^", "")) : null;
    if (exponent === "") {
      exponent = 1;
    }
    if (exponent === undefined) {
      exponent = 0;
    }
    yield new Term(coefficient, exponent);
    if (operators === undefined) continue;
    if (i < operators.length) {
      yield new Operator(operators[i]);
    }
  }
}

function* parse(tokens) {
  let negate = false;
  for (let token of tokens) {
    if (token instanceof Operator) {
      token.lexeme === "-" ? (negate = true) : (negate = false);
    } else if (token instanceof Term) {
      if (negate) token.coefficient *= -1;
      yield token;
    }
  }
}

function differentiate(terms) {
  let coeffString;
  let xString = "";
  let exponString = "";
  if (terms.length === 1 && terms[0].coefficient === 0) {
    return "0";
  }

  let pwrRule = [];
  terms.map((t) =>
    pwrRule.push(new Term(t.exponent * t.coefficient, t.exponent - 1))
  );
  pwrRule = pwrRule.filter((t) => t.coefficient !== 0);
  if (pwrRule.length === 0) return "0";

  let output = "";
  for (let i = 0; i < pwrRule.length; i++) {
    let term = pwrRule[i];
    if (term.coefficient === 1 && term.exponent === 0) {
      coeffString = "1";
      xString = "";
      exponString = "";
    } else {
      term.coefficient == 1
        ? (coeffString = "")
        : (coeffString = term.coefficient.toString());
      i > 0 && term.coefficient > 0 ? (coeffString = "+" + coeffString) : null;
      exponString = "";
      xString = "x";
      if (term.exponent == 0) {
        xString = "";
      } else {
        term.exponent == 1
          ? (exponString = "")
          : (exponString = "^" + term.exponent.toString());
      }
    }

    let termString = coeffString + xString + exponString;
    output += termString;
  }

  return output;
}
