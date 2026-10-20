const port = Number(Bun.env.API_PORT ?? 3000)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('API_PORT must be an integer between 1 and 65535.')
}

const server = Bun.serve({
  hostname: Bun.env.API_HOST ?? '127.0.0.1',
  port,
  fetch(request) {
    const { pathname } = new URL(request.url)

    if (pathname === '/api/health' && request.method === 'GET') {
      return Response.json({ status: 'ok', service: 'caliip-api' })
    }

    return Response.json({ error: 'Not found' }, { status: 404 })
  },
})

console.log(`Caliip API listening on ${server.url}`)
