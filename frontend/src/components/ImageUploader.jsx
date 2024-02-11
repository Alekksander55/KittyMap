import { useState } from "react";
import axios from 'axios'

const ImageUploader = () => {
  const [image, setImage] = useState();
  const [displayImage, setDisplayImage] = useState();
  const [imgUrl, setImgUrl] = useState(null)
  const handleChange = (e) => {
    console.log(e.target.files);
    setDisplayImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  const handleUpload = () => {
 const body = new FormData()
 body.set('key', import.meta.env.VITE_IMAGEBB_API_KEY) 
 body.append('image', image)
axios.post('https://api.imgbb.com/1/upload', body)
.then((res)=>setImgUrl(res.data.data.display_url))

console.log(imgUrl)
 

}
  return (
    <>
      <h2>Add Image:</h2>
      <input type="file" onChange={handleChange} />
      <img src={displayImage} width="200px" height="200px" />
      <button onClick={handleUpload}>Upload</button>
    </>
  );
};

export default ImageUploader;
