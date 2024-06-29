import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const BASE_URL = 'http://localhost:3000';

describe('integration', () => {
  it('should return the response from remote', async () => {
    const response = await fetch(`${BASE_URL}/anything`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'foo': 'bar'
      },
      body: JSON.stringify({ foo: 'bar' }),
    });

    assert.strictEqual(response.status, 200);

    const result = await response.json();

    assert.strictEqual(result.headers['Content-Type'], 'application/json');
    assert.strictEqual(result.headers.Foo, 'bar');
    assert.deepStrictEqual(result.json, { foo: 'bar' });
  });

  it('should propagate remote errors', async () => {
    const response = await fetch(`${BASE_URL}/status/500`);

    assert.strictEqual(response.status, 500);
  });
});