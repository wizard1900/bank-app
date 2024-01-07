export async function newTransaction(from, to, amount, token) {

  const res = await fetch(`http://localhost:3000/transfer-funds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
    body: JSON.stringify({
      from,
      to,
      amount,
    }),
  });
}