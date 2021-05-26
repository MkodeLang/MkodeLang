import Lexer from "./Lexer.js"

const source =
  "const func = (a, b) => a + b;\n# this is comment\nconst PI = 3.141592; #wow comment"
  //"\"hello\"\n38435.3824385"
const code = new Lexer(source)

console.log(code.lex())
