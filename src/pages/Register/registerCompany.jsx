import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, Button, message, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { registerRecruiter, login } from "../../services/auth/authServices";
import { updateMyCompany, getMyCompany } from "../../services/getAllCompany/companyServices";
import "../../pages/login/style.css";

const { Title, Text } = Typography;

function Register() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Define validation rules
  const rules = [
    {
      required: true,
      message: "Trường này là bắt buộc!",
    },
  ];

  const onFinish = async (values) => {
    try {
      console.log("Registration attempt:", values);

      // Validate password confirmation
      if (values.password !== values.confirmPassword) {
        messageApi.error("Mật khẩu xác nhận không khớp!");
        return;
      }
      // Call backend auth/register with Recruiter role
      const result = await registerRecruiter({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (result) {
        // Auto login to obtain JWT for creating company
        try {
          const auth = await login({ email: values.email, password: values.password });
          const token = auth?.access_token;
          if (token) localStorage.setItem("token", token);
          // Create or update my company using form fields
          const payload = {
            fullName: values.companyName,
            companyName: values.companyName,
            email: values.companyEmail || values.email,
            address: values.address,
            status: "active",
          };
          await updateMyCompany(payload);
          const company = await getMyCompany();
          messageApi.success("Đăng ký và thiết lập doanh nghiệp thành công 🎉");
          form.resetFields();
          setTimeout(() => {
            if (company?.id) navigate(`/companies/${company.id}`);
            else navigate("/loginCompany");
          }, 1200);
        } catch (e) {
          messageApi.success("Đăng ký thành công! Vui lòng hoàn tất thiết lập doanh nghiệp sau khi đăng nhập.");
          setTimeout(() => navigate("/loginCompany"), 1200);
        }
      } else {
        messageApi.error("Đăng ký thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.message;
      if (backendMsg) messageApi.error(Array.isArray(backendMsg) ? backendMsg.join(", ") : backendMsg);
      else messageApi.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white',
        padding: '40px 60px'
      }}>
        {/* Logo Section */}
        <div style={{ marginBottom: 30 }}>
          <img
            src="/src/assets/logologin.png"
            alt="RIKEI Edu Logo"
            style={{ height: 50 }}
          />
        </div>

        {/* Heading */}
        <Title level={3} style={{ 
          marginBottom: 40,
          fontWeight: 600,
          fontSize: 24
        }}>
          Đăng kí để có thể tiếp cận nguồn nhân lực chất lượng cao
        </Title>

        {/* Registration Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={[60, 0]}>
            {/* Left Column - Account Information */}
            <Col xs={24} md={12}>
              <div style={{ 
                borderLeft: '4px solid #c41e3a',
                paddingLeft: 16,
                marginBottom: 24
              }}>
                <Title level={5} style={{ 
                  margin: 0,
                  fontWeight: 600,
                  fontSize: 16
                }}>
                  Thông tin tài khoản
                </Title>
              </div>
              
              <Form.Item label="Họ tên" name="fullName" rules={rules}>
                <Input placeholder="Nhập họ tên" size="large" />
              </Form.Item>

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
                <Input placeholder="abc@gmail.com" size="large" />
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
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item
                label="Confirm password"
                name="confirmPassword"
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
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </Col>

            {/* Right Column - Company Information */}
            <Col xs={24} md={12}>
              <div style={{ 
                borderLeft: '4px solid #c41e3a',
                paddingLeft: 16,
                marginBottom: 24
              }}>
                <Title level={5} style={{ 
                  margin: 0,
                  fontWeight: 600,
                  fontSize: 16
                }}>
                  Thông tin doanh nghiệp
                </Title>
              </div>
              
              <Form.Item label="Công ty" name="companyName" rules={rules}>
                <Input placeholder="Tên công ty" size="large" />
              </Form.Item>

              <Form.Item label="Địa điểm làm việc" name="address" rules={rules}>
                <Input placeholder="Chọn tỉnh/thành phố" size="large" />
              </Form.Item>

              <Form.Item label="Số điện thoại liên hệ" name="phone" rules={rules}>
                <Input placeholder="0123456678" size="large" />
              </Form.Item>

              <Form.Item
                label="Email công ty"
                name="companyEmail"
                rules={[
                  ...rules,
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="abc@company.com" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ 
            maxWidth: 340,
            margin: '40px auto 0'
          }}>
            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{
                  backgroundColor: "#c41e3a",
                  borderColor: "#c41e3a",
                  height: 48,
                  fontSize: 16,
                  fontWeight: 500
                }}
              >
                Đăng kí
              </Button>
            </Form.Item>

            {/* Links */}
            <div style={{ textAlign: 'center' }}>
              <Text>
                Đã có tài khoản?{" "}
                <Text
                  onClick={() => navigate("/loginCompany")}
                  style={{ 
                    color: '#c41e3a', 
                    cursor: 'pointer', 
                    fontWeight: 500,
                    textDecoration: 'none'
                  }}
                >
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
