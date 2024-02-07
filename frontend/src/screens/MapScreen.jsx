import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

const MapScreen = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

  return (
    <div style={{height:'60vh', width:'80vw'}}>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerStyle={{height:'100%', width:'100%'}}
          center={center}
          zoom={10}
        />
      )}
    </div>
  );
};

export default MapScreen;
