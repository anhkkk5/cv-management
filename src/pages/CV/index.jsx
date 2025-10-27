import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Button, message, Modal, Input, Form, DatePicker, Select } from "antd";
import { PlusOutlined, CameraOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getCookie } from "../../helpers/cookie";
import { getDetailCandidates, editCandidates } from "../../services/Candidates/candidatesServices";
import { 
  
  getCertificatesByCandidate, createCertificate, updateCertificate, deleteCertificate
} from "../../services/Certificates/CertificatesServices";
import {getEducationByCandidate, createEducation, updateEducation, deleteEducation} from "../../services/educationServices/educationServices"
import {getExperienceByCandidate, createExperience, updateExperience, deleteExperience} from "../../services/Experience/ExperienceServices"
import {getProjectsByCandidate, createProject, updateProject, deleteProject} from "../../services/project/ProjectServices"
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../../components/CV/ProfileInfo";
import Introduction from "../../components/CV/Introduction";
import Education from "../../components/CV/Education";
import Experience from "../../components/CV/Experience";
import Projects from "../../components/CV/Projects";
import Certificates from "../../components/CV/Certificates";
import "./style.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

function CVPage() {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  
  // State để lưu dữ liệu các section
  const [cvData, setCvData] = useState({
    intro: "",
    education: [],
    experience: [],
    projects: [],
    certificates: []
  });

  useEffect(() => {
    const fetchCandidateData = async () => {
      const candidateId = getCookie("id");
      const token = getCookie("token");

      if (!token || !candidateId) {
        message.error("Vui lòng đăng nhập để xem CV");
        navigate("/login");
        return;
      }

      try {
        // Load thông tin candidate
        const data = await getDetailCandidates(candidateId);
        setCandidate(data);

        // Load dữ liệu CV từ database
        const [educationData, experienceData, projectsData, certificatesData] = await Promise.all([
          getEducationByCandidate(candidateId),
          getExperienceByCandidate(candidateId),
          getProjectsByCandidate(candidateId),
          getCertificatesByCandidate(candidateId)
        ]);

        setCvData({
          intro: data.introduction || "",
          education: educationData || [],
          experience: experienceData || [],
          projects: projectsData || [],
          certificates: certificatesData || []
        });
      } catch (error) {
        message.error("Không thể tải thông tin CV");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [navigate]);

  const showModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
    
    // Nếu đang edit, set giá trị vào form
    if (item) {
      setTimeout(() => {
        if (type === "profile") {
          form.setFieldsValue({
            fullName: item.fullName || item.name,
            position: item.position,
            address: item.address,
            email: item.email,
            phone: item.phone,
            dob: item.dob ? dayjs(item.dob) : null,
            gender: item.gender,
            isOpen: item.isOpen
          });
        } else if (type === "intro") {
          form.setFieldsValue({ content: item });
        } else if (type === "education") {
          form.setFieldsValue({
            school: item.name_education || item.school,
            major: item.major,
            startDate: item.started_at ? dayjs(item.started_at) : (item.startDate ? dayjs(item.startDate) : null),
            endDate: item.end_at ? dayjs(item.end_at) : (item.endDate ? dayjs(item.endDate) : null),
            description: item.info || item.description
          });
        } else if (type === "experience") {
          form.setFieldsValue({
            position: item.position,
            company: item.company,
            startDate: item.started_at ? dayjs(item.started_at) : (item.startDate ? dayjs(item.startDate) : null),
            endDate: item.end_at ? dayjs(item.end_at) : (item.endDate ? dayjs(item.endDate) : null),
            description: item.info || item.description
          });
        } else if (type === "project") {
          form.setFieldsValue({
            projectName: item.project_name || item.projectName,
            demoLink: item.demo_link || item.demoLink,
            startDate: item.started_at ? dayjs(item.started_at) : (item.startDate ? dayjs(item.startDate) : null),
            endDate: item.end_at ? dayjs(item.end_at) : (item.endDate ? dayjs(item.endDate) : null),
            description: item.description
          });
        } else if (type === "certificate") {
          form.setFieldsValue({
            certificateName: item.certificate_name || item.certificateName,
            organization: item.organization,
            startDate: item.started_at ? dayjs(item.started_at) : (item.startDate ? dayjs(item.startDate) : null),
            endDate: item.end_at ? dayjs(item.end_at) : (item.endDate ? dayjs(item.endDate) : null),
            description: item.description
          });
        }
      }, 0);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleDelete = async (type, id) => {
    console.log("handleDelete called with type:", type, "id:", id);
    
    // Sử dụng window.confirm thay vì Modal.confirm
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa mục này không?");
    
    if (!confirmed) {
      console.log("User cancelled delete");
      return;
    }
    
    console.log("User confirmed, deleting...");
    try {
      if (type === "education") {
        console.log("Deleting education with id:", id);
        await deleteEducation(id);
        setCvData(prev => ({
          ...prev,
          education: prev.education.filter(edu => edu.id !== id)
        }));
      } else if (type === "experience") {
        console.log("Deleting experience with id:", id);
        await deleteExperience(id);
        setCvData(prev => ({
          ...prev,
          experience: prev.experience.filter(exp => exp.id !== id)
        }));
      } else if (type === "project") {
        await deleteProject(id);
        setCvData(prev => ({
          ...prev,
          projects: prev.projects.filter(proj => proj.id !== id)
        }));
      } else if (type === "certificate") {
        await deleteCertificate(id);
        setCvData(prev => ({
          ...prev,
          certificates: prev.certificates.filter(cert => cert.id !== id)
        }));
      }
      message.success("Đã xóa thành công!");
    } catch (error) {
      console.error("Error deleting:", error);
      message.error("Không thể xóa. Vui lòng thử lại!");
    }
  };

  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    const candidateId = getCookie("id");
    
    try {
      // Cập nhật dữ liệu theo loại modal
      if (modalType === "profile") {
        // Cập nhật thông tin cá nhân vào database
        const updatedData = {
          fullName: values.fullName || candidate.fullName,
          name: values.fullName || candidate.name,
          address: values.address,
          phone: values.phone,
          dob: values.dob ? values.dob.format("YYYY-MM-DD") : candidate.dob,
          gender: values.gender,
          isOpen: values.isOpen
        };
        await editCandidates(candidateId, updatedData);
        setCandidate(prev => ({ ...prev, ...updatedData }));
      } else if (modalType === "intro") {
        // Lưu giới thiệu vào Candidates
        await editCandidates(candidateId, { introduction: values.content });
        setCvData(prev => ({ ...prev, intro: values.content }));
      } else if (modalType === "education") {
        const educationData = {
          candidate_id: candidateId,
          name_education: values.school,
          major: values.major,
          started_at: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
          end_at: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
          info: values.description || "",
          updated_at: new Date().toISOString().split('T')[0]
        };
        
        if (editingItem && editingItem.id) {
          // Cập nhật học vấn cũ
          await updateEducation(editingItem.id, educationData);
          setCvData(prev => ({
            ...prev,
            education: prev.education.map(edu => 
              edu.id === editingItem.id ? { ...edu, ...educationData } : edu
            )
          }));
        } else {
          // Tạo mới học vấn
          educationData.created_at = new Date().toISOString().split('T')[0];
          const newEducation = await createEducation(educationData);
          setCvData(prev => ({ ...prev, education: [...prev.education, newEducation] }));
        }
      } else if (modalType === "experience") {
        const experienceData = {
          candidate_id: candidateId,
          position: values.position,
          company: values.company,
          started_at: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
          end_at: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
          info: values.description || "",
          updated_at: new Date().toISOString().split('T')[0]
        };
        
        if (editingItem && editingItem.id) {
          // Cập nhật kinh nghiệm cũ
          await updateExperience(editingItem.id, experienceData);
          setCvData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => 
              exp.id === editingItem.id ? { ...exp, ...experienceData } : exp
            )
          }));
        } else {
          // Tạo mới kinh nghiệm
          experienceData.created_at = new Date().toISOString().split('T')[0];
          const newExperience = await createExperience(experienceData);
          setCvData(prev => ({ ...prev, experience: [...prev.experience, newExperience] }));
        }
      } else if (modalType === "project") {
        const projectData = {
          candidate_id: candidateId,
          project_name: values.projectName,
          demo_link: values.demoLink || "",
          started_at: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
          end_at: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
          description: values.description || "",
          updated_at: new Date().toISOString().split('T')[0]
        };
        
        if (editingItem && editingItem.id) {
          // Cập nhật dự án cũ
          await updateProject(editingItem.id, projectData);
          setCvData(prev => ({
            ...prev,
            projects: prev.projects.map(proj => 
              proj.id === editingItem.id ? { ...proj, ...projectData } : proj
            )
          }));
        } else {
          // Tạo mới dự án
          projectData.created_at = new Date().toISOString().split('T')[0];
          const newProject = await createProject(projectData);
          setCvData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
        }
      } else if (modalType === "certificate") {
        const certificateData = {
          candidate_id: candidateId,
          certificate_name: values.certificateName,
          organization: values.organization,
          started_at: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
          end_at: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
          description: values.description || "",
          updated_at: new Date().toISOString().split('T')[0]
        };
        
        if (editingItem && editingItem.id) {
          // Cập nhật chứng chỉ cũ
          await updateCertificate(editingItem.id, certificateData);
          setCvData(prev => ({
            ...prev,
            certificates: prev.certificates.map(cert => 
              cert.id === editingItem.id ? { ...cert, ...certificateData } : cert
            )
          }));
        } else {
          // Tạo mới chứng chỉ
          certificateData.created_at = new Date().toISOString().split('T')[0];
          const newCertificate = await createCertificate(certificateData);
          setCvData(prev => ({ ...prev, certificates: [...prev.certificates, newCertificate] }));
        }
      }
      
      message.success("Đã lưu thông tin thành công!");
      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();
    } catch (error) {
      console.error("Error saving data:", error);
      message.error("Không thể lưu thông tin. Vui lòng thử lại!");
    }
  };

  if (loading) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Đang tải...</div>;
  }

  if (!candidate) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Không tìm thấy thông tin</div>;
  }

  return (
    <div className="cv-page">
      <div className="cv-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Text>Trang chủ / CV của bạn</Text>
        </div>

        <Row gutter={24}>
          {/* Left Sidebar */}
          <Col xs={24} md={8}>
            <Card className="sidebar-card">
              <Title level={4}>Nâng cấp hồ sơ xin việc của bạn bằng việc bổ sung các trường sau</Title>
              
              <div className="action-item" onClick={() => showModal("intro")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Thêm giới thiệu bản thân</Text>
              </div>

              <div className="action-item" onClick={() => showModal("intro")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Thêm giới thiệu bản thân</Text>
              </div>

              <div className="action-item" onClick={() => showModal("intro")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Thêm giới thiệu bản thân</Text>
              </div>

              <div className="action-item" onClick={() => showModal("intro")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Thêm giới thiệu bản thân</Text>
              </div>

              <div className="action-item">
                <Text>Thêm thông tin khác</Text>
              </div>

              <Button type="primary" danger block size="large" style={{ marginTop: 20 }}>
                Xem Và Tải CV
              </Button>
            </Card>
          </Col>

          {/* Main Content */}
          <Col xs={24} md={16}>
            <ProfileInfo 
              candidate={candidate} 
              onEdit={() => showModal("profile", candidate)} 
            />
            
            <Introduction 
              intro={cvData.intro} 
              onAdd={(item) => showModal("intro", item)} 
            />
            
            <Education 
              educationList={cvData.education} 
              onAdd={(item) => showModal("education", item)}
              onDelete={(id) => handleDelete("education", id)}
            />
            
            <Experience 
              experienceList={cvData.experience} 
              onAdd={(item) => showModal("experience", item)}
              onDelete={(id) => handleDelete("experience", id)}
            />
            
            <Projects 
              projectsList={cvData.projects} 
              onAdd={(item) => showModal("project", item)}
              onDelete={(id) => handleDelete("project", id)}
            />
            
            <Certificates 
              certificatesList={cvData.certificates} 
              onAdd={(item) => showModal("certificate", item)}
              onDelete={(id) => handleDelete("certificate", id)}
            />
          </Col>
        </Row>
      </div>

      {/* Modal */}
      <Modal
        title={
          modalType === "intro" ? "Giới thiệu về bản thân" :
          modalType === "education" ? "Học vấn" :
          modalType === "experience" ? "Thêm kinh nghiệm làm việc" :
          modalType === "certificate" ? "Thêm chứng chỉ" :
          modalType === "profile" ? "Cập nhật thông tin cá nhân" :
          modalType === "project" ? "Dự án cá nhân" :
          "Thêm thông tin"
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={modalType === "education" || modalType === "experience" || modalType === "profile" || modalType === "project" || modalType === "certificate" ? 600 : 520}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {modalType === "profile" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img 
                    src="/src/assets/logologin.png" 
                    alt="Avatar" 
                    style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <Button 
                    icon={<CameraOutlined />} 
                    shape="circle" 
                    size="small"
                    style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff" }}
                  />
                </div>
                <div style={{ marginTop: 10 }}>
                  <Button size="small" style={{ marginRight: 8 }}>Sửa</Button>
                  <Button size="small" danger>Xóa</Button>
                </div>
              </div>

              <Form.Item label="Họ và tên" name="fullName" initialValue={candidate?.fullName || candidate?.name}>
                <Input placeholder="ABC" />
              </Form.Item>

              <Form.Item label="Chức danh" name="position" initialValue="Full-Stack Developer">
                <Input placeholder="@yourfblink" />
              </Form.Item>

              <Form.Item label="Địa chỉ" name="address" initialValue={candidate?.address}>
                <Input placeholder="+12 NhạṭHoa" />
              </Form.Item>

              <Form.Item label="Email" name="email" initialValue={candidate?.email}>
                <Input placeholder="ABCCorp@gmail.com" />
              </Form.Item>

              <Form.Item label="SĐT" name="phone" initialValue={candidate?.phone}>
                <Input placeholder="0123456789" />
              </Form.Item>

              <Form.Item label="DOB" name="dob" initialValue={candidate?.dob ? dayjs(candidate.dob) : null}>
                <DatePicker 
                  placeholder="1/1/2023" 
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item label="Giới tính" name="gender" initialValue={candidate?.gender}>
                <Select placeholder="Nam">
                  <Select.Option value={1}>Nam</Select.Option>
                  <Select.Option value={0}>Nữ</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Trạng cá nhân" name="isOpen" initialValue={candidate?.isOpen}>
                <Select placeholder="Nam">
                  <Select.Option value={1}>Đang tìm việc</Select.Option>
                  <Select.Option value={0}>Không tìm việc</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {modalType === "intro" && (
            <>
              <Text type="secondary">Mô tả về bản thân, các kĩ năng của mình...</Text>
              <Form.Item name="content" style={{ marginTop: 10 }}>
                <TextArea rows={6} placeholder="Nhập nội dung..." />
              </Form.Item>
            </>
          )}

          {modalType === "education" && (
            <>
              <Form.Item label="Trường" name="school" rules={[{ required: true, message: "Vui lòng nhập tên trường" }]}>
                <Input placeholder="ABC Corp" />
              </Form.Item>
              
              <Form.Item label="Ngành Học" name="major" rules={[{ required: true, message: "Vui lòng nhập ngành học" }]}>
                <Input placeholder="ABCCorp.com" />
              </Form.Item>

              <Form.Item label="Thời gian học tập">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="startDate" noStyle rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}>
                      <DatePicker 
                        placeholder="Start Date" 
                        format="MMM DD, YYYY"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="endDate" noStyle rules={[{ required: true, message: "Chọn ngày kết thúc" }]}>
                      <DatePicker 
                        placeholder="End Date" 
                        format="MMM DD, YYYY"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="Thông tin thêm" name="description">
                <TextArea rows={4} placeholder="Hint text" />
              </Form.Item>
            </>
          )}

          {modalType === "experience" && (
            <>
              <Form.Item label="Vị trí" name="position" rules={[{ required: true, message: "Vui lòng nhập vị trí" }]}>
                <Input placeholder="ABC Corp" />
              </Form.Item>
              
              <Form.Item label="Tên đơn vị công tác" name="company" rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}>
                <Input placeholder="ABCCorp.com" />
              </Form.Item>

              <Form.Item label="Thời gian làm việc">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="startDate" noStyle rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}>
                      <DatePicker 
                        placeholder="Start Date" 
                        format="MMM DD, YYYY"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="endDate" noStyle rules={[{ required: true, message: "Chọn ngày kết thúc" }]}>
                      <DatePicker 
                        placeholder="End Date" 
                        format="MMM DD, YYYY"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="Mô tả chi tiết công việc" name="description">
                <TextArea rows={4} placeholder="Hint text" />
              </Form.Item>
            </>
          )}

          {modalType === "project" && (
            <>
              <Form.Item label="Tên dự án" name="projectName" rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}>
                <Input placeholder="ABC Corp" />
              </Form.Item>
              
              <Form.Item label="Link demo" name="demoLink">
                <Input placeholder="ABCCorp.com" />
              </Form.Item>

              <Form.Item label="Thời gian thực hiện">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="startDate" noStyle rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}>
                      <DatePicker 
                        placeholder="Start Date" 
                        format="MMM DD, YYYY"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="endDate" noStyle rules={[{ required: true, message: "Chọn ngày kết thúc" }]}>
                      <DatePicker 
                        placeholder="End Date" 
                        format="MMM DD, YYYY"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="Mô tả chi tiết công việc" name="description">
                <TextArea rows={4} placeholder="Hint text" />
              </Form.Item>
            </>
          )}

          {modalType === "certificate" && (
            <>
              <Form.Item label="Tên chứng chỉ" name="certificateName" rules={[{ required: true, message: "Vui lòng nhập tên chứng chỉ" }]}>
                <Input placeholder="ABC Corp" />
              </Form.Item>
              
              <Form.Item label="Tổ chức" name="organization" rules={[{ required: true, message: "Vui lòng nhập tên tổ chức" }]}>
                <Input placeholder="ABCCorp.com" />
              </Form.Item>

              <Form.Item label="Thời gian">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="startDate" noStyle rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}>
                      <DatePicker 
                        placeholder="Start Date" 
                        format="MMM DD, YYYY"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="endDate" noStyle rules={[{ required: true, message: "Chọn ngày kết thúc" }]}>
                      <DatePicker 
                        placeholder="End Date" 
                        format="MMM DD, YYYY"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="Mô tả thêm" name="description">
                <TextArea rows={4} placeholder="Hint text" />
              </Form.Item>
            </>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button onClick={handleCancel} style={{ marginRight: 10 }}>
              Hủy Bỏ
            </Button>
            <Button type="primary" danger htmlType="submit">
              Cập Nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CVPage;
