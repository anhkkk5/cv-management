import React from "react";
import { Card, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function Education({ educationList, onAdd, onDelete }) {
  return (
    <Card className="section-card">
      <div className="section-header">
        <Title level={4}>Học Vấn</Title>
        <PlusOutlined className="add-icon" onClick={onAdd} />
      </div>
      {educationList.length > 0 ? (
        educationList.map((edu, index) => (
          <div 
            key={index} 
            style={{ 
              marginBottom: 15, 
              paddingBottom: 15, 
              borderBottom: index < educationList.length - 1 ? "1px solid #f0f0f0" : "none" 
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div style={{ flex: 1 }}>
                <Text strong style={{ display: "block", fontSize: 16 }}>{edu.name_education || edu.school}</Text>
                <Text style={{ display: "block", color: "#666" }}>{edu.major}</Text>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                  {edu.started_at ? dayjs(edu.started_at).format("MMM DD, YYYY") : (edu.startDate ? dayjs(edu.startDate).format("MMM DD, YYYY") : "")} - {edu.end_at ? dayjs(edu.end_at).format("MMM DD, YYYY") : (edu.endDate ? dayjs(edu.endDate).format("MMM DD, YYYY") : "")}
                </Text>
                {(edu.info || edu.description) && (
                  <Text style={{ display: "block", marginTop: 8 }}>{edu.info || edu.description}</Text>
                )}
              </div>
              <div>
                <EditOutlined className="edit-icon" style={{ marginRight: 10 }} onClick={() => onAdd(edu)} />
                <DeleteOutlined 
                  className="delete-icon" 
                  onClick={() => {
                    console.log("Delete clicked, edu.id:", edu.id);
                    if (onDelete) {
                      onDelete(edu.id);
                    } else {
                      console.error("onDelete is not defined");
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <Text className="section-description" type="secondary">
          Thêm thông tin học vấn của bạn
        </Text>
      )}
    </Card>
  );
}

export default Education;
