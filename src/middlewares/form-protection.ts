import type { Core } from '@strapi/strapi';

interface RateLimitRecord {
  count: number;
  firstRequest: number;
}

const ipRequestMap = new Map<string, RateLimitRecord>();

// Clean up stale IP records every 10 minutes (unref'd to allow clean process exit)
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    if (now - record.firstRequest > 10 * 60 * 1000) {
      ipRequestMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);
if (cleanupTimer.unref) cleanupTimer.unref();

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<any>) => {
    const isPublicFormSubmission =
      ctx.method === 'POST' &&
      (ctx.path.startsWith('/api/appointments') ||
        ctx.path.startsWith('/api/contact-requests') ||
        ctx.path.startsWith('/api/arrange-a-call-backs') ||
        ctx.path.startsWith('/api/book-appointments') ||
        ctx.path.startsWith('/api/emergency-requests') ||
        ctx.path.startsWith('/api/quote-requests'));

    if (!isPublicFormSubmission) {
      return next();
    }

    // Determine client IP safely: prefer koa's ctx.ip (populated via proxy settings if configured)
    // Avoid blindly trusting user-controlled arbitrary headers
    const clientIp =
      ctx.ip ||
      ctx.request.ip ||
      (strapi.config.get('server.proxy') ? ctx.headers['x-forwarded-for']?.split(',')[0]?.trim() : null) ||
      ctx.socket?.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5 minute window
    const maxRequests = 20; // 20 requests per 5 minutes per IP

    const record = ipRequestMap.get(clientIp);
    if (!record) {
      ipRequestMap.set(clientIp, { count: 1, firstRequest: now });
    } else {
      if (now - record.firstRequest < windowMs) {
        if (record.count >= maxRequests) {
          console.warn(`[Form Protection] Rate limit exceeded for IP ${clientIp} on ${ctx.path}`);
          ctx.status = 429;
          ctx.body = {
            error: {
              status: 429,
              name: 'RateLimitError',
              message: 'Too many requests. Please wait a few moments before trying again.',
            },
          };
          return;
        }
        record.count++;
      } else {
        // Reset window
        record.count = 1;
        record.firstRequest = now;
      }
    }

    // Bot / Honeypot inspection
    const bodyData = ctx.request.body?.data || ctx.request.body;
    if (bodyData && typeof bodyData === 'object') {
      const honeypotFields = ['_hp', 'hp_check', 'website_hp', 'bot_trap'];
      for (const field of honeypotFields) {
        if (bodyData[field] && String(bodyData[field]).trim().length > 0) {
          console.warn(`[Form Protection] Bot detected via honeypot field "${field}" from IP ${clientIp}`);
          // Silently succeed so bot does not retry
          ctx.status = 200;
          ctx.body = { data: { id: 0, attributes: {} }, meta: { message: 'Submission received' } };
          return;
        }
      }
    }

    await next();
  };
};
