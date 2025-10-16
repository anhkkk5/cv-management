import React from "react";
import { Card, Typography } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function Introduction({ intro, onAdd }) {
  return (
    <Card className="section-card">
      <div className="section-header">
        <Title level={4}>Giới Thiệu Bản Thân</Title>
        {intro ? (
          <EditOutlined className="edit-icon" onClick={() => onAdd(intro)} />
        ) : (
          <PlusOutlined className="add-icon" onClick={() => onAdd(null)} />
        )}
      </div>
      {intro ? (
        <Text className="section-description">{intro}</Text>
      ) : (
        <Text className="section-description" type="secondary">
          Giới thiệu điểm mạnh của bản thân và kinh nghiệm của bạn
        </Text>
      )}
    </Card>
  );
}

export default Introduction;
