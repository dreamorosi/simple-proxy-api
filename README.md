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
finch run -d -e REMOTE_URL=https://your-api.com/api -p 3000:3000 simple-api-proxy
``` 

Then, you can make requests to `http://localhost:3000` and they will be forwarded to `https://your-api.com/api`.

You can also check the health of the service by making a request to `http://localhost:3000/health`, this will return a response like:

```json
{
  "status": "ok",
  "url": "https://your-api.com/api"
}
```