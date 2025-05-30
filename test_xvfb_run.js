import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

console.log('Testing with system xvfb-run (no Node.js Xvfb package)...')

puppeteer.use(StealthPlugin())

async function testWithSystemXvfb() {
  let browser = null
  
  try {
    console.log('Launching browser (assuming xvfb-run is handling display)...')
    
    // Launch without Xvfb package - expecting xvfb-run to provide display
    browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ["--enable-automation"],
      defaultViewport: null,
      args: [
        "--ignore-certificate-errors",
        "--disable-blink-features=AutomationControlled",
        "--start-maximized",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--window-size=1920,1080"
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
    console.log('Browser closed')
    
    console.log('System xvfb-run test completed successfully!')
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

testWithSystemXvfb() 