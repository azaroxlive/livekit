// /api/token/route.js
import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { room, identity } = await req.json();

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: 'API keys missing' }, { status: 500 });
    }

    const token = new AccessToken(apiKey, apiSecret, { identity });
    token.addGrant({ roomJoin: true, room });

    const jwt = await token.toJwt();

    return NextResponse.json({ token: jwt });
  } catch (err) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
}