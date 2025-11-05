import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Switch,
  message,
  Modal,
  Form,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  getAllCompany,
  editCompany,
  deleteCompany,
} from "../../../services/getAllCompany/companyServices";
import { useNavigate } from "react-router-dom";
import "./style.css";

function CompaniesManagement() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editingCompany, setEditingCompany] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await getAllCompany();
      setCompanies(data);
    } catch (error) {
      message.error("Không thể tải danh sách công ty!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa công ty này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteCompany(id);
          message.success("Xóa thành công!");
          fetchCompanies();
        } catch {
          message.error("Xóa thất bại!");
        }
      },
    });
  };

  const handleStatusChange = async (record, checked) => {
    try {
      await editCompany(record.id, {
        ...record,
        status: checked ? "active" : "inactive",
      });
      message.success("Cập nhật trạng thái thành công!");
      fetchCompanies();
    } catch {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleEdit = (record) => {
    setEditingCompany(record);
    form.setFieldsValue({
      ...record,
      status: record.status === "active",
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await editCompany(editingCompany.id, {
        ...values,
        status: values.status ? "active" : "inactive",
      });
      message.success("Cập nhật thành công!");
      setIsModalVisible(false);
      setEditingCompany(null);
      form.resetFields();
      fetchCompanies();
    } catch {
      message.error("Cập nhật thất bại!");
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const searchLower = searchText.toLowerCase();
    return (
      company.fullName?.toLowerCase().includes(searchLower) ||
      company.companyName?.toLowerCase().includes(searchLower) ||
      company.email?.toLowerCase().includes(searchLower) ||
      company.id?.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Tên công ty",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      render: (text, record) => record.fullName || record.companyName || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 200,
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      width: 200,
      render: (text) =>
        text ? (
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status, record) => (
        <Switch
          checked={status === "active"}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: "Chi tiết thông tin",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/companies/${record.id}`)}
          >
            Truy cập
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-management-container">
      <div className="admin-header">
        <h1>Quản lý công ty</h1>
        <Input
          placeholder="Tìm kiếm công ty..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredCompanies}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title="Chỉnh sửa công ty"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCompany(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Cập nhật"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            label="Tên công ty"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên công ty!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>

          <Form.Item label="Website" name="website">
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CompaniesManagement;
