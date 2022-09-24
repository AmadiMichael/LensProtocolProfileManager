import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div style={{ padding: "8em" }}>
      {" "}
      <Component {...pageProps} />{" "}
    </div>
  );
}

export default MyApp;
