import { type HttpBindings, serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

function isError(value: unknown): asserts value is Error {
	if (value instanceof Error) {
		throw value;
	}
}

function assertIsString(value: unknown): asserts value is string {
	if (typeof value !== 'string') {
		throw new Error('remote url is not a string');
	}
}

const origin = process.env.ORIGIN || 'http://localhost:5173';

const app = new Hono<{ Bindings: HttpBindings }>();
app.use(logger());
app.use(
	'*',
	cors({
		origin,
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
		allowHeaders: [
			'Authorization',
			'cookie',
			'Cookie',
			'Content-Type',
			'Accept',
			'Origin',
			'User-Agent',
			'Referer',
			'Sec-Fetch-Dest',
			'Sec-Fetch-Mode',
			'Sec-Fetch-Site',
			'X-Requested-With',
		],
		maxAge: 600,
		credentials: true,
		exposeHeaders: [
			'Set-Cookie',
			'Content-Length',
			'Content-Range',
			'Content-Disposition',
			'Content-Type',
		],
	})
);

const remoteUrl = process.env.REMOTE_URL;
assertIsString(remoteUrl);

app.all('/health', (c) => {
	return c.json({ status: 'ok', remoteUrl: remoteUrl, allowedOrigin: origin });
});

app.all('*', async (c) => {
	const headers = new Headers(c.env.incoming.headers as Record<string, string>);
	const method = c.env.incoming.method;
	const url = c.env.incoming.url;
	const bodyText = await c.req.text();

	try {
		const res = await fetch(
			`${remoteUrl.endsWith('/') ? remoteUrl.slice(0, -1) : remoteUrl}${url}`,
			{
				method,
				headers,
				body: method === 'GET' || method === 'HEAD' ? null : bodyText,
			}
		);

		const remoteBody = await res.text();
		const remoteHeaders = Object.fromEntries(res.headers.entries());

		return c.text(remoteBody, {
			status: res.status,
			headers: remoteHeaders,
		});
	} catch (error) {
		isError(error);
		return c.json({ error: error.message }, { status: 500 });
	}
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
