import { ORM } from "redux-orm";
import FileModel from "./fileupload";
import ResponseModel from "./response";

const orm = new ORM({
  stateSelector: (state) => state.orm,
});

orm.register(FileModel, ResponseModel);

export default orm;
