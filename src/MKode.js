import Lexer from "./Lexer.js"
import fs from "fs"
import Parser from "./Parser.js"

const source = fs.readFileSync("../test.kode").toString()
const lexer = new Lexer(source)
const tokens = lexer.lex()
const parser = new Parser(tokens)
const expression = parser.parse()

console.log(expression)
