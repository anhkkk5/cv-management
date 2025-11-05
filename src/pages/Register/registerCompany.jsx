import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, Button, message, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { registerCompany } from "../../services/auth/authService";
import "../../pages/login/style.css";

const { Title, Text } = Typography;

function Register() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      if (values.password !== values.confirmPassword) {
        messageApi.error("Mật khẩu xác nhận không khớp!");
        return;
      }

      // API cần: email, password, role
      const payload = {
        email: values.email,
        password: values.password,
        role: "company",
      };

      const result = await registerCompany(payload);
      const resData = result?.data ?? result;
      if (resData) {
        messageApi.success("Đăng ký thành công!");
        form.resetFields();
        setTimeout(() => {
          navigate("/loginCompany");
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
      <div style={{ minHeight: "100vh", backgroundColor: "white", padding: "40px 60px" }}>
        <div style={{ marginBottom: 30 }}>
          <img src="/src/assets/logologin.png" alt="RIKEI Edu Logo" style={{ height: 50 }} />
        </div>

        <Title level={3} style={{ marginBottom: 40, fontWeight: 600, fontSize: 24 }}>
          Đăng ký để có thể tiếp cận nguồn nhân lực chất lượng cao
        </Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={[60, 0]}>
            <Col xs={24} md={12}>
              <div style={{ borderLeft: "4px solid #c41e3a", paddingLeft: 16, marginBottom: 24 }}>
                <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>
                  Thông tin tài khoản
                </Title>
              </div>

              {/* Các trường hiển thị cho UX nhưng không bắt buộc theo API */}
              <Form.Item label="Họ tên" name="fullName">
                <Input placeholder="Nhập họ tên" size="large" />
              </Form.Item>

              <Form.Item label="Email" name="email" rules={[{ required: true, message: "Trường này là bắt buộc!" }, { type: "email", message: "Email không hợp lệ!" }]}>
                <Input placeholder="abc@gmail.com" size="large" />
              </Form.Item>

              <Form.Item label="Password" name="password" rules={[{ required: true, message: "Trường này là bắt buộc!" }, { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" }]}>
                <Input.Password placeholder="********" size="large" iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
              </Form.Item>

              <Form.Item label="Confirm password" name="confirmPassword" rules={[{ required: true, message: "Trường này là bắt buộc!" }, { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" }]}>
                <Input.Password placeholder="********" size="large" iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <div style={{ borderLeft: "4px solid #c41e3a", paddingLeft: 16, marginBottom: 24 }}>
                <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>
                  Thông tin doanh nghiệp
                </Title>
              </div>

              <Form.Item label="Công ty" name="companyName">
                <Input placeholder="Tên công ty" size="large" />
              </Form.Item>

              <Form.Item label="Địa điểm làm việc" name="address">
                <Input placeholder="Chọn tỉnh/thành phố" size="large" />
              </Form.Item>

              <Form.Item label="Số điện thoại liên hệ" name="phone">
                <Input placeholder="0123456678" size="large" />
              </Form.Item>

              <Form.Item label="Email công ty" name="companyEmail" rules={[{ type: "email", message: "Email không hợp lệ!" }]}>
                <Input placeholder="abc@company.com" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ maxWidth: 340, margin: "40px auto 0" }}>
            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit" block size="large" style={{ backgroundColor: "#c41e3a", borderColor: "#c41e3a", height: 48, fontSize: 16, fontWeight: 500 }}>
                Đăng ký
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              <Text>
                Đã có tài khoản?{" "}
                <Text onClick={() => navigate("/loginCompany")} style={{ color: "#c41e3a", cursor: "pointer", fontWeight: 500, textDecoration: "none" }}>
                  Đăng nhập ngay
                </Text>
              </Text>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

export default Register;

