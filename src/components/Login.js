import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="login-container">
     
      <form className="login-form" onSubmit={handleSubmit}>
      
       

        <center>
        <div><img src="https://i.ibb.co/tmwqkpj/logo.png" alt="website-logo" /></div>
          <p style={{ fontSize: "25px", paddingTop: "35px" }}>
            Log In to Citylytics
          </p>
          <p style={{ color: "#A8A8A8", fontFamily: "Arial" }}>
            Enter Your email and password below
          </p>
        </center>

        <div className="form-group">
          <label
            htmlFor="email"
            style={{ color: "#868686", paddingTop: "15px" }}
          >
            EMAIL
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email address"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" style={{ color: "#868686" }}>
            PASSWORD{" "}
            <span style={{ float: "right", fontSize: "14px" }}>
              <a href="/forgot-password">Forgot Password?</a>
            </span>
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <span
            className="password-toggle"
            onClick={togglePasswordVisibility}
            style={{
              float: "right",
              fontSize: "20px",
              cursor: "pointer",
              marginTop: "-30px",
              marginRight: "5px",
              position: "relative",
              zIndex: "2",
            }}
          >
            {showPassword ? (
              <i
                className="fas fa-eye"
                onClick={() => setShowPassword(false)}
              ></i>
            ) : (
              <i
                className="fas fa-eye-slash"
                onClick={() => setShowPassword(true)}
              ></i>
            )}
          </span>
        </div>

        <button type="submit">Log In</button>
        <div className="app-info">
          <p>BuildersApp Citylytics Version 1.0</p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
