import type { VercelRequest, VercelResponse } from '@vercel/node';

const BENNETT_EMAIL_REGEX = /^[a-z0-9._%+-]+@bennett\.edu\.in$/i;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({
      error: 'Server configuration error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Vercel.'
    });
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

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`
    };

    const sbRes = await fetch(`${supabaseUrl}/rest/v1/registrations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        full_name: cleanName,
        college_email: cleanEmail,
        phone: formattedPhone
      })
    });

    const data = await sbRes.json().catch(() => null);

    if (!sbRes.ok) {
      if (sbRes.status === 409 || data?.code === '23505') {
        return res.status(409).json({
          error: 'This Bennett University email is already registered for Hello Python.'
        });
      }
      return res.status(sbRes.status).json({
        error: data?.message || data?.hint || 'Database error while saving registration.'
      });
    }

    return res.status(201).json({
      registration: {
        full_name: cleanName,
        college_email: cleanEmail,
        phone: formattedPhone
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err?.message || 'Unexpected server error while connecting to Supabase.'
    });
  }
}
