import avatar from '../images/avartar.png'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { createFileUploadAction } from "../actions/fileupload";
import { v4 as uuidv4 } from 'uuid';

// import { getFile } from "../model/fileupload"

import localforage from 'localforage';

// responseId, fileId,
// multiple file changes
// offline persistence
// clearing out unneeded blob
// clean up unneeded blob as soon as file is uploaded

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

  const handleFile = async (imageBlob) => {
    // if (id) return
    const imageId = uuidv4()
    await localforage.setItem(imageId, imageBlob)
    dispatch(createFileUploadAction(imageId, responseId))

  }

  return (
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