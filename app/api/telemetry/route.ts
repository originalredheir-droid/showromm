import { NextResponse } from 'next/server';

const MAX_BODY_BYTES = 1024;
const DIGEST_PATTERN = /^[A-Za-z0-9._-]{1,128}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  let originHost: string;
  try {
    originHost = origin ? new URL(origin).host : '';
  } catch {
    originHost = '';
  }
  if (!originHost || originHost !== request.headers.get('host')) {
    return NextResponse.json({ error: 'Same-origin telemetry requests only.' }, { status: 403 });
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Telemetry event is too large.' }, { status: 413 });
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return NextResponse.json({ error: 'Telemetry event body is required.' }, { status: 400 });
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      return NextResponse.json({ error: 'Telemetry event is too large.' }, { status: 413 });
    }
    chunks.push(value);
  }

  const bodyBytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(bodyBytes));
  } catch {
    return NextResponse.json({ error: 'Telemetry event must be valid JSON.' }, { status: 400 });
  }

  if (!isRecord(payload)
    || payload.source !== 'react-error-boundary'
    || Object.keys(payload).some((key) => key !== 'source' && key !== 'digest')
    || ('digest' in payload && typeof payload.digest !== 'string')
    || ('digest' in payload && !DIGEST_PATTERN.test(String(payload.digest)))) {
    return NextResponse.json({ error: 'Telemetry event is invalid.' }, { status: 400 });
  }

  const digest = typeof payload.digest === 'string' ? payload.digest : undefined;
  console.error(JSON.stringify({
    event: 'client_render_error',
    source: 'react-error-boundary',
    ...(typeof digest === 'string' ? { digest } : {}),
    occurredAt: new Date().toISOString(),
  }));
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
