import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import MemoryStore from "memorystore";

const scryptAsync = promisify(scrypt);
const SessionStore = MemoryStore(session);

// Helper for hashing (since we don't have a robust auth library setup)
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePassword(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Trust proxy for production (Fly.io, etc.)
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    app.set("trust proxy", 1);
  }

  // --- Auth Setup ---
  app.use(
    session({
      store: new SessionStore({ checkPeriod: 86400000 }),
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) return done(null, false, { message: "Invalid credentials" });
        
        const isValid = await comparePassword(password, user.password);
        if (!isValid) return done(null, false, { message: "Invalid credentials" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  };

  // --- API Routes ---

  // Auth
  app.post(api.auth.login.path, passport.authenticate("local"), (req, res) => {
    res.json({ message: "Logged in successfully" });
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      res.json({ id: user.id, username: user.username });
    } else {
      res.json(null);
    }
  });

  // Certificates
  app.get(api.certificates.list.path, async (req, res) => {
    const certs = await storage.getCertificates();
    res.json(certs);
  });

  app.get(api.certificates.get.path, async (req, res) => {
    const cert = await storage.getCertificate(Number(req.params.id));
    if (!cert) return res.status(404).json({ message: "Certificate not found" });
    res.json(cert);
  });

  app.get(api.certificates.verify.path, async (req, res) => {
    const cert = await storage.getCertificateByNumber(req.params.number);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });
    res.json(cert);
  });

  app.post(api.certificates.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.certificates.create.input.parse(req.body);
      
      // Generate verify URL
      const host = req.get("host") || "localhost:5000";
      const baseUrl = `${req.protocol}://${host}`;
      const verifyUrl = `${baseUrl}/verify?certificate=${input.certificateNumber}`;
      
      const cert = await storage.createCertificate({
        ...input,
        verifyUrl,
        qrCodeUrl: verifyUrl
      });
      
      res.status(201).json(cert);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.certificates.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteCertificate(Number(req.params.id));
    res.status(204).send();
  });

  // Gallery Albums
  app.get(api.gallery.list.path, async (req, res) => {
    const albums = await storage.getGalleryAlbums();
    res.json(albums);
  });

  app.post(api.gallery.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.gallery.create.input.parse(req.body);
      const album = await storage.createGalleryAlbum(input);
      res.status(201).json(album);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.gallery.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteGalleryAlbum(Number(req.params.id));
    res.status(204).send();
  });

  // Contact
  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const message = await storage.createContactMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.contact.list.path, isAuthenticated, async (req, res) => {
    const messages = await storage.getContactMessages();
    res.json(messages);
  });

  app.delete(api.contact.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteContactMessage(Number(req.params.id));
    res.status(204).send();
  });

  // Health
  app.get(api.health.check.path, (req, res) => {
    res.json({ status: "ok" });
  });

  // Seed Admin User
  await seedAdmin();

  return httpServer;
}

async function seedAdmin() {
  const adminUsername = "714752420017";
  
  // Delete old admin if exists
  const oldAdmin = await storage.getUserByUsername("admin");
  if (oldAdmin) {
    await storage.deleteUser(oldAdmin.id);
    console.log("Old admin user deleted");
  }
  
  // Create new admin if doesn't exist
  const existingAdmin = await storage.getUserByUsername(adminUsername);
  if (!existingAdmin) {
    const password = await hashPassword("Ba@606368");
    await storage.createUser({ username: adminUsername, password });
    console.log("Admin user created");
  }
}
