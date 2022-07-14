interface BaseActions {
  readonly type: string;
}

export interface CreateFileAction extends BaseActions {
  readonly payload: {
    id: string;
    responseId: string;
  };
}
export interface UpdateFileAction extends BaseActions {
  readonly payload: {
    id: string;
    fileModified: Date;
  };
}

export interface CreateResponseAction extends BaseActions {
  readonly payload: {
    id: string;
  };
}

export interface UpdateResponseAction extends BaseActions {
  readonly payload: { [key: string]: string };
}

export interface RecordResponseAction extends BaseActions {
  readonly payload: {
    id: string;
    recordResponseId: string;
  };
}

export interface SubmitResponseAction extends BaseActions {
  readonly meta: {
    id: string;
  };
}

export interface FailedResponseAction extends BaseActions {
  readonly meta: {
    id: string;
  };
}

export interface ErroredResponseAction extends BaseActions {
  readonly meta: {
    error: string;
  };
}
