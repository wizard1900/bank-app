export async function getCurrency(token) {
  const curr = await fetch('http://localhost:3000/currencies', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  });
  const currJson = await curr.json();
  const currency = await currJson.payload;

  return await currency;
}


export async function getChangedCurrency() {
  const currencyFeed = new WebSocket('ws://localhost:3000/currency-feed');

  return currencyFeed;
}