import localforage from "localforage";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";

import uploadFile from "../utils/upload";
import { v4 as uuidv4 } from "uuid";
import { CREATE_FILE, UPDATE_FILE } from "../actions";
import { getFile } from "../model/fileupload-utils";
import { RootState } from "../store";

export const createFileUploadAction =
  (
    fileBlob: File,
    responseId: string
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    const fileId = uuidv4();
    await localforage.setItem(fileId, fileBlob);

    dispatch({
      type: CREATE_FILE,
      payload: { id: fileId, responseId },
    });

    const online = getState().offline.online;
    if (online) dispatch(uploadFileAction(fileId, fileBlob));
  };

export const updateFileAction =
  (
    fileId: string,
    fileBlob: File
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    await localforage.setItem(fileId, fileBlob);

    dispatch({
      type: UPDATE_FILE,
      payload: { id: fileId, fileModified: new Date() },
    });

    const online = getState().offline.online;
    if (online) dispatch(uploadFileAction(fileId, fileBlob));
  };

export const uploadFileAction =
  (
    fileId: string,
    fileBlob: File
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    const requestConfig = {
      onUploadProgress: (progressEvent: ProgressEvent) =>
        dispatch({
          type: UPDATE_FILE,
          payload: {
            id: fileId,
            uploading: progressEvent.loaded !== progressEvent.total,
          },
        }),
    };
    const uploadData = await uploadFile(fileBlob, requestConfig);
    dispatch({
      type: UPDATE_FILE,
      payload: {
        id: fileId,
        uploadData,
      },
    });
  };

export const uploadPendingFileAction =
  (fileId: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    const file = getFile(getState(), fileId);
    const uploaded = Boolean(file.uploadData);
    if (uploaded) return;
    const fileBlob = await localforage.getItem<File>(file.id);
    if (!fileBlob) {
      console.error(`File blob missing ${fileId}`);
      return;
    }
    await dispatch(uploadFileAction(file.id, fileBlob));
    localforage.removeItem(file.id);
  };
