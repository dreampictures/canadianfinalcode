import { db } from "./db";
import {
  users, certificates, galleryAlbums, contactMessages,
  type User, type Certificate, type GalleryAlbum, type ContactMessage,
  insertCertificateSchema, insertGalleryAlbumSchema, insertContactMessageSchema
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

// Define strict types for creation to avoid ambiguity
export type CreateCertificateRequest = z.infer<typeof insertCertificateSchema>;
export type CreateGalleryAlbumRequest = z.infer<typeof insertGalleryAlbumSchema>;
export type CreateContactMessageRequest = z.infer<typeof insertContactMessageSchema>;

export type InsertUser = {
  username: string;
  password: string;
};

export interface IStorage {
  // User (Admin)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  deleteUser(id: number): Promise<void>;

  // Certificates
  getCertificates(): Promise<Certificate[]>;
  getCertificate(id: number): Promise<Certificate | undefined>;
  getCertificateByNumber(number: string): Promise<Certificate | undefined>;
  createCertificate(cert: CreateCertificateRequest & { verifyUrl: string, qrCodeUrl?: string }): Promise<Certificate>;
  deleteCertificate(id: number): Promise<void>;

  // Gallery Albums
  getGalleryAlbums(): Promise<GalleryAlbum[]>;
  createGalleryAlbum(album: CreateGalleryAlbumRequest): Promise<GalleryAlbum>;
  deleteGalleryAlbum(id: number): Promise<void>;

  // Contact
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: CreateContactMessageRequest): Promise<ContactMessage>;
  deleteContactMessage(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Certificates
  async getCertificates(): Promise<Certificate[]> {
    return await db.select().from(certificates).orderBy(desc(certificates.createdAt));
  }

  async getCertificate(id: number): Promise<Certificate | undefined> {
    const [cert] = await db.select().from(certificates).where(eq(certificates.id, id));
    return cert;
  }

  async getCertificateByNumber(number: string): Promise<Certificate | undefined> {
    const [cert] = await db.select().from(certificates).where(eq(certificates.certificateNumber, number));
    return cert;
  }

  async createCertificate(cert: CreateCertificateRequest & { verifyUrl: string, qrCodeUrl?: string }): Promise<Certificate> {
    const [newCert] = await db.insert(certificates).values(cert).returning();
    return newCert;
  }

  async deleteCertificate(id: number): Promise<void> {
    await db.delete(certificates).where(eq(certificates.id, id));
  }

  // Gallery Albums
  async getGalleryAlbums(): Promise<GalleryAlbum[]> {
    return await db.select().from(galleryAlbums).orderBy(desc(galleryAlbums.createdAt));
  }

  async createGalleryAlbum(album: CreateGalleryAlbumRequest): Promise<GalleryAlbum> {
    const [newAlbum] = await db.insert(galleryAlbums).values(album).returning();
    return newAlbum;
  }

  async deleteGalleryAlbum(id: number): Promise<void> {
    await db.delete(galleryAlbums).where(eq(galleryAlbums.id, id));
  }

  // Contact
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(message: CreateContactMessageRequest): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }
}

export const storage = new DatabaseStorage();
