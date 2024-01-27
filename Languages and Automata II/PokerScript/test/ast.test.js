import assert from "assert"
import util from "util"
import ast from "../src/ast.js"

const source = `
chip x: 10
constantPressure stringBet y: "hello"
cashout [1,2,3]
straddle chip myfunc (chip: x) $.
    cashout 420
.$
excuses total <= 15 $.
  reveal "I'm not doing well..."
.$ followingExcuses total > 20  $.
  reveal "Big money"
.$ followingExcuses miss $.
  reveal "How did I get here?"
.$ noMoreExcuses $.
  reveal "Let's keep going!"
.$

-4
! y

hit || miss

flop stringBet names: ["Marvin", "Garrett", "Dr.Toal"]

rude Optional type
chip? my_optional_int: 4

rude Ternary operator
hit ? 420 : 64

3 +$
4 -$

myfunc(4)

hit && miss

2 + 4
4 - 2
5 * 6
60 / 5
61 % 5
2 ** 4
4 + (2*4)

reveal names[1]

4.20
`

const expected = `   1 | Program statements=[#2,#3,#4,#6,#10,#24,#25,#26,#27,#30,#32,#33,#34,#35,#36,#37,#38,#39,#40,#41,#42,#43,#45,(Float,"4.20")]
   2 | VariableDeclaration modifier=undefined type=(Sym,"chip") variable=(Id,"x") initializer=(Int,"10")
   3 | VariableDeclaration modifier=(Sym,"constantPressure") type=(Sym,"stringBet") variable=(Id,"y") initializer=(Str,""hello"")
   4 | ReturnStatement expression=#5
   5 | ArrayExpression elements=[(Int,"1"),(Int,"2"),(Int,"3")]
   6 | FunctionDeclaration returnType=(Sym,"chip") fun=(Id,"myfunc") parameters=[#7] body=#8
   7 | Instantiation type=(Sym,"chip") name=(Id,"x")
   8 | Block statements=[#9]
   9 | ReturnStatement expression=(Int,"420")
  10 | IfStatement test=#11 consequent=#12 alternates=[#14,#18] Else=[#21]
  11 | BinaryExpression op='<=' left=(Id,"total") right=(Int,"15")
  12 | Block statements=[#13]
  13 | PrintStatement argument=(Str,""I'm not doing well..."")
  14 | IfStatement test=#15 consequent=#16 alternates=[] Else=[]
  15 | BinaryExpression op='>' left=(Id,"total") right=(Int,"20")
  16 | Block statements=[#17]
  17 | PrintStatement argument=(Str,""Big money"")
  18 | IfStatement test=(Bool,"miss") consequent=#19 alternates=[] Else=[]
  19 | Block statements=[#20]
  20 | PrintStatement argument=(Str,""How did I get here?"")
  21 | IfStatement test=true consequent=#22 alternates=[] Else=[]
  22 | Block statements=[#23]
  23 | PrintStatement argument=(Str,""Let's keep going!"")
  24 | UnaryExpression op='-' operand=(Int,"4")
  25 | UnaryExpression op='!' operand=(Id,"y")
  26 | BinaryExpression op='||' left=(Bool,"hit") right=(Bool,"miss")
  27 | VariableDeclaration modifier=undefined type=#28 variable=(Id,"names") initializer=#29
  28 | ArrayType description='[stringBet]' baseType=(Sym,"stringBet")
  29 | ArrayExpression elements=[(Str,""Marvin""),(Str,""Garrett""),(Str,""Dr.Toal"")]
  30 | VariableDeclaration modifier=undefined type=#31 variable=(Id,"my_optional_int") initializer=(Int,"4")
  31 | OptionalType description='chip?' baseType=(Sym,"chip")
  32 | Conditional test=(Bool,"hit") consequent=(Int,"420") alternate=(Int,"64")
  33 | Increment operand=(Int,"3")
  34 | Decrement operand=(Int,"4")
  35 | Call callee=(Id,"myfunc") args=[(Int,"4")]
  36 | BinaryExpression op='&&' left=(Bool,"hit") right=(Bool,"miss")
  37 | BinaryExpression op='+' left=(Int,"2") right=(Int,"4")
  38 | BinaryExpression op='-' left=(Int,"4") right=(Int,"2")
  39 | BinaryExpression op='*' left=(Int,"5") right=(Int,"6")
  40 | BinaryExpression op='/' left=(Int,"60") right=(Int,"5")
  41 | BinaryExpression op='%' left=(Int,"61") right=(Int,"5")
  42 | BinaryExpression op='**' left=(Int,"2") right=(Int,"4")
  43 | BinaryExpression op='+' left=(Int,"4") right=#44
  44 | BinaryExpression op='*' left=(Int,"2") right=(Int,"4")
  45 | PrintStatement argument=#46
  46 | Subscript array=(Id,"names") index=(Int,"1")`

describe("The AST generator", () => {
  it("produces a correct AST", () => {
    assert.deepStrictEqual(util.format(ast(source)), expected)
  })
})
