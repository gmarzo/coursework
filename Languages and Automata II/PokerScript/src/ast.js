//Code copied from carlos' ast.js must be modified

import fs from "fs"
import ohm from "ohm-js"
import * as core from "./core.js"

const psGrammar = ohm.grammar(fs.readFileSync("src/Pokerscript.ohm"))

const astBuilder = psGrammar.createSemantics().addOperation("ast", {
  Program(body) {
    return new core.Program(body.ast())
  },
  Statement_vardec(modifier, type, id, _colon, initializer) {
    return new core.VariableDeclaration(
      modifier.ast()?.[0],
      type.ast(),
      id.ast(),
      initializer.ast()
    )
  },

  Statement_print(_reveal, argument) {
    return new core.PrintStatement(argument.ast())
  },

  Assign(variable, op, expression) {
    return new core.Assignment(
      variable.ast(),
      op.sourceString,
      expression.ast()
    )
  },

  ForLoop(
    _playingLoose,
    _open,
    loopDec,
    _comma,
    breakCondition,
    _comma2,
    bump,
    _close,
    block
  ) {
    return new core.ForLoop(
      loopDec.ast(),
      breakCondition.ast(),
      bump.ast(),
      block.ast()
    )
  },

  LoopDec(type, id, _colon, exp) {
    return new core.LoopDec(type.ast(), id.ast(), exp.ast())
  },
  Inst(type, _colon, id) {
    return new core.Instantiation(type.ast(), id.ast())
  },

  // Statement_assign(variable, _eq, expression, _semicolon) {
  //   return new core.Assignment(variable.ast(), expression.ast())
  // },
  // TypeDecl(_struct, id, _left, fields, _right) {
  //   return new core.TypeDeclaration(new core.StructType(id.ast(), fields.ast()))
  // },
  // Field(id, _colon, type) {
  //   return new core.Field(id.ast(), type.ast())
  // },
  Statement_fundec(_straddle, type, id, _open, params, _close, block) {
    return new core.FunctionDeclaration(
      type.ast(),
      id.ast(),
      params.asIteration().ast(),
      block.ast()
    )
  },
  Block(_open, statements, _close) {
    return new core.Block(statements.ast())
  },
  // Param(id, _colon, type) {
  //   return new core.Parameter(id.sourceString, type.ast())
  // },
  // Type_array(_left, baseType, _right) {
  //   return new core.ArrayType(baseType.ast())
  // },
  // Type_function(_left, inTypes, _right, _arrow, outType) {
  //   return new core.FunctionType(inTypes.asIteration().ast(), outType.ast())
  // },
  // Type_optional(baseType, _questionMark) {
  //   return new core.OptionalType(baseType.ast())
  // },
  // Statement_bump(variable, operator, _semicolon) {
  //   return operator.sourceString === "++"
  //     ? new core.Increment(variable.ast())
  //     : new core.Decrement(variable.ast())
  // },
  // Statement_assign(variable, _eq, expression, _semicolon) {
  //   return new core.Assignment(variable.ast(), expression.ast())
  // },
  // Statement_call(call, _semicolon) {
  //   return call.ast()
  // },
  Statement_break(_fold) {
    return new core.BreakStatement()
  },
  Statement_return(_return, expression) {
    return new core.ReturnStatement(expression.ast())
  },
  // Statement_shortreturn(_return, _semicolon) {
  //   return new core.ShortReturnStatement()
  // },
  // IfStmt_long(_if, test, consequent, _else, alternate) {
  //   return new core.IfStatement(test.ast(), consequent.ast(), alternate.ast())
  // },

  Statement_ifStmt(_if, test, consequent, Elif, Else) {
    //console.log(Elif)
    return new core.IfStatement(
      test.ast(),
      consequent.ast(),
      Elif.children.map((x) => x.ast()),
      Else.ast()
    )
  },

  Elif(_elif, test, consequent) {
    return new core.IfStatement(test.ast(), consequent.ast(), [], [])
  },

  Else(_else, body) {
    return new core.IfStatement(true, body.ast(), [], [])
  },
  // Statement_ifShort(_if, test, consequent) {
  //   return new core.ShortIfStatement(test.ast(), consequent.ast())
  // },
  Statement_while(_while, test, body) {
    return new core.WhileStatement(test.ast(), body.ast())
  },
  Bump(operand, op) {
    if (op.sourceString === "+$") return new core.Increment(operand.ast())
    else return new core.Decrement(operand.ast())
  },
  Call(id, _open, args, _close) {
    return new core.Call(id.ast(), args.asIteration().ast())
  },
  Type_optional(type, _qmark) {
    return new core.OptionalType(type.ast())
  },
  Type_array(_flop, type) {
    return new core.ArrayType(type.ast())
  },
  // LoopStmt_repeat(_repeat, count, body) {
  //   return new core.RepeatStatement(count.ast(), body.ast())
  // },
  // LoopStmt_range(_for, id, _in, low, op, high, body) {
  //   return new core.ForRangeStatement(
  //     id.sourceString,
  //     low.ast(),
  //     op.sourceString,
  //     high.ast(),
  //     body.ast()
  //   )
  // },
  // LoopStmt_collection(_for, id, _in, collection, body) {
  //   return new core.ForStatement(id.sourceString, collection.ast(), body.ast())
  // },
  // Block(_open, body, _close) {
  //   // No need for a block node, just return the list of statements
  //   return body.ast()
  // },
  Exp_unary(op, operand) {
    return new core.UnaryExpression(op.sourceString, operand.ast())
  },
  Exp_ternary(test, _qmark, consequent, _colon, alternate) {
    return new core.Conditional(test.ast(), consequent.ast(), alternate.ast())
  },
  Exp1_binary(left, op, right) {
    return new core.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  Exp2_binary(left, op, right) {
    return new core.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  // Exp_conditional(test, _questionMark, consequent, _colon, alternate) {
  //   return new core.Conditional(test.ast(), consequent.ast(), alternate.ast())
  // },
  // Exp1_unwrapelse(unwrap, op, alternate) {
  //   return new core.BinaryExpression(
  //     op.sourceString,
  //     unwrap.ast(),
  //     alternate.ast()
  //   )
  // },
  // Exp2_or(left, _ops, right) {
  //   const operands = [left.ast(), ...right.ast()]
  //   return operands.reduce((x, y) => new core.BinaryExpression("||", x, y))
  // },
  // Exp2_and(left, _ops, right) {
  //   const operands = [left.ast(), ...right.ast()]
  //   return operands.reduce((x, y) => new core.BinaryExpression("&&", x, y))
  // },
  Exp3_binary(left, op, right) {
    return new core.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  // Exp3_bitxor(left, _ops, right) {
  //   const operands = [left.ast(), ...right.ast()]
  //   return operands.reduce((x, y) => new core.BinaryExpression("^", x, y))
  // },
  // Exp3_bitand(left, _ops, right) {
  //   const operands = [left.ast(), ...right.ast()]
  //   return operands.reduce((x, y) => new core.BinaryExpression("&", x, y))
  // },
  // Exp4_compare(left, op, right) {
  //   return new core.BinaryExpression(op.sourceString, left.ast(), right.ast())
  // },
  // Exp5_shift(left, op, right) {
  //   return new core.BinaryExpression(op.sourceString, left.ast(), right.ast())
  // },
  Exp4_binary(left, op, right) {
    return new core.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },

  Exp5_binary(left, op, right) {
    return new core.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },

  Exp6_binary(left, op, right) {
    return new core.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },

  Exp7_parens(_leftparens, exp, _rightparens) {
    return exp.ast()
  },

  Exp7_arrayexp(_leftbracket, entries, _rightbracket) {
    return new core.ArrayExpression(entries.asIteration().ast())
  },

  Exp7_subscript(array, _left, index, _right) {
    return new core.Subscript(array.ast(), index.ast())
  },

  // Exp7_binary(left, op, right) {
  //   return new core.BinaryExpression(op.sourceString, left.ast(), right.ast())
  // },

  // Exp8_unary(op, operand) {
  //   return new core.UnaryExpression(op.sourceString, operand.ast())
  // },
  // Exp9_emptyarray(_keyword, _left, _of, type, _right) {
  //   return new core.EmptyArray(type.ast())
  // },
  // Exp9_arrayexp(_left, args, _right) {
  //   return new core.ArrayExpression(args.asIteration().ast())
  // },
  // Exp9_emptyopt(_no, type) {
  //   return new core.EmptyOptional(type.ast())
  // },
  // Exp9_parens(_open, expression, _close) {
  //   return expression.ast()
  // },
  // Exp9_subscript(array, _left, subscript, _right) {
  //   return new core.SubscriptExpression(array.ast(), subscript.ast())
  // },
  // Exp9_member(object, _dot, field) {
  //   return new core.MemberExpression(object.ast(), field.sourceString)
  // },
  // Exp9_call(callee, _left, args, _right) {
  //   return new core.Call(callee.ast(), args.asIteration().ast())
  // },
  id(_first, _rest) {
    return new core.Token("Id", this.source)
  },
  hit(_) {
    return new core.Token("Bool", this.source)
  },
  miss(_) {
    return new core.Token("Bool", this.source)
  },
  intLit(_digits) {
    return new core.Token("Int", this.source)
  },
  floatLit(_whole, _point, _fraction, _e, _sign, _exponent) {
    return new core.Token("Float", this.source)
  },
  stringlit(_openQuote, chars, _closeQuote) {
    return new core.Token("Str", this.source)
  },
  // Type(_type) {
  //   return new core.Token("Type", this.source)
  // },
  _terminal() {
    return new core.Token("Sym", this.source)
  },
  _iter(...children) {
    return children.map((child) => child.ast())
  },
})

export default function ast(sourceCode) {
  const match = psGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  return astBuilder(match).ast()
}
