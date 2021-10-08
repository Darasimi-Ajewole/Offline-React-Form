import submitRequest from "../utils/submit";
import { uploadFileAction } from "./fileupload";
import { toast } from 'react-toastify';
import localforage from 'localforage';
import { getFile } from "../model/fileupload";
export const UPLOAD_FILE = 'UPLOAD_FILE';
export const CREATE_RESPONSE = 'CREATE_RESPONSE';
export const UPDATE_RESPONSE = 'UPDATE_RESPONSE';
export const RECORD_RESPONSE = 'RECORD_RESPONSE';
export const SUBMIT_RESPONSE = 'SUBMIT_RESPONSE';
export const RESPONSE_SUBMITTED = 'RESPONSE_SUBMITTED';
export const FAILED_SUBMISSION = 'FAILED_SUBMISSION';
export const DELETE_RESPONSE = 'DELETE_RESPONSE';

export const submitResponseAction = (response, online = true) => async (dispatch, getState) => {
  const customRequest = async ({ url, json }) => {
    const displayPic = getFile(getState(), response.displayPic)
    if (displayPic) {
      const uploaded = Boolean(displayPic.uploadData)
      if (!uploaded) {
        const displayPicBlob = await localforage.getItem(displayPic.id)
        await dispatch(uploadFileAction(displayPic.id, displayPicBlob))
      }
      localforage.removeItem(displayPic.id)
    }
    return await submitRequest({ url, json })
  }

  const toastMsg = online ? 'Submitting Response' : 'Response Recorded' // modify the loader of this to match upload progress
  toast.info(toastMsg)
  dispatch({
    type: SUBMIT_RESPONSE,
    payload: response,
    meta: {
      offline: {
        effect: { url: "https://jsonplaceholder.typicode.com/posts", json: response, customRequest },
        // action to dispatch when effect succeeds:
        commit: { type: RESPONSE_SUBMITTED, meta: { id: response.id } },
        // action to dispatch if network action fails permanently:
        rollback: { type: FAILED_SUBMISSION, meta: { id: response.id } }
      }
    }
  })
}