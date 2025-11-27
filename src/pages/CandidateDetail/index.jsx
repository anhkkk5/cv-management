import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Typography, Spin, Empty } from "antd";
import { get } from "../../utils/axios/request";
import "./style.css";
import ProfileInfo from "../../components/CV/ProfileInfo";
import Introduction from "../../components/CV/Introduction";
import Education from "../../components/CV/Education";
import Experience from "../../components/CV/Experience";
import Projects from "../../components/CV/Projects";
import Certificates from "../../components/CV/Certificates";

const { Text } = Typography;

function CandidateDetail() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cvData, setCvData] = useState({
    intro: "",
    education: [],
    experience: [],
    projects: [],
    certificates: [],
  });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Dùng endpoint CVs mới: /cvs/:candidateId (Role Recruiter/Admin)
        const fullCv = await get(`cvs/${id}`);
        if (!fullCv || !fullCv.candidate) {
          setCandidate(null);
          return;
        }
        setCandidate(fullCv.candidate);

        setCvData({
          intro: fullCv.candidate.introduction || "",
          education: fullCv.education || [],
          experience: fullCv.experiences || [],
          projects: fullCv.projects || [],
          certificates: fullCv.certificates || [],
        });
      } catch (e) {
        console.error("Error loading full CV for candidate:", e);
        setCandidate(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div style={{ padding: 40 }}>
        <Empty description="Không tìm thấy thông tin ứng viên" />
      </div>
    );
  }

  return (
    <div className="cv-page">
      <div className="cv-container">
        <div className="breadcrumb">
          <Text>Trang chủ / Thông tin ứng viên</Text>
        </div>

        <Row gutter={24}>
          {/* Bên trái: thông tin tổng quan */}
          <Col xs={24} md={8}></Col>

          {/* Bên phải: CV chi tiết (chỉ đọc, không có icon chỉnh sửa) */}
          <Col xs={24} md={16}>
            <ProfileInfo candidate={candidate} readOnly={true} />

            <Introduction intro={cvData.intro} readOnly={true} />

            <Education educationList={cvData.education} readOnly={true} />

            <Experience experienceList={cvData.experience} readOnly={true} />

            <Projects projectsList={cvData.projects} readOnly={true} />

            <Certificates certificatesList={cvData.certificates} readOnly={true} />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default CandidateDetail;
