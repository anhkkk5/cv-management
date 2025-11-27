import React, { useEffect, useState, useRef } from "react";
import { Card, Row, Col, Typography, Button, message, Modal, Input, Form, DatePicker, Select, Tooltip } from "antd";
import { PlusOutlined, CameraOutlined, UpOutlined, DownOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getCookie } from "../../helpers/cookie";
import { getMyCandidateProfile, updateMyCandidateProfile, createMyCandidateProfile, uploadMyAvatar, deleteMyAvatar } from "../../services/Candidates/candidatesServices";
import { 
  
  getCertificatesByCandidate, createCertificate, updateCertificate, deleteCertificate
} from "../../services/Certificates/CertificatesServices";
import {getEducationByCandidate, createEducation, updateEducation, deleteEducation} from "../../services/educationServices/educationServices"
import {getExperienceByCandidate, createExperience, updateExperience, deleteExperience} from "../../services/Experience/ExperienceServices"
import { getActivities, createActivity, updateActivity, deleteActivity } from "../../services/Activities/ActivitiesServices";
import {getProjectsByCandidate, createProject, updateProject, deleteProject} from "../../services/project/ProjectServices"
import { useNavigate } from "react-router-dom";
import { decodeJwt } from "../../services/auth/authServices";
import ProfileInfo from "../../components/CV/ProfileInfo";
import Introduction from "../../components/CV/Introduction";
import Education from "../../components/CV/Education";
import Experience from "../../components/CV/Experience";
import Activities from "../../components/CV/Activities";
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
  const avatarInputRef = useRef(null);
  // Refs tới các section để scroll
  const sectionRefs = {
    profile: useRef(null),
    intro: useRef(null),
    education: useRef(null),
    experience: useRef(null),
    projects: useRef(null),
    certificates: useRef(null),
    activities: useRef(null),
  };

  // Lưu CV (thứ tự + intro hiện tại nếu chưa lưu)
  const handleSaveCV = async () => {
    try {
      await updateMyCandidateProfile({
        cvOrder: sectionOrder,
        // Không ghi đè nội dung khác; intro được lưu khi bấm Cập nhật modal
      });
      message.success("Đã lưu CV thành công");
    } catch (_) {
      message.error("Lưu CV thất bại, vui lòng thử lại");
    }
  };

  // In/Tải CV dạng PDF (sử dụng print)
  const printAreaRef = useRef(null);
  const handleDownloadCV = () => {
    // Sử dụng @media print trong CSS để chỉ in khu vực CV
    window.print();
  };
  
  // State để lưu dữ liệu các section
  const [cvData, setCvData] = useState({
    intro: "",
    education: [],
    experience: [],
    projects: [],
    certificates: [],
    activities: [],
  });

  // Thứ tự hiển thị các section có thể kéo thả
  const [sectionOrder, setSectionOrder] = useState([
    "intro",
    "education",
    "experience",
    "projects",
    "certificates",
    "activities",
  ]);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    const fetchCandidateData = async () => {
      const token = getCookie("token") || localStorage.getItem("token");

      if (!token) {
        message.error("Vui lòng đăng nhập để xem CV");
        navigate("/login");
        return;
      }

      try {
        // Load thông tin candidate
        let data;
        try {
          data = await getMyCandidateProfile();
        } catch (err) {
          const status = err?.response?.status;
          if (status === 404) {
            // Hồ sơ chưa tồn tại -> tạo hồ sơ tối thiểu rồi lấy lại
            const tokenStr = getCookie("token") || localStorage.getItem("token");
            let fullNameFromCookie = getCookie("fullName");
            let emailFromJwt = "";
            try {
              if (tokenStr) {
                const payload = decodeJwt(tokenStr);
                if (!fullNameFromCookie) fullNameFromCookie = payload?.name || payload?.fullName;
                emailFromJwt = payload?.email || "";
              }
            } catch (_) {}
            const minimal = {
              fullName: fullNameFromCookie || "User",
              email: emailFromJwt || undefined,
              isOpen: 1,
            };
            await createMyCandidateProfile(minimal);
            data = await getMyCandidateProfile();
          } else {
            throw err;
          }
        }
        setCandidate(data);

        // Load dữ liệu CV từ database
        const idForSections = data?.id;
        const [educationData, experienceData, projectsData, certificatesData, activitiesData] = idForSections
          ? await Promise.all([
              getEducationByCandidate(idForSections),
              getExperienceByCandidate(idForSections),
              getProjectsByCandidate(idForSections),
              getCertificatesByCandidate(idForSections),
              getActivities(),
            ])
          : [[], [], [], [], []];

        setCvData({
          intro: data.introduction || "",
          education: educationData || [],
          experience: experienceData || [],
          projects: projectsData || [],
          certificates: certificatesData || [],
          activities: activitiesData || [],
        });

        // Khởi tạo thứ tự section: ưu tiên localStorage, sau đó backend (cvOrder)
        try {
          const ls = localStorage.getItem("cv_section_order");
          const fromLs = ls ? JSON.parse(ls) : null;
          const fromBe = Array.isArray(data?.cvOrder) ? data.cvOrder : null;
          const base = ["intro", "education", "experience", "projects", "certificates", "activities"];
          // Hợp lệ nếu là tập con có phần tử thuộc base và không trùng lặp
          const valid = (arr) => Array.isArray(arr) && arr.length >= 1 && arr.every((x) => base.includes(x)) && new Set(arr).size === arr.length;
          if (valid(fromLs)) setSectionOrder(fromLs);
          else if (valid(fromBe)) setSectionOrder(fromBe);
        } catch (_) {}
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

  // Click nhanh ở sidebar: scroll tới section và mở modal, focus vào input đầu tiên
  const handleQuickEdit = (type) => {
    const el = sectionRefs[type]?.current;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // đợi scroll rồi mở modal và focus
    setTimeout(() => {
      const modalT =
        type === "projects"
          ? "project"
          : type === "certificates"
          ? "certificate"
          : type === "activities"
          ? "activity"
          : type;
      showModal(modalT);
      setTimeout(() => {
        try {
          if (modalT === "intro") form.getFieldInstance("content")?.focus();
          else if (modalT === "education") form.getFieldInstance("school")?.focus();
          else if (modalT === "experience") form.getFieldInstance("position")?.focus();
          else if (modalT === "project") form.getFieldInstance("projectName")?.focus();
          else if (modalT === "certificate") form.getFieldInstance("certificateName")?.focus();
          else if (modalT === "activity") form.getFieldInstance("organization")?.focus();
          else if (modalT === "profile") form.getFieldInstance("fullName")?.focus();
        } catch (_) {}
      }, 50);
    }, 300);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleChooseAvatar = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      const result = await uploadMyAvatar(file);
      const avatarUrl = result?.avatarUrl || result?.data?.avatarUrl || result?.url;
      if (avatarUrl) {
        setCandidate((prev) => ({ ...prev, avatar: avatarUrl }));
        message.success("Cập nhật ảnh đại diện thành công");
      } else {
        message.warning("Không nhận được đường dẫn ảnh từ server");
      }
    } catch (error) {
      console.error("Upload avatar error", error);
      message.error("Tải ảnh đại diện thất bại, vui lòng thử lại");
    } finally {
      // reset input để có thể chọn lại cùng 1 file nếu cần
      event.target.value = "";
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await deleteMyAvatar();
      setCandidate((prev) => ({ ...prev, avatar: null }));
      message.success("Đã xóa ảnh đại diện");
    } catch (error) {
      console.error("Delete avatar error", error);
      message.error("Xóa ảnh đại diện thất bại, vui lòng thử lại");
    }
  };

  // DnD handlers
  const onDragStart = (e, key) => {
    setDragging(key);
    try { e.dataTransfer.setData("text/plain", key); } catch (_) {}
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };
  const onDrop = async (e, targetKey) => {
    e.preventDefault();
    const sourceKey = dragging || (e.dataTransfer ? e.dataTransfer.getData("text/plain") : null);
    if (!sourceKey || sourceKey === targetKey) return;
    const newOrder = [...sectionOrder];
    const from = newOrder.indexOf(sourceKey);
    const to = newOrder.indexOf(targetKey);
    if (from === -1 || to === -1) return;
    newOrder.splice(to, 0, newOrder.splice(from, 1)[0]);
    setSectionOrder(newOrder);
    setDragging(null);

    // Lưu localStorage và cố gắng sync backend
    try {
      localStorage.setItem("cv_section_order", JSON.stringify(newOrder));
      await updateMyCandidateProfile({ cvOrder: newOrder });
    } catch (_) {
      // bỏ qua lỗi, vẫn giữ local
    }
  };

  const draggableWrap = (key, nodeRef, children) => (
    <div
      key={key}
      ref={nodeRef}
      className={`draggable-section${dragging===key?" dragging":""}`}
      draggable
      onDragStart={(e) => onDragStart(e, key)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, key)}
    >
      <div className="section-toolbar">
        <div className="toolbar-left">
          <span className="drag-hint">Kéo để sắp xếp</span>
        </div>
        <div className="toolbar-actions">
          <Tooltip title="Di chuyển lên trên">
            <Button size="small" onClick={() => moveUp(key)} icon={<UpOutlined />} />
          </Tooltip>
          <Tooltip title="Di chuyển xuống dưới">
            <Button size="small" onClick={() => moveDown(key)} icon={<DownOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa mục này">
            <Button size="small" danger onClick={() => removeSection(key)} icon={<DeleteOutlined />} />
          </Tooltip>
        </div>
      </div>
      {children}
    </div>
  );

  const persistOrder = async (order) => {
    try {
      localStorage.setItem("cv_section_order", JSON.stringify(order));
      await updateMyCandidateProfile({ cvOrder: order });
    } catch (_) {}
  };

  const addSection = async (key) => {
    if (sectionOrder.includes(key)) return;
    const order = [...sectionOrder, key];
    setSectionOrder(order);
    await persistOrder(order);
  };

  const removeSection = async (key) => {
    const order = sectionOrder.filter((k) => k !== key);
    setSectionOrder(order);
    await persistOrder(order);
  };

  const moveUp = async (key) => {
    const idx = sectionOrder.indexOf(key);
    if (idx <= 0) return;
    const order = [...sectionOrder];
    [order[idx - 1], order[idx]] = [order[idx], order[idx - 1]];
    setSectionOrder(order);
    await persistOrder(order);
    sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const moveDown = async (key) => {
    const idx = sectionOrder.indexOf(key);
    if (idx === -1 || idx >= sectionOrder.length - 1) return;
    const order = [...sectionOrder];
    [order[idx + 1], order[idx]] = [order[idx], order[idx + 1]];
    setSectionOrder(order);
    await persistOrder(order);
    sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
      } else if (type === "activity") {
        await deleteActivity(id);
        setCvData(prev => ({
          ...prev,
          activities: prev.activities.filter(act => act.id !== id),
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
        await updateMyCandidateProfile(updatedData);
        setCandidate(prev => ({ ...prev, ...updatedData }));
      } else if (modalType === "intro") {
        // Lưu giới thiệu vào Candidates
        await updateMyCandidateProfile({ introduction: values.content });
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
          started_at: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
          end_at: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
          description: values.description || "",
          updated_at: new Date().toISOString().split('T')[0]
        };

        // Only send demo_link if user actually entered a value to satisfy backend @IsUrl validator
        if (values.demoLink && values.demoLink.trim()) {
          projectData.demo_link = values.demoLink.trim();
        }
        
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
      } else if (modalType === "activity") {
        const activityData = {
          started_at: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
          end_at: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
          organization: values.organization,
          role: values.role,
          description: values.description || "",
        };

        if (editingItem && editingItem.id) {
          await updateActivity(editingItem.id, activityData);
          setCvData((prev) => ({
            ...prev,
            activities: prev.activities.map((act) =>
              act.id === editingItem.id ? { ...act, ...activityData } : act
            ),
          }));
        } else {
          const newActivity = await createActivity(activityData);
          setCvData((prev) => ({
            ...prev,
            activities: [...prev.activities, newActivity],
          }));
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
              <Title level={4}>Nâng cấp hồ sơ của bạn</Title>

              <div className="action-item" onClick={() => handleQuickEdit("profile")}> 
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Chỉnh sửa thông tin cá nhân</Text>
              </div>

              <div className="action-item" onClick={() => handleQuickEdit("intro")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Giới thiệu bản thân</Text>
              </div>

              <div className="action-item" onClick={() => handleQuickEdit("education")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Học vấn</Text>
              </div>

              <div className="action-item" onClick={() => handleQuickEdit("experience")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Kinh nghiệm làm việc</Text>
              </div>

              <div className="action-item" onClick={() => handleQuickEdit("projects")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Dự án</Text>
              </div>

              <div className="action-item" onClick={() => handleQuickEdit("certificates")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Chứng chỉ</Text>
              </div>

              <div className="action-item" onClick={() => handleQuickEdit("activities")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Hoạt động</Text>
              </div>

              {/* Thêm mục đã ẩn giống TopCV */}
              <div style={{ marginTop: 12, fontWeight: 500 }}>Thêm mục</div>
              {["intro","education","experience","projects","certificates","activities"].filter(k => !sectionOrder.includes(k)).map((k) => (
                <div key={`add-${k}`} className="action-item" onClick={() => addSection(k)}>
                  <PlusOutlined style={{ color: "#52c41a" }} />
                  <Text>
                    {
                      k === "intro"
                        ? "Giới thiệu bản thân"
                        : k === "education"
                        ? "Học vấn"
                        : k === "experience"
                        ? "Kinh nghiệm làm việc"
                        : k === "projects"
                        ? "Dự án"
                        : k === "certificates"
                        ? "Chứng chỉ"
                        : "Hoạt động"
                    }
                  </Text>
                </div>
              ))}

              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <Button block onClick={handleSaveCV}>Lưu CV</Button>
                <Button type="primary" danger block onClick={handleDownloadCV}>
                  Xem Và Tải CV
                </Button>
              </div>
            </Card>
          </Col>

          {/* Main Content */}
          <Col xs={24} md={16}>
            <div ref={printAreaRef} className="cv-print-area">
            <div ref={sectionRefs.profile} id="section-profile">
              <ProfileInfo 
                candidate={candidate} 
                onEdit={() => showModal("profile", candidate)} 
              />
            </div>

            {sectionOrder.map((key) => {
              if (key === "intro") {
                return draggableWrap(
                  key,
                  sectionRefs.intro,
                  <Introduction intro={cvData.intro} onAdd={(item) => showModal("intro", item)} />
                );
              }
              if (key === "education") {
                return draggableWrap(
                  key,
                  sectionRefs.education,
                  <Education 
                    educationList={cvData.education}
                    onAdd={(item) => showModal("education", item)}
                    onDelete={(id) => handleDelete("education", id)}
                  />
                );
              }
              if (key === "experience") {
                return draggableWrap(
                  key,
                  sectionRefs.experience,
                  <Experience 
                    experienceList={cvData.experience}
                    onAdd={(item) => showModal("experience", item)}
                    onDelete={(id) => handleDelete("experience", id)}
                  />
                );
              }
              if (key === "projects") {
                return draggableWrap(
                  key,
                  sectionRefs.projects,
                  <Projects 
                    projectsList={cvData.projects}
                    onAdd={(item) => showModal("project", item)}
                    onDelete={(id) => handleDelete("project", id)}
                  />
                );
              }
              if (key === "certificates") {
                return draggableWrap(
                  key,
                  sectionRefs.certificates,
                  <Certificates 
                    certificatesList={cvData.certificates}
                    onAdd={(item) => showModal("certificate", item)}
                    onDelete={(id) => handleDelete("certificate", id)}
                  />
                );
              }
              if (key === "activities") {
                return draggableWrap(
                  key,
                  sectionRefs.activities,
                  <Activities
                    activityList={cvData.activities}
                    onAdd={(item) => showModal("activity", item)}
                    onDelete={(id) => handleDelete("activity", id)}
                  />
                );
              }
              return null;
            })}
            </div>
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
          modalType === "activity" ? "Thêm hoạt động" :
          modalType === "profile" ? "Cập nhật thông tin cá nhân" :
          modalType === "project" ? "Dự án cá nhân" :
          "Thêm thông tin"
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={modalType === "education" || modalType === "experience" || modalType === "profile" || modalType === "project" || modalType === "certificate" || modalType === "activity" ? 600 : 520}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {modalType === "profile" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img 
                    src={candidate?.avatar || "/src/assets/logologin.png"} 
                    alt="Avatar" 
                    style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <Button 
                    icon={<CameraOutlined />} 
                    shape="circle" 
                    size="small"
                    style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff" }}
                    onClick={handleChooseAvatar}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    style={{ display: "none" }}
                    onChange={handleAvatarFileChange}
                  />
                </div>
                <div style={{ marginTop: 10 }}>
                  <Button size="small" style={{ marginRight: 8 }} onClick={handleChooseAvatar}>Sửa</Button>
                  <Button size="small" danger onClick={handleAvatarDelete}>Xóa</Button>
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
