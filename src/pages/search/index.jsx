import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAlljob } from "../../services/jobServices/jobServices"; // Import service để lấy danh sách job
import { getLocation } from "../../services/getAllLocation/locationServices"; // Import service để lấy danh sách location
import { getAllCompany } from "../../services/getAllCompany/companyServices"; // Import service để lấy danh sách company
import { Tag } from "antd";
import SearchList from "../search/searchList";

/**
 * Component Search - Trang tìm kiếm công việc
 *
 * Chức năng chính:
 * - Đọc query parameters từ URL (city, keyword)
 * - Fetch tất cả jobs từ API
 * - Lọc jobs theo điều kiện search
 * - Hiển thị kết quả tìm kiếm
 *
 * URL example: /search?city=Hanoi&keyword=react
 */
function Search() {
  // Hook để đọc query parameters từ URL
  // VD: /search?city=Hanoi&keyword=react
  const [searchParams] = useSearchParams();

  // State lưu trữ danh sách jobs đã được filter
  const [data, setData] = useState([]);

  // Lấy giá trị city từ URL parameter
  // Nếu không có thì default là chuỗi rỗng
  const citySearch = searchParams.get("city") || "";

  // Lấy giá trị keyword từ URL parameter
  // Nếu không có thì default là chuỗi rỗng
  const keywordSearch = searchParams.get("keyword") || "";

  // useEffect chạy khi component mount hoặc khi search parameters thay đổi
  useEffect(() => {
    /**
     * Hàm async để fetch và filter data
     */
    const fetchApi = async () => {
      try {
        // Gọi API để lấy tất cả jobs, locations và companies
        const [jobs, locations, companies] = await Promise.all([
          getAlljob(),
          getLocation(),
          getAllCompany()
        ]);

        if (jobs && locations && companies) {
          // Filter jobs theo điều kiện search
          const newData = jobs.filter((item) => {
            // ✅ Kiểm tra điều kiện city
            // Nếu có citySearch, tìm location_id tương ứng với tên thành phố
            let cityMatch = true;
            if (citySearch) {
              // Tìm location có tên khớp với citySearch
              const location = locations.find(loc => 
                loc.name?.toLowerCase().includes(citySearch.toLowerCase()) ||
                loc.city?.toLowerCase().includes(citySearch.toLowerCase())
              );
              
              // Nếu tìm thấy location, check xem job có location_id khớp không
              if (location) {
                cityMatch = item.location_id === location.id;
              } else {
                // Nếu không tìm thấy location, thử so sánh trực tiếp với location_id
                cityMatch = item.location_id?.toLowerCase().includes(citySearch.toLowerCase());
              }
            }

            // ✅ Kiểm tra điều kiện keyword
            // Tìm keyword trong title, description, jobLevel, type VÀ tên công ty
            // Normalize: loại bỏ khoảng trắng và chuyển về lowercase để tìm kiếm linh hoạt
            const keyword = keywordSearch
              ? (() => {
                  const normalizedKeyword = keywordSearch.toLowerCase().replace(/\s+/g, '');
                  const normalizedTitle = item.title?.toLowerCase().replace(/\s+/g, '') || '';
                  const normalizedDesc = item.description?.toLowerCase().replace(/\s+/g, '') || '';
                  const normalizedLevel = item.jobLevel?.toLowerCase().replace(/\s+/g, '') || '';
                  const normalizedType = item.type?.toLowerCase().replace(/\s+/g, '') || '';
                  
                  // Tìm company tương ứng với job
                  const company = companies.find(comp => comp.id === item.company_id);
                  const normalizedCompanyName = (company?.companyName || company?.name || '').toLowerCase().replace(/\s+/g, '');
                  
                  return (
                    normalizedTitle.includes(normalizedKeyword) ||
                    normalizedDesc.includes(normalizedKeyword) ||
                    normalizedLevel.includes(normalizedKeyword) ||
                    normalizedType.includes(normalizedKeyword) ||
                    normalizedCompanyName.includes(normalizedKeyword)
                  );
                })()
              : true;

            // Trả về job chỉ khi tất cả điều kiện đều thỏa mãn
            return cityMatch && keyword;
          });

          // ✅ Reverse array để hiển thị jobs mới nhất trước
          // Cập nhật state với data đã được filter và reverse
          setData(newData.reverse());
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        // Có thể thêm error handling ở đây
      }
    };

    // Gọi hàm fetch
    fetchApi();
  }, [citySearch, keywordSearch]); // ✅ Dependencies: chạy lại khi search params thay đổi

  return (
    <>
      {/* Search Results Header - Hiển thị tiêu đề và các tag tìm kiếm */}
      <div>
        <strong>Kết quả tìm kiếm</strong>

        {/* Hiển thị tag city nếu có search theo city */}
        {citySearch && (
          <Tag color="blue" style={{ marginLeft: "8px" }}>
            📍 {citySearch}
          </Tag>
        )}

        {/* Hiển thị tag keyword nếu có search theo keyword */}
        {keywordSearch && (
          <Tag color="green" style={{ marginLeft: "8px" }}>
            🔍 {keywordSearch}
          </Tag>
        )}
      </div>

      {/* Search Results List - Hiển thị danh sách kết quả */}
      {/* Chỉ render SearchList khi có data */}
      {data && data.length > 0 && <SearchList data={data} />}

      {/* Có thể thêm empty state khi không có kết quả */}
      {data && data.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Không tìm thấy công việc phù hợp với từ khóa tìm kiếm</p>
        </div>
      )}
    </>
  );
}

export default Search;

/**
 * 💡 GIẢI THÍCH LOGIC FILTER:
 *
 * 1. CITY FILTER:
 *    - Fetch danh sách Locations để map tên thành phố với location_id
 *    - Nếu có citySearch: tìm location có tên khớp (Hà Nội → LOC001)
 *    - So sánh job.location_id với location.id tìm được
 *    - Nếu không tìm thấy location, thử so sánh trực tiếp với location_id
 *    - Nếu không có citySearch: bỏ qua (return true)
 *
 * 2. KEYWORD FILTER:
 *    - Fetch danh sách Companies để tìm kiếm theo tên công ty
 *    - Normalize keyword và fields: loại bỏ khoảng trắng, chuyển lowercase
 *    - "Full stack" → "fullstack", "Fullstack Developer" → "fullstackdeveloper"
 *    - Tìm trong: title, description, jobLevel, type, VÀ tên công ty (case-insensitive, space-insensitive)
 *    - Nếu không có keywordSearch: bỏ qua (return true)
 *
 * 3. KẾT QUỢ:
 *    - Job được hiển thị khi: cityMatch && keyword = true
 *    - Array được reverse để hiển thị jobs mới nhất trước
 *
 * 📝 VÍ DỤ:
 * URL: /search?city=Hà Nội&keyword=fpt
 *
 * - citySearch = "Hà Nội" → tìm location có name="Hà Nội" → location.id="LOC001"
 * - keywordSearch = "fpt"
 * - Filter: jobs có location_id="LOC001" và (title/description/companyName chứa "fpt")
 * - Kết quả: Hiển thị tất cả jobs của FPT Software tại Hà Nội
 */
