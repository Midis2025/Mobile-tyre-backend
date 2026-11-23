import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Resend } from 'resend';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string | string[];
  workflow?: string;
  category?: 'admin' | 'customer';
  recordId?: string | number;
  idempotencyKey?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  skipped?: boolean;
}

export interface ResendConfigValidation {
  isConfigured: boolean;
  hasApiKey: boolean;
  adminEmail: string | null;
  emailFrom: string | null;
  errors: string[];
}

/**
 * Robust environment variable loader.
 * Guarantees .env variables are loaded into process.env even if:
 * 1. The Strapi process was started from a parent or different directory.
 * 2. The Strapi process was started before .env was created or modified.
 * 3. Strapi's internal loader did not populate process.env.
 */
export const ensureEnvLoaded = (): void => {
  // If all critical variables are already populated and non-empty, nothing to do
  if (
    process.env.RESEND_API_KEY?.trim() &&
    process.env.ADMIN_EMAIL?.trim() &&
    process.env.EMAIL_FROM?.trim()
  ) {
    return;
  }

  const candidatePaths = [
    path.resolve(__dirname, '../../.env'), // From src/services to Mobile-tyre-backend/.env
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'Mobile-tyre-backend/.env'),
    path.resolve('C:/Users/pc/Desktop/mtc-backed/Mobile-tyre-backend/.env'),
  ];

  for (const envFile of candidatePaths) {
    if (fs.existsSync(envFile)) {
      dotenv.config({ path: envFile });

      // Direct file parse to ensure any empty/unparsed values are overwritten
      try {
        const raw = fs.readFileSync(envFile, 'utf8');
        for (const line of raw.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            let val = match[2].trim();
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1);
            }
            if (val && (!process.env[key] || process.env[key]!.trim().length === 0)) {
              process.env[key] = val;
            }
          }
        }
      } catch (err) {
        // ignore read error
      }

      if (process.env.RESEND_API_KEY?.trim() && process.env.ADMIN_EMAIL?.trim()) {
        break;
      }
    }
  }
};

// Initial load attempt on module import
ensureEnvLoaded();

// In-memory set for deduplicating dispatches within 60 seconds
const recentDispatches = new Set<string>();

/**
 * Validates email address format
 */
export const isValidEmail = (email?: string | null): boolean => {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
};

/**
 * HTML Escapes user-submitted string values to prevent HTML injection in email templates
 */
export const escapeHtml = (unsafe?: any): string => {
  if (unsafe === undefined || unsafe === null) return '';
  const str = String(unsafe);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Safely validates the current Resend environment configuration
 * without exposing the secret API key.
 */
export const validateResendConfig = (): ResendConfigValidation => {
  ensureEnvLoaded();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const hasApiKey = Boolean(apiKey && apiKey.length > 0);
  const admin = process.env.ADMIN_EMAIL?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  const errors: string[] = [];

  if (!hasApiKey) {
    errors.push('RESEND_API_KEY is not configured in backend environment variables (.env)');
  }
  if (!admin) {
    errors.push('ADMIN_EMAIL is not configured in backend environment variables (.env)');
  } else if (!isValidEmail(admin)) {
    errors.push(`ADMIN_EMAIL "${admin}" is not a valid email address`);
  }
  if (!from) {
    errors.push('EMAIL_FROM is not configured in backend environment variables (.env)');
  }

  return {
    isConfigured: errors.length === 0,
    hasApiKey,
    adminEmail: admin || null,
    emailFrom: from || null,
    errors,
  };
};

/**
 * Get configured Admin email address.
 * Strictly reads ADMIN_EMAIL from backend environment; does NOT fall back to any hardcoded email.
 */
export const getAdminEmail = (): string => {
  ensureEnvLoaded();
  const admin = process.env.ADMIN_EMAIL?.trim();
  if (!admin || !isValidEmail(admin)) {
    throw new Error(
      `[Resend Service Error] ADMIN_EMAIL is not configured or invalid in backend environment (current: "${admin || ''}"). Please configure ADMIN_EMAIL in Mobile-tyre-backend/.env.`
    );
  }
  return admin;
};

/**
 * Get configured sender (From) address.
 * Strictly reads EMAIL_FROM from backend environment; does NOT fall back to any hardcoded sender.
 */
export const getSenderEmail = (): string => {
  ensureEnvLoaded();
  const sender = process.env.EMAIL_FROM?.trim();
  if (!sender) {
    throw new Error(
      '[Resend Service Error] EMAIL_FROM is not configured in backend environment. Please configure EMAIL_FROM in Mobile-tyre-backend/.env.'
    );
  }
  return sender;
};

let resendClient: Resend | null = null;
let cachedApiKey: string | null = null;

const getResendClient = (): Resend | null => {
  ensureEnvLoaded();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  if (!resendClient || cachedApiKey !== apiKey) {
    resendClient = new Resend(apiKey);
    cachedApiKey = apiKey;
  }
  return resendClient;
};

/**
 * Centralized email sending function powered by Resend
 */
export const sendEmail = async (options: SendEmailOptions): Promise<SendEmailResult> => {
  const {
    to,
    subject,
    html,
    replyTo,
    workflow = 'general',
    category = 'admin',
    recordId,
    idempotencyKey,
  } = options;

  const timestamp = new Date().toISOString();

  // Deduplication check
  const dedupKey = idempotencyKey || (recordId ? `${workflow}:${category}:${recordId}` : null);
  if (dedupKey) {
    if (recentDispatches.has(dedupKey)) {
      console.warn(`[Resend Service] [${timestamp}] Duplicate email dispatch prevented for key: ${dedupKey}`);
      return { success: true, skipped: true };
    }
    recentDispatches.add(dedupKey);
    // Keep in set for 60 seconds (unref'd to allow clean process termination)
    const timer = setTimeout(() => {
      recentDispatches.delete(dedupKey);
    }, 60000);
    if (timer.unref) timer.unref();
  }

  // Recipient validation
  const recipients = Array.isArray(to) ? to : [to];
  const validRecipients = recipients.map(r => r.trim()).filter(isValidEmail);

  if (validRecipients.length === 0) {
    const errorMsg = `No valid recipient address provided for ${workflow} (${category}). Provided: ${JSON.stringify(to)}`;
    console.warn(`[Resend Service] [${timestamp}] Skipped: ${errorMsg}`);
    return { success: false, error: errorMsg, skipped: true };
  }

  // Check Resend client
  const client = getResendClient();
  if (!client) {
    const errorMsg = `RESEND_API_KEY is not configured in backend environment variables (.env). Cannot send email for ${workflow} ("${subject}").`;
    console.error(`[Resend Service Error] [${timestamp}] ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
      skipped: false,
    };
  }

  let from: string;
  try {
    from = getSenderEmail();
  } catch (err: any) {
    console.error(`[Resend Service Error] [${timestamp}] ${err.message}`);
    return {
      success: false,
      error: err.message,
      skipped: false,
    };
  }

  // Prepare headers including idempotency reference if present
  const headers: Record<string, string> = {};
  if (dedupKey) {
    headers['X-Entity-Ref-ID'] = dedupKey;
  }

  try {
    const payload: any = {
      from,
      to: validRecipients,
      subject,
      html,
      headers,
    };

    if (replyTo && (typeof replyTo === 'string' ? isValidEmail(replyTo) : replyTo.length > 0)) {
      payload.reply_to = replyTo;
    }

    const response = await client.emails.send(payload);

    if (response.error) {
      console.error(
        `[Resend Error] [${timestamp}] Workflow=${workflow} Category=${category} To=${validRecipients.join(',')} Error:`,
        response.error
      );
      return {
        success: false,
        error: response.error.message || JSON.stringify(response.error),
      };
    }

    const messageId = response.data?.id;
    console.log(
      `[Resend Success] [${timestamp}] Workflow=${workflow} Category=${category} ID=${messageId} To=${validRecipients.join(',')} Subject="${subject}"`
    );

    return {
      success: true,
      messageId,
    };
  } catch (err: any) {
    console.error(
      `[Resend Exception] [${timestamp}] Workflow=${workflow} Category=${category} Error:`,
      err?.message || err
    );
    return {
      success: false,
      error: err?.message || 'Unknown Resend error',
    };
  }
};

export default {
  sendEmail,
  isValidEmail,
  escapeHtml,
  getAdminEmail,
  getSenderEmail,
  validateResendConfig,
  ensureEnvLoaded,
};
