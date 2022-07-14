import { OfflineReqPayload } from "../offline";

export const submit = async ({
  url,
  json,
}: OfflineReqPayload): Promise<any> => {
  const rawResponse = await fetch(url, {
    method: "POST",
    body: JSON.stringify(json),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const submitResponse = await rawResponse.json();
  return submitResponse;
};

export default submit;
