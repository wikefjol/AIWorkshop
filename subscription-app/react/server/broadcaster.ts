import type { Response } from 'express'

const clients = new Set<Response>()

export function addClient(res: Response, req: { on: (event: string, listener: () => void) => void }): void {
  clients.add(res)
  req.on('close', () => {
    clients.delete(res)
  })
}

export function broadcast(event: string, data: string): void {
  const message = `event: ${event}\ndata: ${data}\n\n`
  for (const client of clients) {
    try {
      client.write(message)
    } catch {
      clients.delete(client)
    }
  }
}
