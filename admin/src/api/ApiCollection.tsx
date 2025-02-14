import axios from "axios";
const API_URL = "http://localhost:3001/api/admin";
const UPLOAD_URL = "http://localhost:3001/api/upload";
// LOGIN
export const login = async (email: string, password: string) => {
  const response = await axios
    .post(`${API_URL}/login`, {
      email,
      password,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL USERS
export const fetchTotalUsers = async () => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .get(`${API_URL}/users/total`, { headers: { Authorization: headers } })
    .then((res) => {
      console.log("axios get:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL POSTS
export const fetchTotalPosts = async () => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .get(`${API_URL}/posts/total`, { headers: { Authorization: headers } })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOP DEALS
export const fetchTopUsersPopular = async () => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .get(`${API_URL}/users/popular`, { headers: { Authorization: headers } })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL COMMENTS
export const fetchTotalComments = async () => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .get(`${API_URL}/comments/total`, { headers: { Authorization: headers } })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL ASSESSMENTS
export const fetchTotalAssessments = async () => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .get(`${API_URL}/assessments/total`, {
      headers: { Authorization: headers },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ADMIN INFOMATION
export const fetchAdminInfo = async () => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .get(`${API_URL}/info`, { headers: { Authorization: headers } })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL USERS
export const fetchUsers = async () => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .get(`${API_URL}/users`, { headers: { Authorization: headers } })
    .then((res) => {
      console.log("axios get:", res.data);
      return res.data.userListProcessed;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// BANNED USER
export const bannedUser = async (bannedUserId: string) => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .post(
      `${API_URL}/users/banned`,
      { bannedUserId: bannedUserId },
      { headers: { Authorization: headers } }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// DELETE REPORT POST
export const deleteReportedPost = async (postId: string) => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .delete(`${API_URL}/posts/reports/${postId}`, {
      headers: { Authorization: headers },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL REPORT POSTS
export const fetchReportedPosts = async () => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .get(`${API_URL}/posts/reports`, { headers: { Authorization: headers } })
    .then((res) => {
      return res.data.listWithUniqueIds;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET LIST POSTS
export const fetchListPosts = async () => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .get(`${API_URL}/posts`, { headers: { Authorization: headers } })
    .then((res) => {
      return res.data.listPostsProcessed;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// UPLOAD FILE
export const uploadFile = async (file: any, type = "image", folderName = "post") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("folderName", folderName);

  try {
    const response = await axios.post(UPLOAD_URL, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.url; 
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

// UPDATE POST
export const updatePost = async (id: any, data: any) => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .patch(`${API_URL}/post/${id}`, data, {
      headers: { Authorization: headers },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
  return response;
};

// UPDATE USER INFO
export const updateUserInfo = async (id: any, data: any) => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .patch(`${API_URL}/user/${id}`, data, {
      headers: { Authorization: headers },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
  return response;
};

// GET ALL ASSESSMENTS
export const fetchAssessments = async () => {
  const headers = "Bearer " + localStorage.getItem("accessToken");
  const response = await axios
    .get(`${API_URL}/assessments`, { headers: { Authorization: headers } })
    .then((res) => {
      return res.data.listAssessmentsProcessed;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL SOURCE
export const fetchTotalSource = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/totalsource")
    .then((res) => {
      console.log("axios get:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL VISIT
export const fetchTotalVisit = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/totalvisit")
    .then((res) => {
      console.log("axios get:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL REVENUE BY PRODUCTS
export const fetchTotalRevenueByProducts = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/totalrevenue-by-product")
    .then((res) => {
      console.log("axios get:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL PROFIT
export const fetchTotalProfit = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/totalprofit")
    .then((res) => {
      console.log("axios get:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET SINGLE USER
export const fetchSingleUser = async (id: string) => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/users/${id}`)
    .then((res) => {
      console.log("axios get:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL PRODUCTS
export const fetchProducts = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/products")
    .then((res) => {
      console.log("axios get:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET SINGLE PRODUCT
export const fetchSingleProduct = async (id: string) => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/products/${id}`)
    .then((res) => {
      console.log("axios get:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL NOTES
export const fetchNotes = async () => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/notes?q=`)
    .then((res) => {
      console.log("axios get:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL LOGS
export const fetchLogs = async () => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/logs`)
    .then((res) => {
      console.log("axios get:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};
