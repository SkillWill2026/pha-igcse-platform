import fetch from 'node-fetch'

const key = process.argv[2]
if (!key) { console.log('Usage: node test-mistral.mjs YOUR_KEY'); process.exit(1) }

const res = await fetch('https://api.mistral.ai/v1/models', {
  headers: { 'Authorization': `Bearer ${key}` }
})

console.log('Status:', res.status)
const data = await res.json()
console.log('Response:', JSON.stringify(data).slice(0, 200))
