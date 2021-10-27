import axios from "axios";

const API_ROOT = 'https://default-xwijo2rjaa-uc.a.run.app/public'
const START_UPLOAD_URL = `${API_ROOT}/start-upload`

export const startUploadSession = async (file) => {
  let data, status, response

  response = await axios.post(START_UPLOAD_URL, {
    data: { mimetype: file.type }
  });

  data = response.data
  status = response.status
  return { sessionData: data, status };
}

export const upload2Storage = async (uploadUrl, file, requestConfig = {}) => {
  const response = await axios({
    method: 'put',
    url: uploadUrl,
    headers: { 'Content-Type': file.type },
    data: file,
    ...requestConfig
  })

  return response
}

const uploadFile = async (file, requestConfig = {}) => {
  const { sessionData } = await startUploadSession(file);
  const { upload_url: uploadUrl, blob_name: blobName } = sessionData;
  const uploadResponse = await upload2Storage(uploadUrl, file, requestConfig);

  return uploadResponse && { blobName }
}

export default uploadFile