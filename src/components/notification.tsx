import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useCallback, useRef, ReactText } from "react";
import { ToastContainer, toast, ToastOptions } from "react-toastify";

import { getPendingResponseCount } from "../model/response-utils";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { retryFailedResponses } from "../actionCreators/response";
import { RootState } from "../store";

const NotificationPanel = () => {
  return (
    <>
      <ToastContainer />
      <PendingResponsePanel />
    </>
  );
};

const PendingResponsePanel = () => {
  const toastId = useRef<ReactText | undefined>(undefined);
  const dispatch = useDispatch();

  const pendingResponseCount = useSelector((state: RootState) =>
    getPendingResponseCount(state)
  );

  const dismiss = () => toast.dismiss(toastId.current);

  const notify = useCallback(() => {
    const options: ToastOptions = {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
    };
    if (!toastId.current) {
      toastId.current = toast.dark(
        `${pendingResponseCount} pending responses`,
        options
      );
      return;
    }
    toast.update(toastId.current, {
      render: `${pendingResponseCount} pending responses`,
    });
  }, [pendingResponseCount]);

  useEffect(() => {
    if (!pendingResponseCount) toastId.current && dismiss();
    else notify();
  }, [pendingResponseCount, notify]);

  useEffect(() => {
    dispatch(retryFailedResponses());
  }, [dispatch]);

  return null;
};

export default NotificationPanel;
