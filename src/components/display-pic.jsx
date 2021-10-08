import React from "react";
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import avatar from '../images/avartar.png'
import { createFileUploadAction } from "../actions/fileupload";
import { getFile } from '../model/fileupload';


const DisplayPic = ({ responseId, imageId }) => {
  const dispatch = useDispatch()
  const data = useSelector((state) => getFile(state, imageId))

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
    <div className="avartar">
      <a href="#head">
        <div id="image-container" style={{ backgroundImage: `url(${localUrl})` }} />
      </a>
      <FilePicker
        handleFile={(file) => handleFile(file)}
      />
    </div>
  )
}

DisplayPic.defaultProps = {
  imageId: null,
}


const FilePicker = ({ handleFile }) => (
  // disable this when a file is getting uploaded
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