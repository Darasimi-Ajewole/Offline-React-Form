import axios, { AxiosRequestConfig } from "axios";

const API_ROOT = "https://default-xwijo2rjaa-uc.a.run.app/public";
const START_UPLOAD_URL = `${API_ROOT}/start-upload`;

export interface SessionData {
  upload_url: string;
  blob_name: string;
}

export const startUploadSession = async (file: File): Promise<SessionData> => {
  let data, response;

  response = await axios.post(START_UPLOAD_URL, {
    data: { mimetype: file.type },
  });

  data = response.data;
  return data;
};

export const upload2Storage = async (
  uploadUrl: string,
  file: File,
  requestConfig: AxiosRequestConfig = {}
) => {
  const response = await axios({
    method: "put",
    url: uploadUrl,
    headers: { "Content-Type": file.type },
    data: file,
    ...requestConfig,
  });

  return response;
};

const uploadFile = async (
  file: File,
  requestConfig: AxiosRequestConfig = {}
): Promise<SessionData> => {
  const sessionData = await startUploadSession(file);
  const { upload_url: uploadUrl } = sessionData;
  await upload2Storage(uploadUrl, file, requestConfig);

  return sessionData;
};

export default uploadFile;
