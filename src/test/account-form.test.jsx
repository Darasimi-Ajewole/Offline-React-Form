import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { render, isSuperObject } from './test-utils';

import { createTestStore } from '../store';
import AccountForm, { newResponseId } from '../components/account-form';
import { submitResponseAction } from '../actionCreators/response';
import { getResponse } from '../model/response-utils';
import { CREATE_RESPONSE, UPDATE_RESPONSE } from '../actions';

jest.mock('../actionCreators/response', () => {
  const originalModule = jest.requireActual('../actionCreators/response');
  return {
    __esModule: true,
    ...originalModule,
    submitResponseAction: jest.fn(),
  };
});


test('Checks if recorded response can be edited', async () => {
  const store = createTestStore()
  store.dispatch({ type: CREATE_RESPONSE, payload: { id: 'WittyResponse' } });
  store.dispatch({ type: UPDATE_RESPONSE, payload: { id: 'WittyResponse', firstName: 'James' } });
  render(<AccountForm responseId='WittyResponse' />, store);

  await waitFor(() => expect(screen.getByText('Sign Up')).toBeVisible())
  const dob = screen.getByDisplayValue('James')
  expect(dob).toBeVisible()
})

describe('Actions of account form', () => {
  let store
  const expectedVal = {
    firstName: 'Linus',
    lastName: 'torvald',
    email: 'guido@van.rossum',
    dob: '1970-01-01',
    phone: '+91037'
  }
  beforeEach(async () => {
    store = createTestStore()
    render(<AccountForm />, store);
    await waitFor(() => expect(screen.getByText('Sign Up')).toBeVisible())

    const firstName = screen.getByPlaceholderText('First Name')
    const lastName = screen.getByPlaceholderText('Last Name')
    const email = screen.getByPlaceholderText('Email Address')
    const dob = screen.getByPlaceholderText('Date of Birth')
    const phone = screen.getByPlaceholderText('Phone Number')

    userEvent.paste(firstName, 'Linus')
    userEvent.paste(lastName, 'torvald')
    userEvent.paste(email, 'guido@van.rossum')
    userEvent.paste(dob, '1970-01-01')
    userEvent.paste(phone, '+91037')
  });


  test('Checks if Account form has modified value', async () => {
    expect(screen.getByRole('form')).toHaveFormValues(expectedVal)
  })

  test('Checks if form response is recorded and submitted', async () => {
    const signUpButton = screen.getByText('Sign Up')
    submitResponseAction.mockReturnValue({ type: 'TEST ACTION' })
    const latestResponse = getResponse(store.getState(), newResponseId);
    expect(latestResponse.recorded).toBeFalsy()

    userEvent.click(signUpButton)
    expect(submitResponseAction).toHaveBeenCalled();
    const response = getResponse(store.getState())[0];
    expect(response.recorded).toBeTruthy()
    expect(isSuperObject(response, expectedVal)).toBeTruthy()
  })
})
