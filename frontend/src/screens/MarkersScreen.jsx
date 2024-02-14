import { useEffect, useRef, useState } from "react";
import {
  useLazyGetMarkersQuery,
  useDelMarkerMutation,
  useUpdateMarkerMutation,
} from "../slices/markerApiSlice";
import Loader from "../components/Loader";
import catIcon from "../assets/catIcon.png";
import catIconNotFriendly from "../assets/catIconNotFriendly.png";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/userApiSlice";

const MarkersScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [markers, setMarkers] = useState();
  const [hidden, setHidden] = useState("none");
  const [getMarkers] = useLazyGetMarkersQuery();
  const [delMarker] = useDelMarkerMutation();
  const [updateMarker] = useUpdateMarkerMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log(error);

    }
  };

  const fetchMarkers = async () => {
    try {
      const res = await getMarkers().unwrap();
      setMarkers(res.markers);
    } catch (error) {
      console.log(error);
      if (error.status === 401) {
        logoutHandler();
        toast.error('Session expired, please sign in again')
      }
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
                  borderRadius: "10px",
                  border: "1px solid black",
                  width: "300px",
                  margin: "10px",
                  padding: "10px",
                  display: "inline-block",
                }}
              >
                <h1>
                  {marker.title}{" "}
                  <img src={marker.isFriendly ? catIcon : catIconNotFriendly} />
                  &nbsp;{" "}
                </h1>
                <input
                  placeholder="Name"
                  style={{ display: `${hidden}` }}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p>{marker.description} &nbsp;</p>
                <input
                  style={{ display: `${hidden}` }}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                />
                <div>
                  <button
                    onClick={() => handleUpdate(marker._id)}
                    style={{ display: `${hidden}` }}
                  >
                    {" "}
                    Update data
                  </button>
                </div>
                <div>
                  <img
                    src={marker.imgUrl}
                    style={{
                      height: "150px",
                      width: "200px",
                      borderRadius: "80px",
                    }}
                  />
                </div>
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
