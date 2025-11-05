import React from "react";
import { Card, Col, Row, Form, Input, Button, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { loginCandidate } from "../../services/auth/authService";
import { setCookie } from "../../helpers/cookie.jsx";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../actions/login";
import "./style.css";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Define validation rules
  const rules = [
    {
      required: true,
      message: "Trường này là bắt buộc!",
    },
  ];

  const onFinish = async (values) => {
    try {
      const res = await loginCandidate(values.email, values.password, "candidate");
      const payload = res?.data ?? res;
      const token = payload?.token || payload?.accessToken || payload?.access_token;
      const user = payload?.user || payload?.data || payload?.profile || {};
      if (!token) throw new Error("Missing token in response");

      const time = 1; // 1 day
      if (user?.id) setCookie("id", user.id, time);
      if (user?.fullName || user?.name) setCookie("fullName", user.fullName ?? user.name, time);
      setCookie("email", user.email ?? values.email, time);
      setCookie("token", token, time);
      setCookie("userType", "candidate", time);
      dispatch(checkLogin(true));
      messageApi.success("Đăng nhập thành công!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      messageApi.error("Email hoặc mật khẩu không đúng!");
      console.error("Login error:", error);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="login-container">
        <Row className="login-row" gutter={0}>
          {/* Left Column - Login Form */}
          <Col xs={24} lg={12} className="login-form-col">
            <div className="login-form-wrapper">
              {/* Logo Section */}
              <div className="logo-section">
                <img
                  src="/src/assets/logologin.png"
                  alt="RIKEI Edu Logo"
                  className="logo-image"
                />
              </div>

              {/* Heading */}
              <Title level={2} className="login-heading">
                Cùng Rikkei Education xây dựng hồ sơ nổi bật và nhận được các cơ
                hội sự nghiệp lý tưởng
              </Title>

              {/* Login Form */}
              <Form
                layout="vertical"
                onFinish={onFinish}
                className="login-form"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    ...rules,
                    {
                      type: "email",
                      message: "Email không hợp lệ!",
                    },
                  ]}
                >
                  <Input placeholder="abc@gmail.com" className="login-input" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    ...rules,
                    {
                      min: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự!",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="•••••••••••••"
                    className="login-input"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="login-button"
                    style={{ backgroundColor: "red", borderColor: "red" }}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>

                {/* Links */}
                <div className="login-links">
                  <Text className="forgot-password-link">Quên mật khẩu?</Text>
                  <Text className="signup-text">
                    Bạn không có tài khoản?{" "}
                    <Text className="signup-link">
                      <Link to="/register" style={{ color: "red" }}>
                        Tạo 1 tài khoản
                      </Link>
                    </Text>
                  </Text>
                </div>
              </Form>
            </div>
          </Col>

          {/* Right Column - Illustration */}
          <Col xs={24} lg={12} className="login-illustration-col">
            <div
              className="illustration-wrapper"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%", // ensures vertical centering within column
                minHeight: "100vh",
              }}
            >
              <img
                src="/src/assets/anhloginuser.png"
                alt="Career Growth Illustration"
                className="illustration-image"
                style={{
                  width: "80%",
                  maxWidth: "80%",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Login;
