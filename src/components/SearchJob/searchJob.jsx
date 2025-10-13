import { Input, Button } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import React from "react";

function SearchListJob() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = React.useState("");
  const [city, setCity] = React.useState("");

  const handleSearch = () => {
    navigate(`/search?city=${city || ""}&keyword=${keyword || ""}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Tên công việc, từ khóa..."
        className="search-input"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Input
        prefix={<EnvironmentOutlined />}
        placeholder="Địa điểm làm việc"
        className="location-input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button type="primary" className="find-job-btn" onClick={handleSearch}>
        Tìm kiếm
      </Button>
    </>
  );
}
export default SearchListJob;
