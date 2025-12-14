export enum TokenType {
  KEYWORD = "KEYWORD",
  STRING = "STRING",
  OPERATOR = "OPERATOR",
  IDENTIFIER = "IDENTIFIER",
  UNKNOWN = "UNKNOWN",
}

export interface Token {
  type: TokenType;
  value: string;
}

export class Tokenizer {
  static tokenizeSQL(input: string): Token[] {
    const tokens: Token[] = [];
    const keywords = [
      "SELECT",
      "FROM",
      "WHERE",
      "AND",
      "OR",
      "UNION",
      "DROP",
      "INSERT",
      "UPDATE",
      "DELETE",
      "TABLE",
    ];
    const operators = ["=", "!=", "<", ">", "<=", ">=", ";", "--"];

    // Split by whitespace but keep delimiters roughly involved
    // This is a naive tokenizer for educational visualization
    const parts = input
      .split(/(\s+|'[^']*'|"[^"]*"|[=;,<>]|--)/)
      .filter((p) => p.trim().length > 0);

    for (const part of parts) {
      const upper = part.toUpperCase();
      if (keywords.includes(upper)) {
        tokens.push({ type: TokenType.KEYWORD, value: upper });
      } else if (operators.includes(part)) {
        tokens.push({ type: TokenType.OPERATOR, value: part });
      } else if (part.startsWith("'") || part.startsWith('"')) {
        tokens.push({ type: TokenType.STRING, value: part });
      } else {
        tokens.push({ type: TokenType.IDENTIFIER, value: part });
      }
    }

    return tokens;
  }
}
