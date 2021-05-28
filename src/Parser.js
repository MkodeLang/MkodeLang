import { Binary, Grouping, Literal, Unary } from "./Expr.js"
import KodeError from "./Error.js"

export default class Parser {
  constructor (tokens) {
    this.tokens = tokens
    this.current = 0
  }

  parse () {
    try {
      return this._expression()
    } catch (err) {
      //console.log(err)
      return null
    }
  }

  _expression () {
    return this._equality()
  }

  _equality () {
    let expr = this._comparison()

    while (this.match("BANG_EQUAL", "EQUAL_EQUAL")) {
      const operator = this.previous(),
      right = this._comparison()
      return new Binary(expr, operator, right)
    }

    return expr
  }

  _comparison () {
    let expr = this._term()

    while (this.match("GREATER", "GREATER_EQUAL", "LESS", "LESS_EQUAL")) {
      const operator = this.previous(),
      right = this._term()
      return new Binary(expr, operator, right)
    }

    return expr
  }

  _term () {
    let expr = this._factor()

    while (this.match("PLUS", "MINUS")) {
      const operator = this.previous(),
      right = this._factor()
      return new Binary(expr, operator, right)
    }

    return expr
  }

  _factor () {
    let expr = this._unary()

    while (this.match("STAR", "SLASH")) {
      const operator = this.previous(),
      right = this._unary()
      return new Binary(expr, operator, right)
    }

    return expr
  }

  _unary () {
    if (this.match("BANG", "MINUS")) {
      const operator = this.previous(),
      right = this._unary()
      return new Unary(operator, right)
    }

    return this._primary()
  }

  _primary () {
    if (this.match("TRUE"))
      return new Literal(true)
    if (this.match("FALSE"))
      return new Literal(false)
    if (this.match("NULL"))
      return new Literal(null)
    if (this.match("UNDEFINED"))
      return new Literal(undefined)

    if (this.match("NUMBER", "STRING"))
      return new Literal(this.previous().literal)

    if (this.match("LEFT_PAREN")) {
      const expr = this._expression()
      this.consume("RIGHT_PAREN", "Expected ')' after expression.")
      return new Grouping(expr)
    }

    throw this.error(this.peek(), "Expect expression.")
  }

  match () {
    const args = Array.from(arguments)
    for (const i of args) {
      if (this.check(i)) {
        this.advance()
        return true
      }
    }
    return false
  }

  check (type) {
    if (this.isAtEnd())
      return false
    return this.peek().type === type
  }

  advance () {
    if (!this.isAtEnd())
      this.current++
    return this.previous()
  }

  isAtEnd () {
    return this.peek().type === "EOF"
  }

  peek () {
    return this.tokens[this.current]
  }

  previous () {
    return this.tokens[this.current - 1]
  }

  consume (type, message) {
    if (this.check(type))
      return this.advance()

    throw this.error(this.peek(), message)
  }

  error (token, message) {
    KodeError.error(token, 0, message)
    return new ParseError()
  }

  syncronize () {
    this.advance()

    while (!this.isAtEnd()) {
      if (this.previous().type === "SEMICOLON")
        return

      switch (this.peek().type) {
        case "CLASS":
        case "FUN":
        case "VAR":
        case "FOR":
        case "IF":
        case "WHILE":
        case "PRINT":
        case "RETURN":
          return
      }

      this.advance()
    }
  }
}

class ParseError extends Error {
  constructor (message) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = 'ParseKodeError'
    this.message = message
  }
}
