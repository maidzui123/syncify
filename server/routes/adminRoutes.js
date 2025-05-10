import express from "express";
import authentication from "../middleware/auth.js";
import adminControllers from "../controllers/adminControllers.js";
const router = express.Router();

// Get Total Users
router.get(
  "/api/admin/users/total",
  authentication,
  adminControllers.getTotalUsers
);

// Get Total Posts
router.get(
  "/api/admin/posts/total",
  authentication,
  adminControllers.getTotalPosts
);

// Get Total Comments
router.get(
  "/api/admin/comments/total",
  authentication,
  adminControllers.getTotalComments
);

// Get Total Assessments
router.get(
  "/api/admin/assessments/total",
  authentication,
  adminControllers.getTotalAssessments
);

// Get 5 Users Most Popular
router.get(
  "/api/admin/users/popular",
  authentication,
  adminControllers.getTopUsersMostPopular
);

// Get Admin Infomation
router.get("/api/admin/info", authentication, adminControllers.getAdminInfo);

// Get Users List
router.get("/api/admin/users", authentication, adminControllers.getUserList);

// Update Users List
router.patch(
  "/api/admin/user/:userId",
  authentication,
  adminControllers.updateUserProfile
);

// Banned User
router.post(
  "/api/admin/users/banned",
  authentication,
  adminControllers.bannedUser
);

// Get List Posts
router.get("/api/admin/posts", authentication, adminControllers.getListPosts);

// Update Post
router.patch(
  "/api/admin/post/:postId",
  authentication,
  adminControllers.updatePost
);

// Get List Report Posts
router.get(
  "/api/admin/posts/reports",
  authentication,
  adminControllers.getListReportPosts
);

// Delete Report Post
router.delete(
  "/api/admin/posts/reports/:postId",
  authentication,
  adminControllers.deleteReportPost
);

// Get List Assessments
router.get(
  "/api/admin/assessments",
  authentication,
  adminControllers.getListAssessments
);

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: API liên quan đến quản trị viên
 * /api/admin/users/total:
 *    get:
 *      summary: Get total users
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Thành công, trả về tổng số người dùng
 * /api/admin/posts/total:
 *    get:
 *      summary: Get total posts
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Thành công, trả về tổng số bài viết
 * /api/admin/comments/total:
 *    get:
 *      summary: Get total comments
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Thành công, trả về tổng số bình luận
 * /api/admin/assessments/total:
 *    get:
 *      summary: Get total assessments
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Thành công, trả về tổng số đánh giá
 * /api/admin/users/popular:
 *    get:
 *      summary: Get 5 most popular users
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Thành công, trả về danh sách 5 người dùng phổ biến nhất
 * /api/admin/info:
 *    get:
 *      summary: Get admin information
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Thành công, trả về thông tin quản trị viên
 * /api/admin/users:
 *    get:
 *      summary: Get users list
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Thành công, trả về danh sách người dùng
 * /api/admin/user/{userId}:
 *    patch:
 *      summary: Update user profile
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: userId
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Thành công, cập nhật hồ sơ người dùng
 * /api/admin/users/banned:
 *    post:
 *      summary: Ban a user
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: string
 *      responses:
 *        200:
 *          description: Thành công, người dùng đã bị cấm
 * /api/admin/posts:
 *    get:
 *      summary: Get list of posts
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Thành công, trả về danh sách bài viết
 * /api/admin/post/{postId}:
 *    patch:
 *      summary: Update a post
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: postId
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Thành công, bài viết đã được cập nhật
 * /api/admin/posts/reports:
 *    get:
 *      summary: Get list of reported posts
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Thành công, trả về danh sách bài viết bị báo cáo
 * /api/admin/posts/reports/{postId}:
 *    delete:
 *      summary: Delete a reported post
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: postId
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Thành công, bài viết bị báo cáo đã bị xoá
 * /api/admin/assessments:
 *    get:
 *      summary: Get list of assessments
 *      tags:
 *        - Admin
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Thành công, trả về danh sách đánh giá
 */

export default router;
