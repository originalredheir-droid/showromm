import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const MAX_FIELD_LENGTH = 10000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readText(value: unknown, field: string, required = false, maxLength = MAX_FIELD_LENGTH): string {
  if (typeof value !== 'string' || value.length > maxLength) {
    throw new Error(`${field} is invalid.`);
  }
  const text = value.trim();
  if (required && !text) throw new Error(`${field} is required.`);
  return text;
}

function readDate(value: unknown, field: string, optional = false): string | null {
  if (optional && (value === '' || value === null)) return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${field} must be a valid date.`);
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`${field} must be a valid date.`);
  }
  return value;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 2_000_000) {
    return NextResponse.json({ error: 'Proposal request is too large.' }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (!isRecord(payload) || !Array.isArray(payload.items) || payload.items.length === 0 || payload.items.length > 100) {
    return NextResponse.json({ error: 'Select between 1 and 100 image offers.' }, { status: 400 });
  }

  try {
    const items = payload.items.map((entry) => {
      if (!isRecord(entry)) throw new Error('An offer in the proposal is invalid.');
      const price = entry.estimatedPriceINR;
      const hours = entry.devHours;
      if (price !== null && (typeof price !== 'number' || !Number.isFinite(price) || price < 0)) {
        throw new Error('An offer has an invalid price.');
      }
      if (hours !== null && (typeof hours !== 'number' || !Number.isFinite(hours) || hours < 0)) {
        throw new Error('An offer has an invalid development-time estimate.');
      }
      if (typeof entry.image !== 'string' || entry.image.length > 2048 || !/^https:\/\//i.test(entry.image)) {
        throw new Error('An offer has an invalid image URL.');
      }
      return {
        catalogTitle: readText(entry.catalogTitle, 'Catalog title', true),
        title: readText(entry.title, 'Offer title'),
        description: readText(entry.description, 'Offer description'),
        image: entry.image,
        estimatedPriceINR: price,
        devHours: hours,
      };
    });

    const normalized = {
      proposal_date: readDate(payload.proposalDate, 'Proposal date'),
      valid_until: readDate(payload.validUntil, 'Validity date', true),
      client_name: readText(payload.clientName, 'Client name', true, 200),
      client_company: readText(payload.clientCompany, 'Client company', false, 200),
      client_email: readText(payload.clientEmail, 'Client email', false, 254),
      client_phone: readText(payload.clientPhone, 'Client phone', false, 50),
      project_name: readText(payload.projectName, 'Project name', true, 200),
      project_brief: readText(payload.projectBrief, 'Project brief'),
      notes: readText(payload.notes, 'Notes and assumptions'),
      items,
    };

    if (!normalized.proposal_date) {
      return NextResponse.json({ error: 'Proposal date is required.' }, { status: 400 });
    }
    if (normalized.valid_until && normalized.valid_until < normalized.proposal_date) {
      return NextResponse.json({ error: 'Validity date must be on or after the proposal date.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError && authError.name !== 'AuthSessionMissingError') throw authError;
    if (!user) {
      return NextResponse.json({ error: 'Sign in as an admin to save a proposal.' }, { status: 401 });
    }

    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (adminError) throw adminError;
    if (!admin) {
      return NextResponse.json({ error: 'Administrator access is required to save proposals.' }, { status: 403 });
    }

    const { data, error } = await supabase.rpc('create_proposal', { p_payload: normalized });
    if (error) throw error;
    const proposal = data[0];
    if (!proposal) throw new Error('Proposal was not returned after saving.');

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    if (error instanceof Error && /invalid|required|valid date|select between/i.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Failed to save proposal:', error);
    return NextResponse.json({ error: 'Could not save this proposal. Please try again.' }, { status: 500 });
  }
}
