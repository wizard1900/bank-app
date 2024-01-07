export async function getCurrentAcc(id, token) {

  const res = await fetch(`http://localhost:3000/account/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  });
  const resJson = await res.json();
  localStorage.setItem('currAccSave', JSON.stringify(resJson.payload))
  return resJson.payload;
}
