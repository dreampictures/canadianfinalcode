import { z } from 'zod';
import { insertCertificateSchema, insertContactMessageSchema, insertGalleryAlbumSchema, certificates, galleryAlbums, contactMessages } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.object({ message: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.object({ id: z.number(), username: z.string() }).nullable(),
      },
    },
  },
  certificates: {
    list: {
      method: 'GET' as const,
      path: '/api/certificates',
      responses: {
        200: z.array(z.custom<typeof certificates.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/certificates/:id',
      responses: {
        200: z.custom<typeof certificates.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    verify: {
      method: 'GET' as const,
      path: '/api/certificates/verify/:number',
      responses: {
        200: z.custom<typeof certificates.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/certificates',
      input: insertCertificateSchema,
      responses: {
        201: z.custom<typeof certificates.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/certificates/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  gallery: {
    list: {
      method: 'GET' as const,
      path: '/api/gallery',
      responses: {
        200: z.array(z.custom<typeof galleryAlbums.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/gallery',
      input: insertGalleryAlbumSchema,
      responses: {
        201: z.custom<typeof galleryAlbums.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/gallery/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  contact: {
    create: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertContactMessageSchema,
      responses: {
        201: z.custom<typeof contactMessages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/contact',
      responses: {
        200: z.array(z.custom<typeof contactMessages.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/contact/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  health: {
    check: {
      method: 'GET' as const,
      path: '/api/health',
      responses: {
        200: z.object({ status: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
