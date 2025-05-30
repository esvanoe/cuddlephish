import puppeteer from 'puppeteer-extra'

console.log('Debugging Chrome binary and configuration...')

async function debugChrome() {
  try {
    console.log('Puppeteer version:', puppeteer._launcher?._projectRoot || 'unknown')
    
    // Get the Chrome executable path without launching
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    })
    
    const browserVersion = await browser.version()
    console.log('Chrome version:', browserVersion)
    
    const executablePath = browser.process()?.spawnfile || 'unknown'
    console.log('Chrome executable path:', executablePath)
    
    await browser.close()
    
    console.log('Chrome binary test completed successfully')
  } catch (error) {
    console.error('Error getting Chrome info:', error)
  }
}

debugChrome() 