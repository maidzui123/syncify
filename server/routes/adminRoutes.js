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
router.patch("/api/admin/post/:postId", authentication, adminControllers.updatePost);

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
 *
 */

export default router;
