import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, Button, message, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { registerCandidate } from "../../services/auth/authService";
import "../../pages/login/style.css";

const { Title, Text } = Typography;

function Register() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const rules = [
    {
      required: true,
      message: "Trường này là bắt buộc!",
    },
  ];

  const onFinish = async (values) => {
    try {
      if (values.password !== values.confirmPassword) {
        messageApi.error("Mật khẩu xác nhận không khớp!");
        return;
      }

      // API requires: email, password, role
      const payload = {
        email: values.email,
        password: values.password,
        role: "candidate",
      };

      const result = await registerCandidate(payload);
      const resData = result?.data ?? result;
      if (resData) {
        messageApi.success("Đăng ký thành công!");
        form.resetFields();
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        messageApi.error("Đăng ký thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Đăng ký thất bại. Vui lòng kiểm tra thông tin!";
      messageApi.error(msg);
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="login-container">
        <Row className="login-row" gutter={0}>
          <Col xs={24} lg={12} className="login-form-col">
            <div className="login-form-wrapper">
              <div className="logo-section">
                <img src="/src/assets/logologin.png" alt="RIKEI Edu Logo" className="logo-image" />
              </div>
              <Title level={2} className="login-heading">
                Cùng Rikkei Education xây dựng hồ sơ nổi bật và nhận được cơ hội sự nghiệp lý tưởng
              </Title>
              <Form form={form} layout="vertical" onFinish={onFinish} className="login-form">
              {/* Họ tên không bắt buộc theo API /auth/register */}
              <Form.Item label="Họ tên" name="fullName">
                <Input placeholder="Nhập họ tên" className="login-input" />
              </Form.Item>
                <Form.Item label="Email" name="email" rules={[...rules, { type: "email", message: "Email không hợp lệ!" }]}>
                  <Input placeholder="abc@gmail.com" className="login-input" />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[...rules, { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" }]}>
                  <Input.Password placeholder="********" className="login-input" iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                </Form.Item>
                <Form.Item label="Confirm password" name="confirmPassword" rules={[...rules, { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" }]}>
                  <Input.Password placeholder="********" className="login-input" iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block className="login-button" style={{ backgroundColor: "red", borderColor: "red" }}>
                    Đăng ký
                  </Button>
                </Form.Item>
                <div className="login-links">
                  <Text className="signup-text">
                    Bạn đã có tài khoản? <Text className="signup-link" onClick={() => navigate("/login")}>Đăng nhập ngay</Text>
                  </Text>
                </div>
              </Form>
            </div>
          </Col>
          <Col xs={24} lg={12} className="login-illustration-col">
            <div className="illustration-wrapper">
              <img src="/src/assets/anhloginuser.png" alt="Career Growth Illustration" className="illustration-image" style={{ width: "80%", maxWidth: "80%", height: "auto", display: "block", margin: "0 auto" }} />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Register;
