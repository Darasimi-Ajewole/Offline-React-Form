import { Model, ORM } from "redux-orm";
import {
  CREATE_RESPONSE, UPDATE_RESPONSE,
  RESPONSE_SUBMITTED, RECORD_RESPONSE,
} from "./actions";
import { createSelector } from 'redux-orm';
import { JS_ERROR } from '@redux-offline/redux-offline/lib/constants';
import { toast } from 'react-toastify';

export class Response extends Model {
  static reducer(action, Response) {
    let response;
    switch (action.type) {
      case CREATE_RESPONSE:
        Response.create(action.payload);
        break;

      case UPDATE_RESPONSE:
        response = Response.withId(action.payload.id);
        response.update(action.payload);
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
        response.update({ submitted: new Date() });
        break

      case JS_ERROR:
        console.error(action?.meta?.error)
        break
      default:
        break
    }
  }
}

Response.modelName = 'Response';

const orm = new ORM({
  stateSelector: state => state.orm,
});
orm.register(Response);

export default orm
export const getResponse = createSelector(orm.Response);
export const getPendingResponseCount = createSelector([orm], (session) =>
  session.Response.all().filter(response => response.recorded && !response.submitted).count()
)