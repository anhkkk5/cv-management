import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Spin,
} from "antd";
import { getCookie } from "../../helpers/cookie";
import {
  getDetaiCompany,
  editCompany,
} from "../../services/getAllCompany/companyServices";
import "./style.css";

const { TextArea } = Input;

function CompanyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    // Check if user is authorized
    const userType = getCookie("userType");
    const currentUserId = getCookie("id");

    if (userType !== "company" || currentUserId !== id) {
      message.error("Bạn không có quyền chỉnh sửa thông tin công ty này");
      navigate(`/companies/${id}`);
      return;
    }

    // Fetch company data
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const data = await getDetaiCompany(id);
        if (data) {
          form.setFieldsValue({
            companyName: data.companyName || data.name,
            website: data.website,
            address: data.address,
            description: data.description,
            logo: data.logo,
          });
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        message.error("Không thể tải thông tin công ty");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id, navigate, form]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      const updateData = {
        companyName: values.companyName,
        name: values.companyName, // Update both fields for compatibility
        website: values.website,
        address: values.address,
        description: values.description,
        logo: values.logo,
        updated_at: new Date().toISOString().split('T')[0], // Update timestamp
      };

      await editCompany(id, updateData);
      message.success("Cập nhật thông tin công ty thành công!");
      setModalVisible(false);
      setTimeout(() => {
        navigate(`/companies/${id}`);
      }, 500);
    } catch (error) {
      console.error("Error updating company:", error);
      message.error("Cập nhật thông tin công ty thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setTimeout(() => {
      navigate(`/companies/${id}`);
    }, 300);
  };

  return (
    <Modal
      title="Cập nhật thông tin doanh nghiệp"
      open={modalVisible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="company-edit-form"
        >
          <Form.Item
            label="Tên công ty"
            name="companyName"
            rules={[
              { required: true, message: "Vui lòng nhập tên công ty" },
            ]}
          >
            <Input placeholder="ABC Corp" size="large" />
          </Form.Item>

          <Form.Item
            label="Website"
            name="website"
            rules={[
              { type: "url", message: "Vui lòng nhập URL hợp lệ" },
            ]}
          >
            <Input placeholder="https://abccorp.com" size="large" />
          </Form.Item>

          <Form.Item
            label="Logo (URL)"
            name="logo"
          >
            <Input placeholder="https://example.com/logo.png" size="large" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ công ty"
            name="address"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ công ty" },
            ]}
          >
            <Input placeholder="123ABC street, VN" size="large" />
          </Form.Item>

          <Form.Item
            label="Mô tả về công ty"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả về công ty" },
            ]}
          >
            <TextArea
              placeholder="Nhập mô tả về công ty..."
              rows={6}
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <Button
                size="large"
                onClick={handleCancel}
                disabled={submitting}
              >
                Hủy Bỏ
              </Button>
              <Button
                type="primary"
                danger
                size="large"
                htmlType="submit"
                loading={submitting}
              >
                Cập Nhật
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default CompanyEdit;
