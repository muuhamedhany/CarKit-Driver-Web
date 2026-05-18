import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
  
  const content = await page.content();
  console.log('HTML LENGTH:', content.length);
  if (content.length < 1000) {
      console.log('HTML CONTENT:', content);
  }
  
  await browser.close();
})();
