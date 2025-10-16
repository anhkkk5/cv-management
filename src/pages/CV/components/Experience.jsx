import React from "react";
import { Card, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function Experience({ experienceList, onAdd }) {
  return (
    <Card className="section-card">
      <div className="section-header">
        <Title level={4}>Kinh Nghiệm Làm Việc</Title>
        <PlusOutlined className="add-icon" onClick={onAdd} />
      </div>
      {experienceList.length > 0 ? (
        experienceList.map((exp, index) => (
          <div 
            key={index} 
            style={{ 
              marginBottom: 15, 
              paddingBottom: 15, 
              borderBottom: index < experienceList.length - 1 ? "1px solid #f0f0f0" : "none" 
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div style={{ flex: 1 }}>
                <Text strong style={{ display: "block", fontSize: 16 }}>{exp.position}</Text>
                <Text style={{ display: "block", color: "#666" }}>{exp.company}</Text>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                  {exp.started_at ? dayjs(exp.started_at).format("MMM DD, YYYY") : (exp.startDate ? dayjs(exp.startDate).format("MMM DD, YYYY") : "")} - {exp.end_at ? dayjs(exp.end_at).format("MMM DD, YYYY") : (exp.endDate ? dayjs(exp.endDate).format("MMM DD, YYYY") : "")}
                </Text>
                {(exp.info || exp.description) && (
                  <Text style={{ display: "block", marginTop: 8 }}>{exp.info || exp.description}</Text>
                )}
              </div>
              <div>
                <EditOutlined className="edit-icon" style={{ marginRight: 10 }} onClick={() => onAdd(exp)} />
                <DeleteOutlined className="delete-icon" />
              </div>
            </div>
          </div>
        ))
      ) : (
        <Text className="section-description" type="secondary">
          Thêm kinh nghiệm làm việc của bạn
        </Text>
      )}
    </Card>
  );
}

export default Experience;
