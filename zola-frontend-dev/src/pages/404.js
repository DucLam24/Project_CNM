import bg from "../assets/images/404-bg.svg";

const NotFound = () => {
  return (
    <div id="notfound" style={{ position: "relative", height: "100vh" }}>
      <div
        className="notfound"
        style={{
          position: "absolute",
          maxWidth: "410px",
          width: "100%",
          textAlign: "center",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="notfound-404"
          style={{
            height: "280px",
            marginBottom: "50px",
            position: "relative",
            zIndex: -1,
          }}
        >
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "230px",
              margin: 0,
              fontWeight: 900,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              background: `url(${bg}) no-repeat`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Oops!
          </h1>
        </div>
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            color: "#000000",
            fontSize: "24px",
            fontWeight: 700,
            textTransform: "uppercase",
            marginTop: 0,
          }}
        >
          404 - Page not found
        </h2>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            color: "#000000",
            fontSize: "14px",
            fontWeight: 400,
            marginBottom: "20px",
            marginTop: "0px",
          }}
        >
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
