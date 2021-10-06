import { CREATE_FILE, UPDATE_FILE, DELETE_FILE } from "../actions/fileupload";
import { Model, attr } from "redux-orm";
import orm from ".";

export class FileModel extends Model {
  static reducer(action, File, session) {
    let file, response;
    switch (action.type) {
      case CREATE_FILE:
        file = File.create(action.payload);
        const { Response } = session
        response = Response.withId(action.payload.responseId)
        response.displayPic = file.ref
        break;

      case UPDATE_FILE:
        file = File.withId(action.payload.id);
        file.update(action.payload);
        break;

      case DELETE_FILE:
        file = File.withId(action.payload.id);
        file.delete();
        break

      default:
        break
    }
  }
}
FileModel.modelName = 'FileModel';

FileModel.fields = {
  id: attr(),
  created: attr({ getDefault: () => new Date() }),
  modified: attr(),
  uploadData: attr(), // data about file stored in remote storage
  file: attr(),
}

orm.register(FileModel)

// export const getFile = createSelector(orm.FileModel);


export default FileModel
