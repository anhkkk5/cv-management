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
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ApartmentOutlined,
  ProfileOutlined,
  BookOutlined,
  ArrowRightOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getDetaiJob } from "../../services/jobServices/jobServices";
import { getAllCompany } from "../../services/getAllCompany/companyServices";
import { getLocation } from "../../services/getAllLocation/locationServices";

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
            const companyResponse = await getAllCompany(jobData.company_id);
            if (companyResponse.ok) {
              const companyData = await companyResponse.json();
              setCompany(companyData);
            }
          } catch {
            setCompany({ id: jobData.company_id, name: "Unknown Company" });
          }
        }

        // Fetch location data if location_id exists
        if (jobData.location_id) {
          try {
            const locationResponse = await getLocation(jobData.location_id);
            if (locationResponse.ok) {
              const locationData = await locationResponse.json();
              setLocationName(
                locationData.name || locationData.city || "Unknown Location"
              );
            }
          } catch {
            setLocationName("Unknown Location");
          }
        }

        // Set mock candidates
        setAppliedCandidates(mockCandidates);

        // Populate form with current job data
        form.setFieldsValue({
          title: jobData.title || jobData.name,
          jobType: jobData.type || jobData.jobType,
          salary: jobData.salary,
          level: jobData.jobLevel || "Entry Level",
          description: jobData.description,
          requirements: jobData.requirements
            ? Array.isArray(jobData.requirements)
              ? jobData.requirements.join("\n")
              : jobData.requirements
            : "",
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
                  {company?.name?.charAt(0) || "?"}
                </Avatar>
                <div className="job-title-section">
                  <Title level={2} className="job-title">
                    {job.title}
                  </Title>
                  <Text className="company-name">
                    at {company?.name || "Unknown"}
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
                {locationName || "Unknown"}
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
    </div>
  );
}

export default JobDetail;
