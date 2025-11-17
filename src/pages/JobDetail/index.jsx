import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Tag,
  Spin,
  Empty,
  Button,
  Form,
  Input,
  Select,
  Typography,
  Breadcrumb,
  Avatar,
  message,
  Modal,
  DatePicker,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,

  ArrowRightOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getDetaiJob, updateJob } from "../../services/jobServices/jobServices";
import { getDetaiCompany } from "../../services/getAllCompany/companyServices";
import { getLocationById } from "../../services/getAllLocation/locationServices";
import { getCookie } from "../../helpers/cookie";

import "./style.css";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = React.useState(false);
  const [job, setJob] = React.useState(null);
  const [company, setCompany] = React.useState(null);
  const [locationName, setLocationName] = React.useState("");
  const [appliedCandidates, setAppliedCandidates] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isCompany, setIsCompany] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);

  // Mock data for candidates (can be replaced with real API later)
  const mockCandidates = [
    {
      id: "C001",
      name: "Nguyen Van A",
      position: "Front-end",
      experience: "Fresher",
      skills: ["REACTJS", "NODEJS"],
      language: "N2",
      location: "Ha Noi, Viet Nam",
      avatar: null,
    },
    {
      id: "C002",
      name: "Tran Thi B",
      position: "Front-end",
      experience: "Fresher",
      skills: ["REACTJS", "NODEJS"],
      language: "N2",
      location: "Ha Noi, Viet Nam",
      avatar: null,
    },
    {
      id: "C003",
      name: "Le Van C",
      position: "Front-end",
      experience: "Fresher",
      skills: ["REACTJS", "NODEJS"],
      language: "N2",
      location: "Ha Noi, Viet Nam",
      avatar: null,
    },
  ];

  // Check if user is company
  React.useEffect(() => {
    const userType = getCookie("userType");
    setIsCompany(userType === "company");
  }, []);

  React.useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch job data using service
        const jobData = await getDetaiJob(id);

        if (!jobData) {
          throw new Error("Job not found");
        }

        setJob(jobData);

        // Fetch company data if company_id exists
        if (jobData.company_id) {
          try {
            const companyData = await getDetaiCompany(jobData.company_id);
            if (companyData) {
              setCompany(companyData);
            }
          } catch (error) {
            console.error("Error fetching company:", error);
            setCompany({ id: jobData.company_id, name: "Unknown Company" });
          }
        }

        // Fetch location data if location_id exists, otherwise fall back to job.location text
        if (jobData.location_id) {
          try {
            const locationData = await getLocationById(jobData.location_id);
            if (locationData) {
              setLocationName(
                locationData.name || locationData.city || "Unknown Location"
              );
            }
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocationName("Unknown Location");
          }
        } else if (jobData.location) {
          setLocationName(jobData.location);
        }

        // Set mock candidates
        setAppliedCandidates(mockCandidates);

        // Populate form with current job data
        form.setFieldsValue({
          title: jobData.title || jobData.name,
          jobType: jobData.type || jobData.jobType,
          salary: jobData.salary,
          level: jobData.jobLevel || jobData.level || "Entry Level",
          description: jobData.description,
          requirements: jobData.requirements
            ? Array.isArray(jobData.requirements)
              ? jobData.requirements.join("\n")
              : jobData.requirements
            : "",
          experience: jobData.experience || "",
          education: jobData.education || "",
          desirable: jobData.desirable
            ? Array.isArray(jobData.desirable)
              ? jobData.desirable.join("\n")
              : jobData.desirable
            : "",
          benefits: jobData.benefits
            ? Array.isArray(jobData.benefits)
              ? jobData.benefits.join("\n")
              : jobData.benefits
            : "",
          location: jobData.location || jobData.location_id || "",
          status: jobData.status || "active",
          startDate: jobData.created_at ? dayjs(jobData.created_at) : dayjs(),
          endDate: jobData.expire_at
            ? dayjs(jobData.expire_at)
            : dayjs().add(30, "days"),
        });
      } catch (error) {
        console.error("Error loading job data:", error);
        message.error("Không thể tải thông tin công việc");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, form]);

  const copyJobLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      message.success("Đã copy link công việc!");
    });
  };

  const showUpdateModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdate = async (values) => {
    try {
      setUpdating(true);
      
      // Giữ nguyên tất cả các trường hiện có và chỉ cập nhật những trường được chỉnh sửa
      // Chuyển đổi string thành array cho requirements, desirable, benefits
      const convertToArray = (value) => {
        if (!value) return [];
        if (typeof value === 'string') {
          return value.split('\n').filter(item => item.trim() !== '');
        }
        return value;
      };

      const updateData = {
        // các field theo UpdateJobDto / CreateJobDto
        title: values.title,
        description: values.description,
        company: job.company,
        salary: values.salary,
        type: values.jobType,
        jobLevel: values.level,
        requirements: convertToArray(values.requirements),
        desirable: convertToArray(values.desirable),
        benefits: convertToArray(values.benefits),
        experience: values.experience || "",
        education: values.education || "",
        location_id: job.location_id || undefined,
        company_id: job.company_id || undefined,
        status: values.status || job.status || "active",
        expire_at: values.endDate
          ? values.endDate.format("YYYY-MM-DD")
          : job.expire_at,
      };

      await updateJob(id, updateData);
      message.success("Cập nhật thông tin công việc thành công!");
      setIsModalVisible(false);
      
      // Reload job data
      const jobData = await getDetaiJob(id);
      setJob(jobData);
      form.setFieldsValue({
        title: jobData.title || jobData.name,
        jobType: jobData.type || jobData.jobType,
        salary: jobData.salary,
        level: jobData.jobLevel || jobData.level || "Entry Level",
        description: jobData.description,
        requirements: jobData.requirements
          ? Array.isArray(jobData.requirements)
            ? jobData.requirements.join("\n")
            : jobData.requirements
          : "",
        experience: jobData.experience || "",
        education: jobData.education || "",
        desirable: jobData.desirable
          ? Array.isArray(jobData.desirable)
            ? jobData.desirable.join("\n")
            : jobData.desirable
          : "",
        benefits: jobData.benefits
          ? Array.isArray(jobData.benefits)
            ? jobData.benefits.join("\n")
            : jobData.benefits
          : "",
        location: jobData.location || jobData.location_id || "",
        status: jobData.status || "active",
        startDate: jobData.created_at ? dayjs(jobData.created_at) : dayjs(),
        endDate: jobData.expire_at
          ? dayjs(jobData.expire_at)
          : dayjs().add(30, "days"),
      });
    } catch (error) {
      console.error("Error updating job:", error);
      message.error("Không thể cập nhật thông tin công việc");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!job) {
    return <Empty description="Không tìm thấy công việc" />;
  }

  return (
    <div className="job-detail-container">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Việc làm</Breadcrumb.Item>
        <Breadcrumb.Item>{job.title || "Chi tiết công việc"}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[24, 24]}>
        {/* Main Content */}
        <Col xs={24} lg={16}>
          <Card className="job-detail-card">
            {/* Job Header */}
            <div className="job-header">
              <div className="job-header-left">
                <Avatar size={60} className="company-logo">
                  {(company?.companyName || company?.name)?.charAt(0) || "?"}
                </Avatar>
                <div className="job-title-section">
                  <Title level={2} className="job-title">
                    {job.title}
                  </Title>
                  <Text className="company-name">
                    at {company?.companyName || company?.name || "Unknown"}
                  </Text>
                  <div className="job-tags">
                    <Tag
                      color={
                        job.type === "FULL-TIME"
                          ? "green"
                          : job.type === "PART-TIME"
                          ? "blue"
                          : "orange"
                      }
                      className="job-tag"
                    >
                      {job.type || job.jobType}
                    </Tag>
                    <Tag color="red" className="job-tag">
                      Featured
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="job-section">
              <Title level={4}>Job Description</Title>
              <Paragraph className="job-description">
                {job.description}
              </Paragraph>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="job-section">
                <Title level={4}>Requirements</Title>
                <ul className="job-list">
                  {Array.isArray(job.requirements) ? (
                    job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))
                  ) : (
                    <li>{job.requirements}</li>
                  )}
                </ul>
              </div>
            )}

            {/* Desirable */}
            {job.desirable && (
              <div className="job-section">
                <Title level={4}>Desirable</Title>
                <ul className="job-list">
                  {Array.isArray(job.desirable) ? (
                    job.desirable.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <li>{job.desirable}</li>
                  )}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="job-section">
                <Title level={4}>Benefits</Title>
                <ul className="job-list">
                  {Array.isArray(job.benefits) ? (
                    job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))
                  ) : (
                    <li>{job.benefits}</li>
                  )}
                </ul>
              </div>
            )}
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Card className="job-overview-card">
            {/* Update Button - Only show for company */}
            {isCompany && (
              <Button
                type="primary"
                onClick={showUpdateModal}
                style={{
                  width: "100%",
                  marginBottom: "20px",
                  backgroundColor: "#c41e3a",
                  borderColor: "#c41e3a",
                }}
              >
                Cập Nhật Thông Tin
              </Button>
            )}
            {/* Salary */}
            <div className="salary-section">
              <Text className="salary-label">Salary (USD)</Text>
              <Title level={3} className="salary-amount">
                {job.salary}
              </Title>
              <Text className="salary-period">Yearly salary</Text>
            </div>
            {/* Location */}
            <div className="location-section">
              <Text className="location-label">Job Location</Text>
              <Text className="location-value">
                {job.location || locationName || "Unknown"}
              </Text>
            </div>
            {/* Job Overview */}

            <div className="overview-section">
              <h4>Job Overview</h4>
              <div className="overview-grid">
                <div className="overview-item">
                  <div className="overview-item-label">
                    <CalendarOutlined className="overview-icon" />
                    JOB POSTED
                  </div>
                  <div className="overview-item-value">
                    {job.created_at
                      ? dayjs(job.created_at).format("DD MMM, YYYY")
                      : "N/A"}
                  </div>
                </div>
                {/* Tương tự cho các items khác */}
              </div>
            </div>
            {/* Share */}
            <div className="share-section">
              <Title level={4}>Share this job</Title>
              <div className="share-buttons">
                <Button
                  icon={<LinkOutlined />}
                  onClick={copyJobLink}
                  className="copy-link-btn"
                >
                  Copy Links
                </Button>
                <div className="social-buttons">
                  <Button
                    icon={<LinkedinOutlined />}
                    className="social-btn linkedin"
                  />
                  <Button
                    icon={<FacebookOutlined />}
                    className="social-btn facebook"
                  />
                  <Button
                    icon={<TwitterOutlined />}
                    className="social-btn twitter"
                  />
                  <Button
                    icon={<MailOutlined />}
                    className="social-btn email"
                  />
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Applied Candidates */}
      <div className="applied-candidates-section">
        <Title level={3}>Applied Candidates</Title>
        <Row gutter={[16, 16]}>
          {appliedCandidates.map((candidate) => (
            <Col xs={24} sm={12} md={8} key={candidate.id}>
              <Card
                hoverable
                className="candidate-card"
                onClick={() => navigate(`/candidates/${candidate.id}`)}
              >
                <div className="candidate-info">
                  <Avatar size={50} className="candidate-avatar">
                    {candidate.name.charAt(0)}
                  </Avatar>
                  <div className="candidate-details">
                    <Title level={5} className="candidate-name">
                      {candidate.name}
                    </Title>
                    <div className="candidate-tags">
                      <Tag color="green">{candidate.position}</Tag>
                      <Tag color="blue">{candidate.experience}</Tag>
                    </div>
                    <div className="candidate-skills">
                      <Text className="skills-label">Technical in use:</Text>
                      <div className="skills-tags">
                        {candidate.skills.map((skill, index) => (
                          <Tag key={index} color="green" className="skill-tag">
                            {skill}
                          </Tag>
                        ))}
                      </div>
                    </div>
                    <div className="candidate-language">
                      <Text className="language-label">Foreign Language:</Text>
                      <Tag color="orange">{candidate.language}</Tag>
                    </div>
                    <div className="candidate-location">
                      <EnvironmentOutlined className="location-icon" />
                      <Text>{candidate.location}</Text>
                    </div>
                  </div>
                  <ArrowRightOutlined className="candidate-arrow" />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Update Job Modal */}
      <Modal
        title="Cập nhật thông tin công việc"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            label="Tên công việc"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên công việc!" }]}
          >
            <Input placeholder="Technical Support" />
          </Form.Item>

          <Form.Item
            label="Thời gian làm việc"
            name="jobType"
            rules={[{ required: true, message: "Vui lòng chọn thời gian làm việc!" }]}
          >
            <Select placeholder="Chọn thời gian">
              <Option value="FULL-TIME">Full-time</Option>
              <Option value="PART-TIME">Part-time</Option>
              <Option value="INTERN">Intern</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Mức lương"
            name="salary"
            rules={[{ required: true, message: "Vui lòng nhập mức lương!" }]}
          >
            <Input placeholder="$500 - $1,500" />
          </Form.Item>

          <Form.Item
            label="Cấp độ chuyên môn"
            name="level"
            rules={[{ required: true, message: "Vui lòng chọn cấp độ!" }]}
          >
            <Select placeholder="Chọn cấp độ">
              <Option value="Senior">Senior</Option>
              <Option value="Junior">Junior</Option>
              <Option value="Fresher">Fresher</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Mô tả công việc"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea rows={4} placeholder="Hint text" />
          </Form.Item>

          <Form.Item
            label="Yêu cầu của công việc"
            name="requirements"
          >
            <TextArea rows={4} placeholder="Nhập yêu cầu công việc (mỗi yêu cầu 1 dòng)" />
          </Form.Item>

          <Form.Item
            label="Kinh nghiệm yêu cầu"
            name="experience"
          >
            <Input placeholder="Ví dụ: 2-3 năm" />
          </Form.Item>

          <Form.Item
            label="Trình độ học vấn"
            name="education"
          >
            <Select placeholder="Chọn trình độ">
              <Option value="Đại học">Đại học</Option>
              <Option value="Cao đẳng">Cao đẳng</Option>
              <Option value="Trung cấp">Trung cấp</Option>
              <Option value="Không yêu cầu">Không yêu cầu</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Kỹ năng mong muốn (Desirable)"
            name="desirable"
          >
            <TextArea rows={3} placeholder="Nhập các kỹ năng mong muốn (mỗi kỹ năng 1 dòng)" />
          </Form.Item>

          <Form.Item
            label="Quyền lợi (Benefits)"
            name="benefits"
          >
            <TextArea rows={4} placeholder="Nhập các quyền lợi (mỗi quyền lợi 1 dòng)" />
          </Form.Item>

          <Form.Item
            label="Địa điểm làm việc"
            name="location"
          >
            <Input placeholder="Ví dụ: Hà Nội" />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="active">Đang tuyển</Option>
              <Option value="inactive">Ngừng tuyển</Option>
              <Option value="closed">Đã đóng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Thời gian ứng tuyển"
            style={{ marginBottom: 0 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startDate"
                  label="Start Date"
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="MMM DD, YYYY"
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endDate"
                  label="End Date"
                  rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="MMM DD, YYYY"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Button
                  block
                  onClick={handleCancel}
                >
                  Hủy Bỏ
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={updating}
                  style={{
                    backgroundColor: "#c41e3a",
                    borderColor: "#c41e3a",
                  }}
                >
                  Cập Nhật
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default JobDetail;
