import { useEffect, useState } from "react";
import ImageUploader from "../components/ImageUploader.jsx";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  CircleF,
  InfoWindowF,
} from "@react-google-maps/api";
import { Form, Button } from "react-bootstrap";
import IconForUser from "../assets/IconForUser.png";
import catIcon from "../assets/catIcon.png";
import catIconNotFriendly from "../assets/catIconNotFriendly.png";
import Loader from "../components/Loader";
import {
  useLazyGetMarkersQuery,
  useAddMarkerMutation,
} from "../slices/markerApiSlice.js";
import FormContainer from "../components/FormContainer.jsx";
import { toast } from "react-toastify";
import "./MapScreen.css";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/userApiSlice";
import { useDispatch } from "react-redux";

const MapScreen = () => {
  const [userPosition, setUserPosition] = useState({ lat: 30, lng: 30 });
  const [initialPosition, setInitialPosition] = useState({ lat: 30, lng: 30 });
  const [form, setForm] = useState("none");
  const [markers, setMarkers] = useState();
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [latitude, setLatitude] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [longitude, setLongitude] = useState("");
  const [selectedMarker, setSelectedMarker] = useState();
  const [friendly, setFriendly] = useState(false);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });
  const [getMarkers] = useLazyGetMarkersQuery();
  const [addMarker, { isLoading }] = useAddMarkerMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  // handle logout if user got 401 response because jwt expired
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // fetch the markers from the MongoDB
  const fetchMarkers = async () => {
    try {
      const res = await getMarkers().unwrap();
      setMarkers(res.markers);
    } catch (error) {
      console.log(error);
      if (error.status === 401) {
        logoutHandler();
        toast.error("Session expired, please sign in again");
      }
    }
  };

  // Load the Map with the user current position
  const handleStart = () => {
    navigator.geolocation.watchPosition((position) =>
      setUserPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    );
    navigator.geolocation.getCurrentPosition((position) =>
      setInitialPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    );
  };

  // Load the markers from  MongoDB
  useEffect(() => {
    fetchMarkers();
    handleStart();
  }, []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }
  if (!isLoaded) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  // This function is getting the URL from the ImageUploader Child component
  const handleOnUpload = (imgUrl) => {
    setImgUrl(imgUrl);
  };

  // Send the data to the MongoDB to add a marker
  const handleNewMarker = async (e) => {
    e.preventDefault();
    try {
      const res = await addMarker({
        title: catName,
        description: catDesc,
        longitude: longitude,
        latitude: latitude,
        isFriendly: friendly,
        imgUrl,
      });
      setForm("none")
      fetchMarkers();
      if(!res.error)
      toast.success("A new cat was added to the map !");
    } catch (error) {
      console.log(error);
      if (error.status === 401) {
        logoutHandler();
        toast.error("Session expired, please sign in again");
      }
    }
  };

  return (
    <>
      <center>
        <div
          style={{
            height: "100vh",
            width: "90vw",
            border: "2px solid black",
            margin: "20px",
            padding: "5px",
            position:'relative'
          }}
        >
          <GoogleMap
            onClick={(e) => {
              setLatitude(e.latLng.lng());
              setLongitude(e.latLng.lat());
            }}
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            zoom={18}
            center={initialPosition}
            options={{
              fullscreenControl: false,
              mapTypeControl: false,
              streetViewControl: false,
            }}
          >
            <>
              <Button
                variant="warning"
                style={{ position: "absolute",top:'5px', left:'10px', zIndex: "1" }}
                onClick={() => (form == "none" ? setForm("") : setForm("none"))}
              >
                New Marker
              </Button>
              <div style={{ display: `${form}` }}>
                <FormContainer>
                  <h2>Add a Cat Marker </h2>

                  <Form onSubmit={handleNewMarker}>
                    <Form.Group className="my-2">
                      My Name is{" "}
                      <Form.Control
                        type="text"
                        placeholder="Cat Name"
                        value={catName}
                        required={true}
                        onChange={(e) => setCatName(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group className="my-2">
                      I'm a
                      <Form.Control
                        type="text"
                        placeholder="Cat description"
                        value={catDesc}
                        required={true}
                        onChange={(e) => setCatDesc(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group className="my-2">
                      Am i friendly/pettable ? &nbsp;
                      <input
                        type="checkbox"
                        value={friendly}
                        onChange={(e) => setFriendly(e.target.checked)}
                      />
                    </Form.Group>

                    <Form.Group className="my-2">
                      <Form.Control
                        style={{ backgroundColor: "lightgray" }}
                        placeholder="Longitude : Click on the map"
                        value={longitude}
                        required={true}
                        readOnly={true}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group className="my-2">
                      <Form.Control
                        style={{ backgroundColor: "lightgray" }}
                        placeholder="Latitude : Click on the map"
                        value={latitude}
                        required={true}
                        readOnly={true}
                      ></Form.Control>
                    </Form.Group>

                    {isLoading && <Loader />}

                    <ImageUploader onUpload={handleOnUpload} />
                  </Form>
                </FormContainer>
              </div>
              <MarkerF position={userPosition} icon={IconForUser} />
              <CircleF
                center={userPosition}
                radius={20}
                options={{
                  fillColor: "blue",
                  fillOpacity: 0.2,
                  strokeColor: "blue",
                  strokeOpacity: 0.3,
                  strokeWeight: 1,
                }}
              />
            </>
            <>
              {markers?.map((marker) => {
                return (
                  <div key={marker._id}>
                    <MarkerF
                      position={{
                        lat: marker.location.coordinates[0],
                        lng: marker.location.coordinates[1],
                      }}
                      icon={marker.isFriendly ? catIcon : catIconNotFriendly}
                      onClick={() => {
                        setSelectedMarker(marker);
                      }}
                    />
                  </div>
                );
              })}
              {selectedMarker && (
                <InfoWindowF
                  onCloseClick={() => setSelectedMarker("")}
                  position={{
                    lat: selectedMarker.location.coordinates[0],
                    lng: selectedMarker.location.coordinates[1],
                  }}
                >
                  <center>
                    <h4>"{selectedMarker.title}"</h4>
                    <h6>
                      {" "}
                      {selectedMarker.description} and{" "}
                      {selectedMarker.isFriendly
                        ? "i love to be pet"
                        : "i am wild, be careful"}
                    </h6>
                    <img
                      src={selectedMarker.imgUrl}
                      style={{
                        height: "150px",
                        width: "150px",
                        borderRadius: "75px",
                      }}
                    />

                    <p>Added by {selectedMarker.user}</p>
                  </center>
                </InfoWindowF>
              )}
            </>
          </GoogleMap>
        </div>
      </center>
    </>
  );
};

export default MapScreen;
