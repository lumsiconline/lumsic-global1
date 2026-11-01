/**
 * LUMSIC Global Astrology Platform - Cloudflare Worker Backend
 * Entry point for Cloudflare Workers / Pages Functions deployment
 */

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  JWT_SECRET: string;
  APP_URL: string;
}

export default {
  async fetch(request: Request, env: Env, ctx?: any): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers for global frontend access
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          service: 'lumsic-api-worker',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Routing matches the Express fullstack API
    return new Response(
      JSON.stringify({
        message: 'Lumsic API Worker Active',
        endpoint: url.pathname,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  },
};
