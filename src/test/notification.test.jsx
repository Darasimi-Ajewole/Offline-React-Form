import { screen, waitFor } from '@testing-library/react';
import { render } from './test-utils';
import NotificationPanel from '../components/notification';
import { getPendingResponseCount } from '../model/response-utils';
import { retryFailedResponses } from '../actionCreators/response';
import { CREATE_RESPONSE, RESPONSE_SUBMITTED } from "../actions";
import { createTestStore } from '../store';

jest.mock('../actionCreators/response', () => {
  const originalModule = jest.requireActual('../actionCreators/response');
  return {
    __esModule: true,
    ...originalModule,
    retryFailedResponses: jest.fn(),
  };
});

describe('Users get notified appropriately for pending and failed responses', () => {
  let store
  beforeEach(() => {
    store = createTestStore()
    for (let i = 0; i < 5; i++) {
      store.dispatch({
        type: CREATE_RESPONSE,
        payload: {
          id: `WittyResponse${i}`,
          recorded: new Date()
        }
      });
    }
    store.dispatch({
      type: CREATE_RESPONSE,
      payload: {
        id: '555WittyResponse4',
        recorded: new Date(),
        failed: new Date()
      }
    });
    retryFailedResponses.mockReturnValue({ type: 'TEST ACTION' })
  });

  afterEach(() => {
    retryFailedResponses.mockReset()
  })

  it('renders Correct Notification', async () => {
    const pendingResponseCount = getPendingResponseCount(store.getState())
    render(<NotificationPanel />, store);
    const message = `${pendingResponseCount} pending responses`
    await waitFor(() => expect(screen.getByText(message)).toBeVisible())
    expect(retryFailedResponses).toHaveBeenCalled();
  });

  it('Successful Submission Update', async () => {
    const pendingResponseCount = getPendingResponseCount(store.getState())
    render(<NotificationPanel />, store);

    store.dispatch({
      type: RESPONSE_SUBMITTED,
      meta: {
        id: '555WittyResponse4',
      }
    });
    const message = `${pendingResponseCount - 1} pending responses`
    await waitFor(() => expect(screen.getByText(message)).toBeVisible())
  });

})
