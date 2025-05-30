import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

console.log('Testing Puppeteer...')

puppeteer.use(StealthPlugin())

async function testPuppeteer() {
  try {
    console.log('Launching browser...')
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    })
    
    console.log('Browser launched successfully')
    
    const page = await browser.newPage()
    console.log('Page created')
    
    await page.goto('https://example.com')
    console.log('Page navigation completed')
    
    await browser.close()
    console.log('Test completed successfully')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

testPuppeteer() 