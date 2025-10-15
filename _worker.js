// Cloudflare Pages Advanced Mode Worker
// This worker wraps the Next.js application and provides AI binding access

export default {
  async fetch(request, env, ctx) {
    try {
      // Import the Next.js build output
      const nextOnPagesHandler = await import('./.next-deploy/_worker.js');

      // Clone the request and attach environment to it
      // This makes env.AI accessible in route handlers via request.env
      const modifiedRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: request.redirect,
        signal: request.signal,
      });

      // Attach environment bindings
      modifiedRequest.env = env;

      // Pass to Next.js handler with environment
      return await nextOnPagesHandler.default.fetch(modifiedRequest, env, ctx);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
