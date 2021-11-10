import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  createFileUploadAction, updateFileAction,
  uploadFileAction, uploadPendingFileAction
} from '../actionCreators/fileupload';
import { UPDATE_FILE, CREATE_FILE } from '../actions';
import uploadFile from '../utils/upload';
import { getFile } from '../model/fileupload';
import localforage from 'localforage';

const mockStore = configureMockStore([thunk])

jest.mock('../utils/upload', () => {
  return {
    __esModule: true,
    default: jest.fn()
  };
});

jest.mock('../model/fileupload', () => {
  return {
    __esModule: true,
    getFile: jest.fn(),
  };
});

const fileId = 'testFileId';
const fileBlob = 'testFileBlob';
const responseId = 'testResponseId';

let store;

beforeEach(() => {
  store = mockStore({ offline: { online: true } });
  uploadFile.mockReturnValue(fileBlob);
  getFile.mockReturnValue({ id: fileId, fileBlob })
})

test('files are getting uploaded correctly', async () => {
  await store.dispatch(uploadFileAction(fileId, fileBlob));

  const expectedActions = [
    {
      type: UPDATE_FILE,
      payload: { id: fileId, uploadData: fileBlob }
    }
  ]
  expect(uploadFile).toBeCalled()
  expect(store.getActions()).toStrictEqual(expectedActions);
})

test('File Rows are getting created in the database', async () => {
  await store.dispatch(createFileUploadAction(fileBlob, responseId));
  const actions = store.getActions();
  expect(actions).toHaveLength(2)
  const generatedFileId = actions[0].payload.id;
  const expectedActions = [
    {
      type: CREATE_FILE,
      payload: {
        id: generatedFileId,
        responseId
      }
    },
    {
      type: UPDATE_FILE,
      payload: { id: generatedFileId, uploadData: fileBlob }
    }
  ]
  expect(actions).toStrictEqual(expectedActions);
})

test('File Rows are getting updated in the database', async () => {
  await store.dispatch(updateFileAction(fileId, fileBlob));

  const actions = store.getActions();
  expect(actions).toHaveLength(2)
  const generatedDate = actions[0].payload.fileModified
  const expectedActions = [
    {
      type: UPDATE_FILE,
      payload: {
        id: fileId,
        fileModified: generatedDate,
      }
    },
    {
      type: UPDATE_FILE,
      payload: { id: fileId, uploadData: fileBlob }
    }
  ]
  expect(actions).toStrictEqual(expectedActions);
})

test('pending files are getting uploaded successfully', async () => {
  const spy = jest.spyOn(localforage, 'removeItem');

  await store.dispatch(uploadPendingFileAction(fileId));
  const state = store.getState();
  expect(getFile).toBeCalledWith(state, fileId);
  expect(spy).toBeCalledWith(fileId);

  const expectedActions = [
    {
      type: UPDATE_FILE,
      payload: { id: fileId, uploadData: fileBlob }
    }
  ]
  expect(store.getActions()).toStrictEqual(expectedActions)
})