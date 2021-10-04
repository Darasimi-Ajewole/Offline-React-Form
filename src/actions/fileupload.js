export const CREATE_FILE = 'CREATE_FILE';
export const UPDATE_FILE = 'UPDATE_FILE';
export const DELETE_FILE = 'DELETE_FILE';

export const createFileUploadAction = (fileId, responseId) => {

  return {
    type: CREATE_FILE,
    payload: {
      id: fileId,
      responseId,
    }
  }
}