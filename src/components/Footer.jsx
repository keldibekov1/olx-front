import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <h2 style={styles.logo}>MyShop</h2>
        <p style={styles.text}>© {new Date().getFullYear()} MyShop. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#3E3F5B",
    color: "white",
    padding: "20px 0",
    textAlign: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  text: {
    fontSize: "14px",
    margin: "0",
    opacity: 0.8,
  },
};

export default Footer;
