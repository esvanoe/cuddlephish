import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import Xvfb from 'xvfb'

console.log('Testing safer Puppeteer + Xvfb configuration...')

puppeteer.use(StealthPlugin())

async function testSaferConfig() {
  let xvfb = null
  let browser = null
  
  try {
    console.log('Starting Xvfb...')
    xvfb = new Xvfb({
      silent: true,
      xvfb_args: ["-screen", "0", '1920x1080x24', "-ac", "-nolisten", "tcp", "-dpi", "96", "+extension", "RANDR"]
    })
    
    xvfb.start((err) => {
      if (err) console.error('Xvfb error:', err)
    })
    
    console.log('Xvfb started, display:', xvfb._display)
    
    // Wait a moment for Xvfb to fully start
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Launching browser with safer arguments...')
    browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ["--enable-automation"],
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox", 
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // This might help with segfaults
        "--disable-gpu",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-features=TranslateUI",
        "--disable-ipc-flooding-protection",
        `--display=${xvfb._display}`,
        "--window-size=1920,1080"
      ]
    })
    
    console.log('Browser launched successfully')
    
    const page = await browser.newPage()
    console.log('Page created')
    
    await page.goto('https://example.com', {waitUntil: 'domcontentloaded'})
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

testSaferConfig() 