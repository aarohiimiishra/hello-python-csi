import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const BENNETT_EMAIL_REGEX = /^[a-z0-9._%+-]+@bennett\.edu\.in$/i;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, collegeEmail, phone, countryCode = '+91' } = req.body || {};
  const cleanName = String(fullName || '').trim();
  const cleanEmail = String(collegeEmail || '').trim().toLowerCase();
  const cleanDigits = String(phone || '').replace(/\D/g, '');

  if (cleanName.length < 2) {
    return res.status(400).json({ error: 'Please enter your full name.' });
  }
  if (!BENNETT_EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({
      error: 'A valid Bennett University email (@bennett.edu.in) is required.'
    });
  }
  if (!INDIAN_MOBILE_REGEX.test(cleanDigits)) {
    return res.status(400).json({
      error: 'Please enter a valid 10-digit Indian mobile number.'
    });
  }

  const formattedPhone = `${countryCode}${cleanDigits}`;

  const { data, error } = await supabaseAdmin
    .from('registrations')
    .insert([
      {
        full_name: cleanName,
        college_email: cleanEmail,
        phone: formattedPhone
      }
    ])
    .select('id, full_name, college_email, phone, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'This Bennett University email is already registered for Hello Python.'
      });
    }
    return res.status(500).json({ error: 'Database error while saving registration.' });
  }

  return res.status(201).json({ registration: data });
}
