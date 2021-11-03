import { screen, waitFor } from '@testing-library/react'
import { createFileUploadAction, updateFileAction } from "../actions/fileupload";
import DisplayPic from '../components/display-pic';
import { CREATE_RESPONSE } from "../actions/response";
import { CREATE_FILE, UPDATE_FILE } from "../actions/fileupload";
import { render } from './test-utils';
import userEvent from '@testing-library/user-event';
import store from '../store';

jest.mock('../actions/fileupload', () => {
  const originalModule = jest.requireActual('../actions/fileupload');
  return {
    __esModule: true,
    ...originalModule,
    createFileUploadAction: jest.fn(),
    updateFileAction: jest.fn(),
  };
});

test('renders Display Picture component', () => {
  render(<DisplayPic responseId='funny' imageId='response' />);
  expect(screen.getByText('Choose Picture')).toBeVisible()
  expect(screen.getByTitle('display-picture')).toHaveAttribute('style', 'background-image: url(avartar.png);')
});

test('first Image upload dispatches correct action', () => {
  const file = new File(['hello'], 'hello.png', { type: 'image/png' });
  createFileUploadAction.mockReturnValue({ type: 'TEST ACTION' })
  render(<DisplayPic responseId='funny' imageId='response' />);
  const input = screen.getByLabelText(/choose picture/i)
  userEvent.upload(input, file)

  expect(input.files[0]).toStrictEqual(file)
  expect(input.files.item(0)).toStrictEqual(file)
  expect(input.files).toHaveLength(1)
  expect(createFileUploadAction).toHaveBeenCalled();
})

const imgUrl = 'blob:https://offline-react-form.web.app/'

describe('Actions after first Image upload', () => {
  beforeEach(() => {
    store.dispatch({ type: CREATE_RESPONSE, payload: { id: 'WittyResponse' } });
    store.dispatch({ type: CREATE_FILE, payload: { id: 'lovelyImage', responseId: 'WittyResponse' } })
    window.URL.createObjectURL.mockReturnValue(imgUrl)
  });
  afterEach(() => {
    window.URL.createObjectURL.mockReset()
  })

  it('Previously added image displays between page reload', async () => {
    render(<DisplayPic responseId='WittyResponse' imageId='lovelyImage' />);
    await waitFor(() => expect(window.URL.createObjectURL).toHaveBeenCalled())
    expect(screen.getByTitle('display-picture')).toHaveAttribute('style', `background-image: url(${imgUrl});`)
  })

  it('Subsequent Image upload dispatches correct action', async () => {
    render(<DisplayPic responseId='WittyResponse' imageId='lovelyImage' />);
    await waitFor(() => expect(window.URL.createObjectURL).toHaveBeenCalled())

    updateFileAction.mockReturnValue({ type: 'TEST ACTION' })
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByLabelText(/choose picture/i)
    userEvent.upload(input, file)
    expect(updateFileAction).toHaveBeenCalled();
  })

  it('Choose Picture button is hidden while image is being uploaded', async () => {
    render(<DisplayPic responseId='WittyResponse' imageId='lovelyImage' />);
    await waitFor(() => expect(window.URL.createObjectURL).toHaveBeenCalled())
    expect(screen.getByText('Choose Picture')).toBeVisible()

    store.dispatch({ type: UPDATE_FILE, payload: { id: 'lovelyImage', uploading: true } })
    await waitFor(() => expect(screen.queryByText('Choose Picture')).toBeNull())
  })
})
