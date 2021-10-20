import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { getPendingResponseCount } from '../model/response';
import { useSelector } from 'react-redux'
import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { retryFailedResponses } from '../actions/response'

const NotificationPanel = () => {
  return (
    <>
      <ToastContainer />
      <PendingResponsePanel />
    </>
  )
}

const PendingResponsePanel = () => {
  const toastId = useRef(null);
  const dispatch = useDispatch()

  const pendingResponseCount = useSelector((state) => getPendingResponseCount(state))

  const dismiss = () => toast.dismiss(toastId.current);

  const notify = useCallback(() => {
    const options = {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false
    }
    if (!toastId.current) {
      toastId.current = toast.dark(`${pendingResponseCount} pending responses`, options);
      return
    }
    toast.update(toastId.current, {
      render: `${pendingResponseCount} pending responses`
    });
  }, [pendingResponseCount])


  useEffect(() => {
    if (!pendingResponseCount) toastId.current && dismiss()
    else notify()
  }, [pendingResponseCount, notify])

  useEffect(() => {
    dispatch(retryFailedResponses())
  }, [dispatch])

  return null;
}

export default NotificationPanel