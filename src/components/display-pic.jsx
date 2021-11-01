import React from "react";
import localforage from 'localforage';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import avatar from '../images/avartar.png'
import { createFileUploadAction, updateFileAction } from "../actions/fileupload";
import { getFile } from '../model/fileupload';


const DisplayPic = ({ responseId, imageId }) => {
  const dispatch = useDispatch()
  const data = useSelector((state) => getFile(state, imageId) || {})

  const [localUrl, setLocalUrl] = useState(avatar)

  useEffect(() => {
    const loadLocalImage = async (imageId) => {
      if (!imageId) setLocalUrl(avatar)
      else { // persisted image
        const imageBlob = await localforage.getItem(imageId)
        const url = URL.createObjectURL(imageBlob)
        setLocalUrl(url)
      }
    }
    loadLocalImage(data.id)
  }, [data.id, data.fileModified])

  const handleFile = (imageBlob) => {
    if (data?.id) dispatch(updateFileAction(data.id, imageBlob))
    else dispatch(createFileUploadAction(imageBlob, responseId))
  }

  return (
    <div className="avartar">
      <a href="#head">
        <div id="image-container" style={{ backgroundImage: `url(${localUrl})` }} />
      </a>
      {!data?.uploading && <FilePicker handleFile={(file) => handleFile(file)} />}
    </div>
  )
}

DisplayPic.defaultProps = {
  imageId: null,
}


const FilePicker = ({ handleFile }) => (
  <div className="avartar-picker">
    <input
      type="file"
      name="displayPicture"
      id="file-1"
      className="inputfile"
      accept="image/*"
      onChange={(e) => handleFile(e.target.files[0])}
    />
    <label htmlFor="file-1">
      <i className="zmdi zmdi-camera"></i>
      <span>Choose Picture</span>
    </label>
  </div>

)
export default React.memo(DisplayPic)