import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import Xvfb from 'xvfb'

console.log('Testing modern Xvfb + Puppeteer configuration...')

puppeteer.use(StealthPlugin())

async function testModernXvfb() {
  let xvfb = null
  let browser = null
  
  try {
    console.log('Starting Xvfb with modern configuration...')
    xvfb = new Xvfb({
      silent: true,
      xvfb_args: [
        "-screen", "0", "1920x1080x24",
        "-ac",
        "-nolisten", "tcp",
        "-dpi", "96",
        "+extension", "GLX",
        "+extension", "RANDR",
        "+extension", "RENDER",
        "-noreset"
      ]
    })
    
    xvfb.start((err) => {
      if (err) console.error('Xvfb error:', err)
    })
    
    console.log('Xvfb started, display:', xvfb._display)
    
    // Wait longer for Xvfb to fully initialize
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    console.log('Launching browser with modern configuration...')
    browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ["--enable-automation"],
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu-sandbox",
        "--disable-software-rasterizer",
        "--disable-features=VizDisplayCompositor",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-default-apps",
        "--disable-extensions",
        "--disable-plugins",
        "--disable-translate",
        "--disable-ipc-flooding-protection",
        "--memory-pressure-off",
        `--display=${xvfb._display}`,
        "--window-size=1920,1080",
        "--start-maximized"
      ]
    })
    
    console.log('Browser launched successfully with Xvfb')
    
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
    
    console.log('Modern Xvfb test completed successfully!')
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

testModernXvfb() 