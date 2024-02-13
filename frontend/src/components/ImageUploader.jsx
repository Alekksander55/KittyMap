import { useState } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

const ImageUploader = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState();
  const [imgUrl, setImgUrl] = useState(null);
  const handleChange = (e) => {
    console.log(e.target.files);
    setImage(e.target.files[0]);
  };

  const handleClick = () => {
    setIsLoading(true);
    const body = new FormData();
    body.set("key", import.meta.env.VITE_IMAGEBB_API_KEY);
    body.append("image", image);

    axios
      .post("https://api.imgbb.com/1/upload", body)
      .then((res) => {
        setImgUrl(res.data.data.display_url), setIsLoading(false);
      })
      .then(props.onUpload(imgUrl))

      .catch((err) => {
        console.log(err), setIsLoading(false);
      });
  };

  return (
    <>
      <h2>Upload your photo:</h2>
      <input type="file" onChange={handleChange} />
      <button type="button" onClick={handleClick}>
        Upload
      </button>
      &nbsp;
      <div>
        <br></br>
      <button onClick={() => props.onUpload(imgUrl)}> { isLoading ? <Spinner/> : <>Create Marker</>}</button>
      </div>
    </>
  );
};

export default ImageUploader;
