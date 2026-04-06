import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users (Simple auth)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Certificates
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  certificateNumber: text("certificate_number").notNull().unique(),
  courseName: text("course_name").notNull(),
  courseDuration: text("course_duration").notNull(),
  attendancePercentage: integer("attendance_percentage").notNull(),
  grade: text("grade").notNull(),
  issueDate: text("issue_date").notNull(), // ISO date string
  studentPhoto: text("student_photo"), // URL or Base64
  qrCodeUrl: text("qr_code_url"), // Generated URL or Base64
  verifyUrl: text("verify_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Gallery Albums (Multiple photos per album)
export const galleryAlbums = pgTable("gallery_albums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // e.g., 'Hair', 'Nails', 'Makeup', 'Academy'
  imageUrls: text("image_urls").array().notNull(), // Array of URLs (max 10)
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact Messages
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertCertificateSchema = createInsertSchema(certificates).omit({ 
  id: true, 
  createdAt: true,
  qrCodeUrl: true, 
  verifyUrl: true 
});

export const insertGalleryAlbumSchema = createInsertSchema(galleryAlbums).omit({ 
  id: true, 
  createdAt: true 
}).extend({
  imageUrls: z.array(z.string()).min(1).max(10)
});

export const insertContactMessageSchema = createInsertSchema(contactMessages)
  .omit({ id: true, createdAt: true })
  .extend({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    mobile: z.string().min(10, "Valid mobile number is required"),
    message: z.string().min(1, "Message is required"),
  });

// Types
export type User = typeof users.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type GalleryAlbum = typeof galleryAlbums.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
