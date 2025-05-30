import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import Xvfb from 'xvfb'

console.log('Testing Xvfb + Puppeteer...')

puppeteer.use(StealthPlugin())

async function testXvfbPuppeteer() {
  let xvfb = null
  let browser = null
  
  try {
    console.log('Starting Xvfb...')
    xvfb = new Xvfb({
      silent: true,
      xvfb_args: ["-screen", "0", '1920x1080x24', "-ac"]
    })
    
    xvfb.start((err) => {
      if (err) console.error('Xvfb error:', err)
    })
    
    console.log('Xvfb started, display:', xvfb._display)
    
    // Wait a moment for Xvfb to fully start
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Launching browser with Xvfb...')
    browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        `--display=${xvfb._display}`,
        "--start-maximized"
      ]
    })
    
    console.log('Browser launched successfully with Xvfb')
    
    const page = await browser.newPage()
    console.log('Page created')
    
    await page.goto('https://example.com')
    console.log('Page navigation completed')
    
    await browser.close()
    console.log('Browser closed')
    
    xvfb.stop((err) => {
      if (err) console.error('Xvfb stop error:', err)
    })
    
    console.log('Test completed successfully')
  } catch (error) {
    console.error('Error:', error)
    
    if (browser) {
      try {
        await browser.close()
      } catch (e) {
        console.error('Error closing browser:', e)
      }
    }
    
    if (xvfb) {
      xvfb.stop((err) => {
        if (err) console.error('Error stopping Xvfb:', err)
      })
    }
    
    process.exit(1)
  }
}

testXvfbPuppeteer() 