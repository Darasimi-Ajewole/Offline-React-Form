import avatar from '../images/avartar.png'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { createFileUploadAction } from "../actions/fileupload";
import { v4 as uuidv4 } from 'uuid';

import localforage from 'localforage';

// TODO: Do this following below
// Multiple file changes
// offline persistence
// clearing out unneeded blob
// clean up unneeded blob as soon as file is uploaded
// see the possibility of passing imageBlob to Display PIc, or pass a blob url
// On file submit offline, check if online activation the dispatch of file to upload occur correctly before submitting
const DisplayPic = ({ responseId, data }) => {
  const dispatch = useDispatch()
  const [localUrl, setLocalUrl] = useState()

  useEffect(() => {
    const loadLocalImage = async () => {
      if (!data) setLocalUrl(avatar)
      else if (data) { // persisted image
        const imageBlob = await localforage.getItem(data.id)
        const url = URL.createObjectURL(imageBlob)
        setLocalUrl(url)
      }
    }
    loadLocalImage(data)
  }, [data])

  const handleFile = (imageBlob) => {
    const imageId = data?.id || uuidv4()
    dispatch(createFileUploadAction(imageId, imageBlob, responseId))

  }

  return (
    // TODO: Set a biunduary on image plus frame
    <div className="avartar">
      <a href="#head">
        <img src={localUrl} alt="" />
      </a>
      <FilePicker
        handleFile={(file) => handleFile(file)}
      />
    </div>
  )
}

const FilePicker = ({ handleFile }) => (
  // disable this when a file is getting uploaded
  <div className="avartar-picker">
    <input
      type="file"
      name="displayPicture"
      id="file-1"
      className="inputfile"
      onChange={(e) => handleFile(e.target.files[0])}
    />
    <label htmlFor="file-1">
      <i className="zmdi zmdi-camera"></i>
      <span>Choose Picture</span>
    </label>
  </div>

)
export default DisplayPic