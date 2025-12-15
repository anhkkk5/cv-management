import { get, post } from "../../utils/axios/request";

// Lấy tất cả reviews
export const getAllReviews = async (companyId) => {
  const url = companyId 
    ? `company-reviews/company/${companyId}`
    : "company-reviews";
  const result = await get(url);
  return result;
};

// Lấy stats của công ty
export const getCompanyStats = async (companyId) => {
  const result = await get(`company-reviews/company/${companyId}/stats`);
  return result;
};

// Tạo review mới
export const createReview = async (reviewData) => {
  const result = await post("company-reviews", reviewData);
  return result;
};

// Thêm comment vào review
export const addComment = async (reviewId, content) => {
  const result = await post(`company-reviews/${reviewId}/comments`, { content });
  return result;
};

// Đánh dấu review hữu ích
export const markHelpful = async (reviewId) => {
  const result = await post(`company-reviews/${reviewId}/helpful`);
  return result;
};

// Lấy chi tiết review
export const getReviewDetail = async (reviewId) => {
  const result = await get(`company-reviews/${reviewId}`);
  return result;
};



