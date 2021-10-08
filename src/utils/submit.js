export const submit = async ({ url, response }) => {
  const rawResponse = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(response),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  const submitResponse = await rawResponse.json();
  return submitResponse
}

export default submit