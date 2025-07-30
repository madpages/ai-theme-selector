#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  viewport: {
    width: 800,
    height: 1200 // Tall enough to capture full page content
  },
  screenshotDir: 'screenshots',
  htmlFile: 'index.html',
  themesFile: 'themes.json'
};

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

async function loadThemes() {
  try {
    const themesContent = await fs.readFile(CONFIG.themesFile, 'utf-8');
    return JSON.parse(themesContent);
  } catch (error) {
    console.error(`❌ Error loading themes from ${CONFIG.themesFile}:`, error.message);
    process.exit(1);
  }
}

function createThemeHash(theme) {
  // Create the theme data structure expected by the page
  const themeData = {
    name: theme.name,
    description: theme.description,
    variables: theme.variables,
    createdAt: theme.createdAt,
    model: theme.model
  };
  
  // Base64 encode the JSON (same as the page's updateURLWithTheme method)
  return Buffer.from(JSON.stringify(themeData)).toString('base64');
}

async function captureScreenshot(browser, theme, outputPath) {
  const page = await browser.newPage();
  
  try {
    // Set viewport
    await page.setViewport(CONFIG.viewport);
    
    // Create the theme hash
    const themeHash = createThemeHash(theme);
    
    // Load the page with the theme hash
    const fileUrl = `file://${path.resolve(CONFIG.htmlFile)}#${themeHash}`;
    await page.goto(fileUrl, {
      waitUntil: ['load', 'networkidle0']
    });
    
    // Hide the floating widget before taking screenshot
    await page.evaluate(() => {
      const floatingWidget = document.getElementById('floating-widget');
      if (floatingWidget) {
        floatingWidget.style.display = 'none';
      }
    });
    
    // Wait a moment for any theme transitions to complete
    await page.waitForTimeout(500);
    
    // Take screenshot
    await page.screenshot({
      path: outputPath,
      fullPage: true, // Capture the entire page
      type: 'png'
    });
    
    console.log(`✅ Captured: ${theme.name} -> ${outputPath}`);
    
  } catch (error) {
    console.error(`❌ Error capturing ${theme.name}:`, error.message);
  } finally {
    await page.close();
  }
}

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('🎨 Theme Screenshot Capture Tool');
  console.log('================================\n');
  
  // Ensure screenshots directory exists
  await ensureDirectoryExists(CONFIG.screenshotDir);
  
  // Load themes
  console.log('📖 Loading themes...');
  const themes = await loadThemes();
  console.log(`Found ${themes.length} themes to capture\n`);
  
  // Launch browser
  console.log('🚀 Launching Chrome...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  
  try {
    // Capture screenshots for each theme
    for (let i = 0; i < themes.length; i++) {
      const theme = themes[i];
      const filename = `${String(i + 1).padStart(2, '0')}-${sanitizeFilename(theme.name)}.png`;
      const outputPath = path.join(CONFIG.screenshotDir, filename);
      
      console.log(`[${i + 1}/${themes.length}] Processing: ${theme.name}`);
      await captureScreenshot(browser, theme, outputPath);
    }
    
    console.log('\n🎉 All screenshots captured successfully!');
    console.log(`📁 Check the '${CONFIG.screenshotDir}' directory for your images.`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    await browser.close();
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error.message);
  process.exit(1);
});

// Run the script
main().catch(console.error);