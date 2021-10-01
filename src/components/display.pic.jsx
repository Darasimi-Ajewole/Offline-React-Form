import avatar from '../images/avartar.png'

const DisplayPic = () => {

  return (
    <div class="avartar">
      <a href="#head">
        <img src={avatar} alt="" />
      </a>
      <div class="avartar-picker">
        <input type="file" name="file-1[]" id="file-1" class="inputfile" data-multiple-caption="{count} files selected" multiple />
        <label for="file-1">
          <i class="zmdi zmdi-camera"></i>
          <span>Choose Picture</span>
        </label>
      </div>
    </div>

  )
}

export default DisplayPic