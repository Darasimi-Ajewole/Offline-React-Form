import { Model, attr, oneToOne, createSelector } from "redux-orm";
import {
  CREATE_RESPONSE, UPDATE_RESPONSE,
  RESPONSE_SUBMITTED, RECORD_RESPONSE, FAILED_SUBMISSION,
} from "../actions";
import { toast } from 'react-toastify';
import { JS_ERROR } from '@redux-offline/redux-offline/lib/constants';
import orm from ".";
import FileModel from "./fileupload";


export class ResponseModel extends Model {
  static reducer(action, Response) {
    let response;
    switch (action.type) {
      case CREATE_RESPONSE:
        Response.create(action.payload);
        break;

      case UPDATE_RESPONSE:
        response = Response.withId(action.payload.id);
        response.update({ ...action.payload, modified: new Date() });
        break;

      case RECORD_RESPONSE:
        const { id, recordResponseId } = action.payload;
        // Clone response and store
        const oldResponse = Response.withId(id);
        const recordedResponse = { ...oldResponse.ref, id: recordResponseId, recorded: new Date() }
        Response.create(recordedResponse)
        oldResponse.delete()
        break;

      case RESPONSE_SUBMITTED:
        response = Response.withId(action.meta.id);
        toast.info(`Response saved at ${response.recorded} submitted successfully`)
        response.update({ submitted: new Date(), failed: null });
        break

      case FAILED_SUBMISSION:
        response = Response.withId(action.meta.id);
        toast.error(`Oops, Something went wrong with submitting response saved at ${response.recorded} `, { autoClose: 7000 })
        response.update({ failed: new Date() });
        break

      case JS_ERROR:
        console.error(action?.meta?.error)
        break

      default:
        break
    }
  }
}

ResponseModel.fields = {
  id: attr(),
  firstName: attr(),
  lastName: attr(),
  email: attr(),
  dob: attr(),
  phone: attr(),
  created: attr({ getDefault: () => new Date() }),
  modified: attr(),
  recorded: attr(),
  submitted: attr(),
  failed: attr(),
  displayPic: oneToOne(FileModel, 'response'),
}
ResponseModel.modelName = 'Response';

orm.register(ResponseModel);

export const getResponse = createSelector(orm.Response);
export const getPendingResponseCount = createSelector([orm], (session) =>
  session.Response.all().filter(response => response.recorded && !response.submitted).count()
)

export const getFailedResponses = createSelector([orm], (session) =>
  session.Response.all().filter(response => response.recorded && response.failed)
)

export default ResponseModel