import submitRequest from "../utils/submit";
import { toast } from 'react-toastify';
export const UPLOAD_FILE = 'UPLOAD_FILE';
export const CREATE_RESPONSE = 'CREATE_RESPONSE';
export const UPDATE_RESPONSE = 'UPDATE_RESPONSE';
export const RECORD_RESPONSE = 'RECORD_RESPONSE';
export const SUBMIT_RESPONSE = 'SUBMIT_RESPONSE';
export const RESPONSE_SUBMITTED = 'RESPONSE_SUBMITTED';
export const FAILED_SUBMISSION = 'FAILED_SUBMISSION';
export const DELETE_RESPONSE = 'DELETE_RESPONSE';

export const submitResponseAction = (response, online = true) => {
  const toastMsg = online ? 'Submitting Response' : 'Response Recorded'
  toast.info(toastMsg)
  return {
    type: SUBMIT_RESPONSE,
    payload: response,
    meta: {
      offline: {
        effect: { url: "https://jsonplaceholder.typicode.com/posts", json: response, customRequest: submitRequest },
        // action to dispatch when effect succeeds:
        commit: { type: RESPONSE_SUBMITTED, meta: { id: response.id } },
        // action to dispatch if network action fails permanently:
        rollback: { type: FAILED_SUBMISSION, meta: { id: response.id } }
      }
    }
  }
}