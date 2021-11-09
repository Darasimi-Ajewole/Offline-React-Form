import localforage from 'localforage';
import uploadFile from '../utils/upload';
import { v4 as uuidv4 } from 'uuid';
import { CREATE_FILE, UPDATE_FILE } from '../actions';
import { getFile } from "../model/fileupload";

export const createFileUploadAction = (fileBlob, responseId) => async (dispatch, getState) => {
  const fileId = uuidv4()
  await localforage.setItem(fileId, fileBlob)

  dispatch({
    type: CREATE_FILE,
    payload: { id: fileId, responseId }
  })

  const online = getState().offline.online
  if (online) dispatch(uploadFileAction(fileId, fileBlob))
}

export const updateFileAction = (fileId, fileBlob) => async (dispatch, getState) => {
  await localforage.setItem(fileId, fileBlob)

  dispatch({
    type: UPDATE_FILE,
    payload: { id: fileId, fileModified: new Date() }
  })

  const online = getState().offline.online
  if (online) dispatch(uploadFileAction(fileId, fileBlob))
}

export const uploadFileAction = (fileId, fileBlob) => async (dispatch) => {
  const requestConfig = {
    onUploadProgress: progressEvent => dispatch({
      type: UPDATE_FILE,
      payload: {
        id: fileId,
        uploading: progressEvent.loaded !== progressEvent.total
      }
    })
  }
  const uploadData = await uploadFile(fileBlob, requestConfig);
  dispatch({
    type: UPDATE_FILE,
    payload: {
      id: fileId,
      uploadData
    }
  })
}

export const uploadPendingFileAction = (fileId) => async (dispatch, getState) => {
  const file = getFile(getState(), fileId)
  const uploaded = Boolean(file.uploadData)
  if (uploaded) return
  const fileBlob = await localforage.getItem(file.id)
  await dispatch(uploadFileAction(file.id, fileBlob))
  localforage.removeItem(file.id)
}