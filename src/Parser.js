import { Binary, Grouping, Literal, Unary } from "./src/Expr.js"

class parser {
  constructor (tokens) {
    this.tokens = tokens
    this.current = 0
  }

  _expression () {
    return this._equality()
  }

  _equality () {
    const expr = this._comparison()

    while (this.match("BANG_EQUAL", "EQUAL_EQUAL")) {
      const operator = this.previous(),
      right = this._comparison()
      expr = Binary(expr, operator, right)
    }

    return expr
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
}
