export const submit = async ({ url, json }) => {
  const rawResponse = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(json),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  const response = await rawResponse.json();
  return response
}

export default submit