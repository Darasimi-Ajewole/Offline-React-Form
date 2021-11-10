import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { retryFailedResponses, submitResponseAction } from '../actionCreators/response';
import { getFailedResponses } from '../model/response';
import { toast } from 'react-toastify';
import { uploadPendingFileAction } from '../actionCreators/fileupload';
import submitRequest from '../utils/submit';

jest.mock('../model/response', () => {
  const originalModule = jest.requireActual('../model/response');
  return {
    __esModule: true,
    ...originalModule,
    getFailedResponses: jest.fn(),
  };
});

jest.mock('../actionCreators/fileupload', () => {
  return {
    __esModule: true,
    uploadPendingFileAction: jest.fn()
  };
});

jest.mock('../utils/submit', () => {
  return {
    __esModule: true,
    default: jest.fn()
  };
});


const mockStore = configureMockStore([thunk])

const mockResponses = ['veni', 'vindi', 'vici'].map((id, idx) => {
  return { id, firstName: `Julia-${idx}`, lastName: `Ceasar-${idx}`, displayPic: `Golden-Goose-${id}` }
})

beforeEach(() => {
  getFailedResponses.mockReturnValue({ toRefArray: () => mockResponses })
})
test('checks if offline retry is skipped when user is offline', () => {
  const store = mockStore({ offline: { online: false } });
  store.dispatch(retryFailedResponses());
  const actions = store.getActions()
  expect(actions).toHaveLength(0)
})

test('Pending response is retried when online', () => {
  const store = mockStore({ offline: { online: true } });
  store.dispatch(retryFailedResponses());
  const actions = store.getActions();

  expect(actions).toHaveLength(3)
})

test('submit action gets dispatched appropriately', () => {
  const store = mockStore({ offline: { online: false } });
  const mockResponse = mockResponses[0];
  const spy = jest.spyOn(toast, 'info');

  store.dispatch(submitResponseAction(mockResponse, false));

  const actions = store.getActions()
  expect(actions).toHaveLength(1)
  expect(spy).toBeCalledWith('Response Recorded');
})

test('submit occurs succesfully when online', () => {
  const store = mockStore({ offline: { online: true } });
  const mockResponse = mockResponses[0];

  store.dispatch(submitResponseAction(mockResponse, false));
  const action = store.getActions()[0]
  expect(action.meta.offline.effect.json).toEqual(mockResponse)
})

test('pending files get uploaded on submission', async () => {
  const store = mockStore({ offline: { online: true } });
  const mockResponse = mockResponses[0];

  uploadPendingFileAction.mockReturnValue({ type: 'TEST ACTION' });
  submitRequest.mockReturnValue(mockResponse);

  store.dispatch(submitResponseAction(mockResponse));
  const action = store.getActions()[0]
  const { customRequest } = action.meta.offline.effect
  await customRequest(action.meta.offline.effect)
  expect(uploadPendingFileAction).toBeCalled()
  expect(submitRequest).toBeCalled()
})
