import { Model, ORM } from "redux-orm";
import { CREATE_FORM, UPDATE_FORM } from "./actions";
import { createSelector } from 'redux-orm';

class Form extends Model {
  static reducer(action, Form) {
    let form;
    switch (action.type) {
      case CREATE_FORM:
        Form.create(action.payload);
        break;
      case UPDATE_FORM:
        form = Form.withId(action.payload.id);
        form.update(action.payload);
        break;
      default:
        break
    }
  }
}
Form.modelName = 'Form';

const orm = new ORM({
  stateSelector: state => state.orm,
});
orm.register(Form);

export default orm
export const getForm = createSelector(orm.Form);