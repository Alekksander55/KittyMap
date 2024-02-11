import { useEffect, useRef, useState } from "react";
import {
  useLazyGetMarkersQuery,
  useDelMarkerMutation,
  useUpdateMarkerMutation,
} from "../slices/markerApiSlice";
import Loader from "../components/Loader";
import catIcon from "../assets/catIcon.png";
import catIconNotFriendly from "../assets/catIconNotFriendly.png";
import { useSelector } from "react-redux";

const MarkersScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [markers, setMarkers] = useState();
  const [hidden, setHidden] = useState("none");
  const [getMarkers] = useLazyGetMarkersQuery();
  const [delMarker] = useDelMarkerMutation();
  const [updateMarker] = useUpdateMarkerMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const fetchMarkers = async () => {
    try {
      const res = await getMarkers().unwrap();
      setMarkers(res.markers);
    } catch (error) {
      console.log(error);
    }
  };

  const filterMarkers = markers?.filter(
    (marker) => marker.updatedBy === userInfo._id
  );

  useEffect(() => {
    fetchMarkers();
  }, []);

  const handleDel = async (id) => {
    try {
      const res = await delMarker(id);
      fetchMarkers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await updateMarker({ id, data: { title, description } });
      fetchMarkers();
      setHidden("none");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <center>
        <h1>My Cats</h1>

        {markers ? (
          filterMarkers.map((marker) => {
            return (
              <div
                key={marker._id}
                style={{
                  borderRadius: "40px",
                  border: "1px solid black",
                  margin: "20px",
                  padding: "20px",
                }}
              >
                <h1>
                  {marker.title}{" "}
                  <img src={marker.isFriendly ? catIcon : catIconNotFriendly} />
                  &nbsp;{" "}
                  <input
                    placeholder="Name"
                    style={{ display: `${hidden}` }}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </h1>
                <p>
                  {marker.description} &nbsp;
                  <input
                    placeholder="Description"
                    style={{ display: `${hidden}` }}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <button
                    onClick={() => handleUpdate(marker._id)}
                    style={{ display: `${hidden}` }}
                  >
                    {" "}
                    Update data
                  </button>
                </p>
                <p>Created by : {marker.user}</p>
                <button
                  onClick={() => {
                    if (hidden == "none") setHidden("");
                    else setHidden("none");
                  }}
                >
                  Edit
                </button>
                &nbsp;&nbsp;&nbsp;
                <button
                  onClick={() => {
                    handleDel(marker._id);
                  }}
                >
                  Erase
                </button>
              </div>
            );
          })
        ) : (
          <Loader />
        )}
      </center>
    </>
  );
};
export default MarkersScreen;
