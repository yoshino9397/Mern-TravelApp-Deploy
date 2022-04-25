import React, { useState, useEffect } from "react";
import { publicRequest } from "./config";
import { format } from "timeago.js";
import $ from "jquery";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./app.css";
import PushPinIcon from "@mui/icons-material/PushPin";
import StarIcon from "@mui/icons-material/Star";
import Register from "./components/Register";
import Login from "./components/Login";
import Loading from "./components/Loading";
import mapboxgl from "mapbox-gl";
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default; // eslint-disable-line

const App = () => {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const [loading, setLoading] = useState(false);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [file, setFile] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [pins, setPins] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewState, setViewState] = React.useState({
    longitude: 12,
    latitude: 55,
    zoom: 4,
    bearing: 0,
    pitch: 50,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await publicRequest.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({ ...viewState, latitude: lat, longitude: long });
    ///Even if you click the pin at the edge of the screen, it will move to the center!
  };

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lat: lat,
      long: lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploads");

    try {
      const uploadRes = await publicRequest.post(
        "https://api.cloudinary.com/v1_1/dz47zx0rk/image/upload",
        data
      );
      const { url } = uploadRes.data;
      const newPin = {
        username: currentUsername,
        title,
        desc,
        img: url,
        rating: star,
        lat: newPlace.lat,
        long: newPlace.long,
      };
      const res = await publicRequest.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  $("input").on("change", function () {
    var file = $(this).prop("files")[0];
    $(".shareOptionAdd").text(file.name);
  });

  return (
    <>
      <div className="topbar">
        <h1>Travel Map</h1>
      </div>
      <Map
        {...viewState}
        style={{
          width: "100vw",
          height: "100vh",
          transitionDuration: 200,
        }}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/yoshino9397/cl0owdyvc000a14ktyjdqkavl"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        onDblClick={currentUsername && handleAddClick}
      >
        {pins.map((p) => (
          <>
            <Marker
              longitude={p.long}
              latitude={p.lat}
              anchor="bottom"
              offsetLeft={-3.5 * viewState.zoom}
              offsetTop={-7 * viewState.zoom}
            >
              <PushPinIcon
                sx={{
                  fontSize: viewState.zoom * 7,
                  color: currentUsername === p.username ? "#c42034" : "#4b666e",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="left"
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h3 className="place texts">{p.title}</h3>
                  <label>Review</label>
                  <p className="desc texts">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<StarIcon className="star" />)}
                  </div>
                  <label>Photo</label>
                  <div className="photo">
                    <img src={p.img} alt="" className="image" />
                  </div>
                  <label>Info</label>
                  <span className="username">
                    Created by <b className="texts">{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="enter a title"
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Say us something about this place"
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setStar(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <label>Photo</label>
                <label className="shareOption">
                  <label htmlFor="file" className="labelAdd">
                    Add Pic
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <span className="shareOptionAdd">Not selected</span>
                </label>
                <button className="submitButton" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button
              className="button login"
              onClick={() => {
                setShowLogin(true);
                setShowRegister(false);
              }}
            >
              Login
            </button>
            <button
              className="button register"
              onClick={() => {
                setShowRegister(true);
                setShowLogin(false);
              }}
            >
              Register
            </button>
          </div>
        )}
        {loading && <Loading />}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUsername={setCurrentUsername}
          />
        )}
      </Map>
    </>
  );
};

export default App;
