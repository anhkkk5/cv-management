import React from "react";
import { Card, Col, Row, Form, Input, Button, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/Admin/adminServices";
import { setCookie } from "../../helpers/cookie.jsx";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../actions/login";
import "./style.css";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

function LoginAdmin() {
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
      const result = await loginAdmin(values.email, values.password);

      // Filter by password on client side
      const matchedAdmin = result.find(
        (admin) =>
          admin.email === values.email && admin.password === values.password
      );

      if (matchedAdmin) {
        const time = 1; // 1 day

        // Set cookies with admin data
        setCookie("id", matchedAdmin.id, time);
        setCookie("fullName", matchedAdmin.fullName, time);
        setCookie("email", matchedAdmin.email, time);
        setCookie("token", matchedAdmin.token, time);
        setCookie("userType", "admin", time);
        dispatch(checkLogin(true));
        messageApi.success("Đăng nhập thành công!");

        // Navigate to admin dashboard
        setTimeout(() => {
          navigate("/admin/jobs");
        }, 1500);
      } else {
        messageApi.error("Email hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      messageApi.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
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
                Đăng nhập Admin - Quản lý hệ thống Rikkei Education
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
                  <Input
                    placeholder="admin@gmail.com"
                    className="login-input"
                  />
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
                    Bạn không phải admin?{" "}
                    <Text className="signup-link">
                      <Link to="/login" style={{ color: "red" }}>
                        Đăng nhập người dùng
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
                height: "100%",
                minHeight: "100vh",
              }}
            >
              <img
                src="/src/assets/anhloginuser.png"
                alt="Admin Dashboard Illustration"
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

export default LoginAdmin;
