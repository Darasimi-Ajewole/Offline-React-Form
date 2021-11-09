import submitRequest from "../utils/submit";
import { uploadPendingFileAction } from "./fileupload";
import { toast } from 'react-toastify';
import { getFailedResponses } from "../model/response";
import { SUBMIT_RESPONSE, RESPONSE_SUBMITTED, FAILED_SUBMISSION } from "../actions";

export const submitResponseAction = (response, online = true) => async (dispatch, getState) => {
  const customRequest = async ({ url, json }) => {
    if (response.displayPic) {
      await dispatch(uploadPendingFileAction(response.displayPic))
    }
    return await submitRequest({ url, json })
  }

  const toastMsg = online ? 'Submitting Response' : 'Response Recorded'
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

export const retryFailedResponses = () => (dispatch, getState) => {
  const state = getState()
  const failedResponses = getFailedResponses(state).toRefArray()
  const online = state.offline.online
  if (!online) return
  failedResponses.forEach((response) => dispatch(submitResponseAction(response, online)))
}