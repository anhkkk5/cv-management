import React from "react";
import { Card, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function Certificates({ certificatesList, onAdd, onDelete }) {
  return (
    <Card className="section-card">
      <div className="section-header">
        <Title level={4}>Chứng Chỉ</Title>
        <PlusOutlined className="add-icon" onClick={onAdd} />
      </div>
      {certificatesList.length > 0 ? (
        certificatesList.map((cert, index) => (
          <div 
            key={index} 
            style={{ 
              marginBottom: 15, 
              paddingBottom: 15, 
              borderBottom: index < certificatesList.length - 1 ? "1px solid #f0f0f0" : "none" 
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div style={{ flex: 1 }}>
                <Text strong style={{ display: "block", fontSize: 16 }}>{cert.certificate_name || cert.certificateName}</Text>
                <Text style={{ display: "block", color: "#666" }}>{cert.organization}</Text>
                <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                  {cert.started_at ? dayjs(cert.started_at).format("MMM DD, YYYY") : (cert.startDate ? dayjs(cert.startDate).format("MMM DD, YYYY") : "")} - {cert.end_at ? dayjs(cert.end_at).format("MMM DD, YYYY") : (cert.endDate ? dayjs(cert.endDate).format("MMM DD, YYYY") : "")}
                </Text>
                {cert.description && (
                  <Text style={{ display: "block", marginTop: 8 }}>{cert.description}</Text>
                )}
              </div>
              <div>
                <EditOutlined className="edit-icon" style={{ marginRight: 10 }} onClick={() => onAdd(cert)} />
                <DeleteOutlined className="delete-icon" onClick={() => onDelete && onDelete(cert.id)} />
              </div>
            </div>
          </div>
        ))
      ) : (
        <Text className="section-description" type="secondary">
          Bổ sung chứng chỉ tiêu chuẩn để nâng cao năng lực của bạn
        </Text>
      )}
    </Card>
  );
}

export default Certificates;
