import Input from './input';
import DisplayPic from './display-pic';
import { useEffect, useCallback, } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import { getResponse } from '../model/response';
import { v4 as uuidv4 } from 'uuid';
import {
  CREATE_RESPONSE, UPDATE_RESPONSE,
  RECORD_RESPONSE,
  submitResponseAction
} from '../actions';


const FormContainer = ({ responseId }) => {
  const dispatch = useDispatch()
  const response = useSelector((state) => getResponse(state, responseId))
  const online = useSelector((state) => state.offline.online)

  useEffect(() => {
    if (response) return
    dispatch({ type: CREATE_RESPONSE, payload: { id: responseId } })
  }, [response, responseId, dispatch])

  const handleChange = useCallback(
    (name, value) => dispatch({
      type: UPDATE_RESPONSE,
      payload: { [name]: value, id: responseId }
    }),
    [dispatch, responseId],
  );

  const handleSubmit = (event) => {
    event.preventDefault()
    const newResponse = responseId === newResponseId

    if (newResponse) {  // record response first
      const recordResponseId = uuidv4()
      dispatch({ type: RECORD_RESPONSE, payload: { id: responseId, recordResponseId } })
      response.id = recordResponseId;
    }
    dispatch(submitResponseAction(response, online))
  }

  if (!response) {
    return null // this can be some loader or some messaging
  }


  return (
    <FormUI
      response={response}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  )
}

const newResponseId = 'latest'

FormContainer.defaultProps = {
  responseId: newResponseId,
}

const FormUI = ({ response, handleChange, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div id="wizard">

      <section>
        <div className="form-header">
          <DisplayPic responseId={response.id} imageId={response.displayPic} />
          <div className="form-group">
            <Input value={response.firstName} type="text" name="firstName" onChange={handleChange} placeholder="First Name" />
            <Input value={response.lastName} type="text" name="lastName" onChange={handleChange} placeholder="Last Name" />
            <Input value={response.email} placeholder="Email Address" type="email" name="email" onChange={handleChange} />
          </div>
        </div>
        <Input value={response.dob} placeholder="Date of Birth" type="date" name="dob" onChange={handleChange} />
        <Input value={response.phone} placeholder="Phone Number" type="text" name="phone" onChange={handleChange} />
      </section>
      <div className="actions clearfix">
        <ul role="menu" className="actions-next">
          <li aria-hidden="true" style={{ visibility: "hidden" }}>
          </li>
          <li aria-hidden="false">
            <input type="submit" value="Sign Up" />
          </li>
        </ul>
      </div>

    </div>
  </form>

)

export default FormContainer