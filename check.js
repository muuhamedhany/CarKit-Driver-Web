import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
  console.log('FINAL URL:', page.url());
  
  const content = await page.content();
  console.log('HTML LENGTH:', content.length);
  const rootText = await page.locator('#root').innerText();
  console.log('ROOT INNER TEXT:', rootText);
  
  await browser.close();
})();
