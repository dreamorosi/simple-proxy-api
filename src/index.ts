import httpProxy from 'http-proxy';

const port = 3000;
const remoteUrl = process.env.REMOTE_URL;
if (remoteUrl === undefined || remoteUrl === '') {
	throw new Error('REMOTE_URL env variable is required');
}

httpProxy
	.createProxyServer({
		target: remoteUrl,
		changeOrigin: true,
		secure: false,
	})
	.listen(port);

console.log(`Server is running on port ${port}`);
