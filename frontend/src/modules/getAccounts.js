export async function getAccounts(token) {
  const res = await fetch('http://localhost:3000/accounts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  });
  const resJson = await res.json();
  return resJson.payload;

}
