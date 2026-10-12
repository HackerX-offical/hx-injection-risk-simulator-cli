import { MockDatabase } from '../src/sandbox/MockDatabase';

describe('MockDatabase', () => {
  test('returns all users on tautology bypass', () => {
    const db = new MockDatabase();
    const rows = db.executeQuery("SELECT * FROM users WHERE username = 'x' OR '1'='1'");
    expect(rows.length).toBe(4);
  });

  test('filters by username on normal query', () => {
    const db = new MockDatabase();
    const rows = db.executeQuery("SELECT * FROM users WHERE username = 'alice'");
    expect(rows).toHaveLength(1);
    expect(rows[0].username).toBe('alice');
  });

  test('reset clears query log', () => {
    const db = new MockDatabase();
    db.executeQuery('SELECT 1');
    expect(db.getState().queryLog.length).toBe(1);
    db.reset();
    expect(db.getState().queryLog).toHaveLength(0);
  });
});
