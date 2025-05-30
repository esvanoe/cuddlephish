import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

console.log('Testing pure headless Puppeteer (no Xvfb)...')

puppeteer.use(StealthPlugin())

async function testHeadlessOnly() {
  let browser = null
  
  try {
    console.log('Launching browser in pure headless mode...')
    browser = await puppeteer.launch({
      headless: true,  // Pure headless, no display needed
      ignoreHTTPSErrors: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox", 
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-extensions",
        "--no-first-run",
        "--disable-default-apps",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding"
      ]
    })
    
    console.log('Browser launched successfully')
    
    const page = await browser.newPage()
    console.log('Page created')
    
    await page.goto('https://example.com', {waitUntil: 'domcontentloaded'})
    console.log('Page navigation completed')
    
    const title = await page.title()
    console.log('Page title:', title)
    
    await browser.close()
    console.log('Browser closed successfully')
    
    console.log('Pure headless test completed successfully!')
  } catch (error) {
    console.error('Error:', error)
    
    if (browser) {
      try {
        await browser.close()
      } catch (e) {
        console.error('Error closing browser:', e)
      }
    }
    
    process.exit(1)
  }
}

testHeadlessOnly() 