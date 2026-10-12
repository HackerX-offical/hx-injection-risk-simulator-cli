import { Tokenizer, TokenType } from '../src/utils/Tokenizer';

describe('Tokenizer', () => {
  test('classifies SQL keywords and operators', () => {
    const tokens = Tokenizer.tokenizeSQL("SELECT * FROM users WHERE id = 1");
    expect(tokens.some((t) => t.type === TokenType.KEYWORD && t.value === 'SELECT')).toBe(true);
    expect(tokens.some((t) => t.type === TokenType.OPERATOR && t.value === '=')).toBe(true);
  });

  test('preserves quoted strings', () => {
    const tokens = Tokenizer.tokenizeSQL("WHERE name = 'admin'");
    const strings = tokens.filter((t) => t.type === TokenType.STRING);
    expect(strings.length).toBeGreaterThan(0);
    expect(strings[0].value).toContain('admin');
  });

  test('tokenizes UNION injection fragments', () => {
    const tokens = Tokenizer.tokenizeSQL("' UNION SELECT username FROM users --");
    expect(tokens.map((t) => t.value)).toContain('UNION');
  });
});
