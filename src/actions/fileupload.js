import localforage from 'localforage';
import uploadFile from '../utils/upload';
export const CREATE_FILE = 'CREATE_FILE';
export const UPDATE_FILE = 'UPDATE_FILE';
export const DELETE_FILE = 'DELETE_FILE';

export const createFileUploadAction = (fileId, fileBlob, responseId) => async (dispatch) => {
  await localforage.setItem(fileId, fileBlob)

  dispatch({
    type: CREATE_FILE,
    payload: {
      id: fileId,
      responseId,
    }
  })

  dispatch(uploadFileAction(fileId, fileBlob))
}

export const uploadFileAction = (fileId, fileBlob) => async (dispatch) => {
  const uploadData = await uploadFile(fileBlob);
  dispatch({
    type: UPDATE_FILE,
    payload: {
      id: fileId,
      uploadData
    }
  })
}