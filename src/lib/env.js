/**
 * Get Cloudflare environment bindings
 * This works when deployed to Cloudflare Pages or running with wrangler dev
 */
export function getEnv() {
    try {
        // Try to dynamically import Cloudflare context if available
        if (typeof process !== 'undefined' && process.env.CF_PAGES) {
            // Running on Cloudflare Pages
            const { getRequestContext } = require('@cloudflare/next-on-pages');
            const context = getRequestContext();
            return context.env;
        }
        // Fallback for local development
        return null;
    } catch (error) {
        // Fallback for local development without wrangler
        console.warn('Cloudflare context not available. Running in local mode.');
        return null;
    }
}

/**
 * Get the D1 database instance
 */
export function getDatabase() {
    const env = getEnv();
    return env?.DB || null;
}
