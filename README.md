# Simple Proxy API

This is a simple proxy API that forwards requests to a target URL and returns the response. It's useful for developing frontend applications that need to make requests to a backend API that doesn't support CORS.

## Development

```sh
npm ci
REMOTE_URL=https://your-api.com/api npm run dev
```

## Build

```sh
npm run build
```

or 

```sh
finch build -t simple-proxy-api .
```

## Run

```sh
finch run -d -e REMOTE_URL=https://your-api.com/ -p 3000:3000 simple-api-proxy
``` 

Then, you can make requests to `http://localhost:3000` and they will be forwarded to `https://your-api.com`.

You can also check the health of the service by making a request to `http://localhost:3000/health`, this will return a response like:

```json
{
  "status": "ok",
  "remoteUrl": "https://your-api.com/api",
  "allowedOrigin": "http://localhost:5713"
}
```

Full configuration options:
- `REMOTE_URL`: The target URL to forward requests to.
- `ORIGIN`: The allowed origin for CORS requests. Defaults to `http://localhost:5173`.