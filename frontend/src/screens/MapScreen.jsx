import { useEffect, useRef, useState } from "react";
import ImageUploader from "../components/ImageUploader.jsx";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  CircleF,
  InfoWindowF,
  InfoWindow,
} from "@react-google-maps/api";
import { Form, Button, Row, Col } from "react-bootstrap";
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

const MapScreen = () => {
  const [userPosition, setUserPosition] = useState({ lat: 30, lng: 30 });
  const [markers, setMarkers] = useState();
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedMarker, setSelectedMarker] = useState();
  const [friendly, setFriendly] = useState(false);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });
  const [getMarkers] = useLazyGetMarkersQuery();
  const [addMarker, { isLoading }] = useAddMarkerMutation();

  const fetchMarkers = async () => {
    try {
      const res = await getMarkers().unwrap();
      setMarkers(res.markers);
    } catch (error) {
      console.log(error);
    }
  };

  // Load the Map with the user current position
  const handleStart = () => {
    navigator.geolocation.getCurrentPosition((position) =>
      setUserPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    );
  };

  // Load the markers from the MongoDB
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

  const handleClick = async () => {
    console.log(markers);
  };

  const handleNewMarker = async (e) => {
    e.preventDefault();
    try {
      const res = await addMarker({
        title: catName,
        description: catDesc,
        longitude: longitude,
        latitude: latitude,
        isFriendly: friendly,
        imgUrl:'test'
      });
      toast.success("A new cat was added to the map !");
      fetchMarkers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{
          height: "80vh",
          border: "2px solid black",
          margin: "20px",
          padding: "5px",
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
          center={userPosition}
          options={{
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
          }}
        >
          <>
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
                      console.log(selectedMarker);
                    }}
                  />
                </div>
              );
            })}
            {selectedMarker && (
              <InfoWindow
                onCloseClick={() => setSelectedMarker("")}
                position={{
                  lat: selectedMarker.location.coordinates[0],
                  lng: selectedMarker.location.coordinates[1],
                }}
              >
                <div style={{ border: "1px solid" }}>
                  <h4>Hello my name is "{selectedMarker.title}"</h4>
                  <h6>
                    {" "}
                    I'm a "{selectedMarker.description}" and{" "}
                    {selectedMarker.isFriendly
                      ? "i love to be pet"
                      : "i am wild, be careful"}
                  </h6>

                  <p>Added by {selectedMarker.user}</p>
                </div>
              </InfoWindow>
            )}
          </>
        </GoogleMap>
      </div>
      <center>
        <button onClick={handleStart}>Start !</button>{" "}
        <button onClick={handleClick}>Get Markers !</button>{" "}
      </center>

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
            Am i friendly/pettable ?
            <div>
              <input
                type="checkbox"
                value={friendly}
                onChange={(e) => setFriendly(e.target.checked)}
              />
            </div>
          </Form.Group>

          <ImageUploader />

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

          <Button type="submit" variant="primary" className="mt-3">
            Create Marker
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default MapScreen;
