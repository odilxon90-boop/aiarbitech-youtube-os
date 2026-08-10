import compress from '@fastify/compress';
import type { FastifyInstance } from 'fastify';

export async function registerCompressionMiddleware(app: FastifyInstance): Promise<void> {
  await app.register(compress, {
    encodings: ['br', 'gzip', 'deflate'],
    threshold: 1024,
  });
}
