import Input from './input';
import RadioGroup from './radio-group';
import { useEffect, useCallback, } from 'react';
import { CREATE_RESPONSE, UPDATE_RESPONSE, RECORD_RESPONSE, submitResponseAction } from '../actions';
import { useDispatch, useSelector } from 'react-redux'
import { getResponse } from '../model';
import { v4 as uuidv4 } from 'uuid';

const Form = ({ responseId }) => {
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
    <form className="row register-form" onSubmit={handleSubmit}>
      <div className="col-md-6">
        <Input value={response.firstName} type="text" name="firstName" onChange={handleChange} placeholder="First Name *" />
        <Input value={response.lastName} type="text" name="lastName" onChange={handleChange} placeholder="Last Name *" />
        <RadioGroup options={GENDERS} selected={response.gender} name="gender" onChange={handleChange} />
      </div>


      <div className="col-md-6">
        <Input value={response.email} placeholder="Your Email *" type="email" name="email" onChange={handleChange} />
        <Input value={response.phone} placeholder="Your Phone *" type="text" name="phone" onChange={handleChange} />
        <input type="submit" className="btnRegister" defaultValue="Register" />
      </div>

    </form>
  )
}

const newResponseId = 'latest'

Form.defaultProps = {
  responseId: newResponseId,
}

const GENDERS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Prefer not to say', value: 'Prefer not to say' }
]

export default Form