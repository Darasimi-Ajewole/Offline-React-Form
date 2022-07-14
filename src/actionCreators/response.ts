import submitRequest from "../utils/submit";
import { uploadPendingFileAction } from "./fileupload";
import { getFailedResponses } from "../model/response-utils";
import {
  SUBMIT_RESPONSE,
  RESPONSE_SUBMITTED,
  FAILED_SUBMISSION,
} from "../actions";
import { RootState } from "../store";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { toast } from "react-toastify";

import { OfflineReqPayload } from "../offline";
import { ResponseSchema } from "../model/types";

export const submitResponseAction =
  (
    response: ResponseSchema,
    online = true
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    const customRequest = async ({ url, json }: OfflineReqPayload) => {
      if (response.displayPic) {
        await dispatch(uploadPendingFileAction(response.displayPic));
      }
      return await submitRequest({ url, json });
    };

    const toastMsg = online ? "Submitting Response" : "Response Recorded";
    toast.info(toastMsg);
    dispatch({
      type: SUBMIT_RESPONSE,
      payload: response,
      meta: {
        offline: {
          effect: {
            url: "https://jsonplaceholder.typicode.com/posts",
            json: response,
            customRequest,
          },
          // action to dispatch when effect succeeds:
          commit: { type: RESPONSE_SUBMITTED, meta: { id: response.id } },
          // action to dispatch if network action fails permanently:
          rollback: { type: FAILED_SUBMISSION, meta: { id: response.id } },
        },
      },
    });
  };

export const retryFailedResponses =
  (): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch, getState) => {
    const state = getState();
    const failedResponses = getFailedResponses(state).toRefArray();
    const online = state.offline.online;
    if (!online) return;
    failedResponses.forEach((response) =>
      dispatch(submitResponseAction(response, online))
    );
  };
