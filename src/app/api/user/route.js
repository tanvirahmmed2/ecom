import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { hashPassword, verifyToken } from '@/lib/auth';
import { sendEmail } from '@/lib/mailer';
import crypto from 'crypto';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ecom_token')?.value;

    if (!token) {
      return Response.json({ user: null }, { status: 200 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.user_id) {
      return Response.json({ user: null }, { status: 200 });
    }

    const result = await query(
      'SELECT user_id, name, email, phone, role, is_active, is_varified, is_banned, created_at, updated_at FROM users WHERE user_id = $1',
      [decoded.user_id]
    );

    if (result.rows.length === 0) {
      return Response.json({ user: null }, { status: 200 });
    }

    const user = result.rows[0];
    if (user.is_banned) {
      return Response.json({ error: 'Account is banned' }, { status: 403 });
    }
    if (!user.is_active) {
      return Response.json({ error: 'Account is deactivated' }, { status: 403 });
    }

    return Response.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const checkUser = await query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return Response.json({ error: 'Email is already registered' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Insert user (raw PostgreSQL query)
    const result = await query(
      `INSERT INTO users (name, email, phone, password, varification_token)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, name, email`,
      [name, email, phone || null, hashedPassword, verificationToken]
    );

    const newUser = result.rows[0];

    // Send verification email via Brevo
    const verificationLink = `${NEXT_PUBLIC_API_URL}/verify-account?token=${verificationToken}`;
    const mailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e293b; text-align: center;">Welcome to Ecom!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please verify your email address to activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Account</a>
        </div>
        <p>If the button doesn't work, copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #64748b;">${verificationLink}</p>
        <p style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8;">
          This link will expire in 24 hours. If you did not register for an account, please ignore this email.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: 'Verify your Ecom Account',
        htmlContent: mailContent,
      });
    } catch (mailError) {
      console.error('Failed to send verification email:', mailError);
      // We still registered the user, but inform them about verification issue or return success
    }

    return Response.json(
      { message: 'Registration successful! Please check your email to verify your account.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
