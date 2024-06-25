import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import logo from "../../assets/jss_logo.jpg";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const img =
    "https://img.freepik.com/free-photo/black-white-background_23-2150531045.jpg";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, login } = useAuth();
  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to the dashboard or another appropriate route
    }
  }, [user, navigate]);
  const handleLogin = async (values) => {
    // e.preventDefault();
    try {
      await login(values);
      // login successful, the login function will handle navigation
    } catch (error) {
      console.log(error);
      // Assuming your login function might throw an error on failure
      // alert("Invalid username or password");
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the form submission
  };

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to right, #262626, #434343)",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "90vh",
          width: "80vw",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            width: "50%",
            height: "100%",
            borderRadius: 40,
            backgroundImage: `url(${img})`,
            // backgroundSize: "cover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img src={logo} width={300} style={{ borderRadius: "50%" }} />
          {/* <h2 style={{ color: "" }}>Welcome to JSS</h2> */}

          {/* Optionally, you can add content over your background image here */}
        </div>

        <div
          style={{
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              // width: "400px",
              height: "300px",
              width: "60%",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              borderRadius: 20,
            }}
          >
            <h3
              style={{ textAlign: "center", marginBottom: 40, marginTop: 20 }}
            >
              Login Account
            </h3>

            <Form onFinish={handleLogin}>
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  style={{ height: "40px" }}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                  style={{ height: "40px" }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%", height: "50px", background: "black" }}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
