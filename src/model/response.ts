import { attr, Model, ModelType, oneToOne } from "redux-orm";
import {
  CREATE_RESPONSE,
  UPDATE_RESPONSE,
  RESPONSE_SUBMITTED,
  RECORD_RESPONSE,
  FAILED_SUBMISSION,
} from "../actions";
import { toast } from "react-toastify";
import { JS_ERROR } from "@redux-offline/redux-offline/lib/constants";
import {
  CreateResponseAction,
  UpdateResponseAction,
  RecordResponseAction,
  SubmitResponseAction,
  FailedResponseAction,
  BaseActions,
  ErroredResponseAction,
} from "../actionCreators/action";
import { ResponseSchema } from "./types";
import { FileModel } from "./fileupload";

export class ResponseModel extends Model<typeof ResponseModel, ResponseSchema> {
  static reducer(action: BaseActions, Response: ModelType<ResponseModel>) {
    let response, responseId;
    switch (action.type) {
      case CREATE_RESPONSE:
        const createAction = action as CreateResponseAction;
        Response.create(createAction.payload);
        break;

      case UPDATE_RESPONSE:
        const updateAction = action as UpdateResponseAction;
        response = Response.withId(updateAction.payload.id);
        if (!response) {
          console.error(`Updated Response with id: ${responseId} missing`);
          return;
        }
        response.update({ ...updateAction.payload, modified: new Date() });
        break;

      case RECORD_RESPONSE:
        const recordedAction = action as RecordResponseAction;
        const { id, recordResponseId } = recordedAction.payload;
        // Clone response and store
        const oldResponse = Response.withId(id);
        if (!oldResponse) {
          console.error(`Old Response with id: ${responseId} missing`);
          return;
        }
        const recordedResponse = {
          ...oldResponse.ref,
          id: recordResponseId,
          recorded: new Date(),
        };
        Response.create(recordedResponse);
        oldResponse.delete();
        break;

      case RESPONSE_SUBMITTED:
        const submittedResponse = action as SubmitResponseAction;
        responseId = submittedResponse.meta.id;
        response = Response.withId(responseId);
        if (!response) {
          console.error(`Submitted Response with id: ${responseId} missing`);
          return;
        }
        toast.info(
          `Response saved at ${response.recorded} submitted successfully`
        );
        response.update({ submitted: new Date(), failed: undefined });
        break;

      case FAILED_SUBMISSION:
        const failedSubmissionAction = action as FailedResponseAction;
        responseId = failedSubmissionAction.meta.id;
        response = Response.withId(responseId);
        if (!response) {
          console.error(`Failed Submission with id: ${responseId} missing`);
          return;
        }

        toast.error(
          `Oops, Something went wrong with submitting response saved at ${response.recorded} `,
          { autoClose: 7000 }
        );
        response.update({ failed: new Date() });
        break;

      case JS_ERROR:
        const erroredAction = action as ErroredResponseAction;
        console.error(erroredAction?.meta?.error);
        break;

      default:
        break;
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
  displayPic: oneToOne(FileModel.modelName),
};

ResponseModel.modelName = "Response";

export default ResponseModel;
