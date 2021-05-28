import Token from "./Token.js"
import Error from "./Error.js"

const keywords = [
  "while",
  "if",
  "else",
  "const",
  "assign",
  "getter",
  "setter",
  "undefined",
  "null",
  "return",
  "delete",
  "switch",
  "case",
  "attach",
  "true",
  "false"
]

export default class Lexer {
  constructor(source) {
    this.source = source
    this.tokens = []
    this.start = 0
    this.line = 1
    this.column = 1
    this.current = 0
    this.error = 0
  }

  lex() {
    while (!this.isAtEnd()) {
      this.start = this.current
      this.scanToken()
    }

    this.tokens.push(new Token("EOF", "", null, this.line))
    return this.error === 0 ? this.tokens : this.error
  }

  scanToken() {
    let c = this.advance()
    switch (c) {
      case "(":
        this.addToken("LEFT_PAREN")
        break
      case ")":
        this.addToken("RIGHT_PAREN")
        break
      case "{":
        this.addToken("LEFT_BRACE")
        break
      case "}":
        this.addToken("RIGHT_BRACE")
        break
      case ",":
        this.addToken("COMMA")
        break
      case ".":
        this.addToken("DOT")
        break
      case "-":
        this.addToken("MINUS")
        break
      case "+":
        this.addToken("PLUS")
        break
      case ";":
        this.addToken("SEMICOLON")
        break
      case "*":
        this.addToken("STAR")
        break
      case "/":
        this.addToken("SLASH")
        break
      case "!":
        this.addToken(this.match("=") ? "BANG_EQUAL" : "BANG")
        break
      case "%":
        this.addToken("MODULUS")
        break
      case "=":
        this.addToken(
          this.match("=")
            ? "EQUAL_EQUAL"
            : this.match(">")
            ? "EQUAL_GREATER"
            : "EQUAL"
        )
        break
      case "<":
        this.addToken(this.match("=") ? "LESS_EQUAL" : "LESS")
        break
      case ">":
        this.addToken(this.match("=") ? "GREATER_EQUAL" : "GREATER")
        break
      case "&":
        this.addToken(this.match("&") ? "AND_AND" : "AND")
        break
      case "|":
        this.addToken(this.match("|") ? "OR_OR" : "OR")
        break
      case "#":
        while (this.peek() !== "\n" && !this.isAtEnd()) this.advance()
        break
      case " ":
      case "\r":
      case "\t":
        break
      case "\n":
        this.newLine()
        break
      case '"':
        this.string()
        break
      default:
        if (this.isDigit(c)) this.number()
        else if (this.isAlpha(c)) this.identifier()
        else {
          Error.error(this.line, this.column, "Unexpected Character " + c)
          this.error = 1
        }
    }
  }

  string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") this.newLine()
      this.advance()
    }

    if (this.isAtEnd()) {
      Error.error(this.line, this.column, "Unterminated string literal")
      return 1
    }

    this.advance()

    const value = this.source.substring(this.start + 1, this.current - 1)
    this.addToken("STRING", value)
  }

  number() {
    while (this.isDigit(this.peek())) this.advance()

    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      this.advance()

      while (this.isDigit(this.peek())) this.advance()
    }

    this.addToken(
      "NUMBER",
      parseFloat(this.source.substring(this.start, this.current))
    )
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance()

    const text = this.source.substring(this.start, this.current)
    if (keywords.includes(text)) this.addToken(text.toUpperCase())
    else this.addToken("IDENITFIER")
  }

  isAtEnd() {
    return this.current >= this.source.length
  }

  advance() {
    this.column++
    return this.source[this.current++]
  }

  addToken(type, literal = null) {
    const text = this.source.substring(this.start, this.current)
    this.tokens.push(new Token(type, text, literal, this.line))
  }

  match(char) {
    if (this.isAtEnd()) return false
    if (this.source[this.current] !== char) return false

    this.column++
    this.current++
    return true
  }

  peek() {
    if (this.isAtEnd()) return "\0"
    return this.source[this.current]
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return "\0"
    return this.source[this.current + 1]
  }

  newLine() {
    /*if (!(this.tokens[this.tokens.length - 1].type === "NEWLINE"))
      this.addToken("NEWLINE")*/
    this.line++
    this.column = 1
  }

  isDigit(char) {
    return char >= "0" && char <= "9"
  }

  isAlpha(char) {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char == "_"
    )
  }

  isAlphaNumeric(char) {
    return this.isDigit(char) || this.isAlpha(char)
  }

  isEscape(char) {
    if ("bfnrtv0'\"\\u".includes(char))
      return true
    return false
  }

  parseString(string) {
    const length = string.length
    let newString = ""
    for (let i = 0; i < length; i++) {
      if (string[i] === "\\") {
        if (isEscape(string[i + 1])) {
          i++
          if ("\"\\'".includes(string[i])) {
            newString += string[i]
          }
        }
      } else {
        newString += string[i]
      }
    }
  }
}
