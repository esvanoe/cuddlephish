import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import Xvfb from 'xvfb'

console.log('Testing Puppeteer 13.7.0 + original Xvfb configuration...')

puppeteer.use(StealthPlugin())

async function testOldPuppeteer() {
  let xvfb = null
  let browser = null
  
  try {
    console.log('Starting Xvfb with original configuration...')
    xvfb = new Xvfb({
      silent: true,
      xvfb_args: ["-screen", "0", '1920x1080x24', "-ac"]
    })
    
    xvfb.start((err) => {
      if (err) console.error('Xvfb error:', err)
    })
    
    console.log('Xvfb started, display:', xvfb._display)
    
    // Wait for Xvfb to start
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Launching browser with Puppeteer 13.7.0...')
    
    // Using similar configuration to your original index.js
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
        `--display=${xvfb._display}`,
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--memory-pressure-off",
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
    
    xvfb.stop((err) => {
      if (err) console.error('Xvfb stop error:', err)
    })
    
    console.log('Puppeteer 13.7.0 test completed successfully!')
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

testOldPuppeteer() 