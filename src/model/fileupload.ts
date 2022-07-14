import { CREATE_FILE, UPDATE_FILE, DELETE_FILE } from "../actions";
import { Model, attr, ModelType } from "redux-orm";
import {
  CreateFileAction,
  UpdateFileAction,
  BaseActions,
} from "../actionCreators/action";
import type ResponseModel from "./response";
import { FileSchema } from "./types";

type Schema = {
  Response: ModelType<ResponseModel>;
};

export class FileModel extends Model<typeof FileModel, FileSchema> {
  static reducer(
    action: BaseActions,
    File: ModelType<FileModel>,
    session: any
  ) {
    let file, response;
    switch (action.type) {
      case CREATE_FILE:
        const createAction = action as CreateFileAction;
        const { id, responseId } = createAction.payload;
        file = File.create({ id });
        const { Response } = session as Schema;
        response = Response.withId(responseId);
        if (!response) {
          console.error(`Updated Response missing ${responseId}`);
          return;
        }
        response.displayPic = file.id;
        break;

      case UPDATE_FILE:
        const updateAction = action as UpdateFileAction;
        file = File.withId(updateAction.payload.id);
        if (!file) {
          console.error(`Updated file missing ${updateAction.payload.id}`);
          return;
        }
        file.update({ ...updateAction.payload, modified: new Date() });
        break;

      case DELETE_FILE:
        const deleteAction = action as CreateFileAction;
        file = File.withId(deleteAction.payload.id);
        if (!file) {
          console.error(`File already deleted: ${deleteAction.payload.id}`);
          return;
        }
        file.delete();
        break;

      default:
        break;
    }
  }
}

FileModel.modelName = "FileModel";

FileModel.fields = {
  id: attr(),
  created: attr({ getDefault: () => new Date() }),
  modified: attr(),
  fileModified: attr(),
  uploadData: attr(), // data about file stored in remote storage
  uploading: attr({ getDefault: () => false }),
};

export default FileModel;
