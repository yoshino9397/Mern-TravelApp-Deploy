import React from "react";

const style = {
  width: "100vw",
  height: "100vh",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  zIndex: 100,
  backgroundColor: "rgba(25, 29, 47,0.65)",
};
const Loading = () => {
  return (
    <div style={style}>
      <h1
        style={{
          color: "white",
          textAlign: "center",
          fontSize: "50px",
          fontFamily: "Barrio",
        }}
      >
        Loading...
      </h1>
    </div>
  );
};

export default Loading;
