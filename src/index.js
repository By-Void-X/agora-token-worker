import { RtcTokenBuilder, RtcRole } from 'agora-token';

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const channelName = url.searchParams.get('channel');

    if (!channelName) {
      return new Response(JSON.stringify({ error: 'channel wajib diisi' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const currentTs = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTs + 3600;

    const token = RtcTokenBuilder.buildTokenWithUid(
      env.AGORA_APP_ID,
      env.AGORA_APP_CERTIFICATE,
      channelName,
      0,
      RtcRole.PUBLISHER,
      3600,
      privilegeExpiredTs
    );

    return new Response(JSON.stringify({ token }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  },
};
