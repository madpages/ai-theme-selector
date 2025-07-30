#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

async function generateStaticGallery() {
  console.log('🔧 Generating static GitHub Pages gallery...');
  
  // Load themes
  const themesData = JSON.parse(await fs.readFile('themes.json', 'utf-8'));
  
  // Generate theme list with image paths
  const themes = themesData.map((theme, index) => ({
    id: theme.id,
    name: theme.name,
    description: theme.description,
    image: `screenshots-optimized/${String(index + 1).padStart(2, '0')}-${sanitizeFilename(theme.name)}.png`,
    index: index
  }));

  function sanitizeFilename(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // Create the static HTML with embedded theme data
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Theme Gallery - Rate Your Favorites</title>
  <style>
    * { box-sizing: border-box; }
    
    body {
      margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: #f1f5f9; min-height: 100vh; overflow-x: hidden;
    }
    
    .header {
      padding: 2rem; text-align: center; background: rgba(0,0,0,0.2);
      backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .header h1 {
      margin: 0; font-size: 2.5rem; font-weight: 700;
      background: linear-gradient(45deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .header p {
      margin: 0.5rem 0 0 0; opacity: 0.8; font-size: 1.1rem;
    }
    
    .controls {
      display: flex; justify-content: center; gap: 1rem; margin-top: 1rem;
      flex-wrap: wrap;
    }
    
    .control-item {
      display: flex; align-items: center; gap: 0.5rem;
      background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 20px;
      font-size: 0.9rem;
    }
    
    .gallery-container {
      padding: 2rem; max-width: 1400px; margin: 0 auto;
    }
    
    .gallery-stats {
      display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    
    .stat-card {
      background: rgba(255,255,255,0.1); padding: 1rem 1.5rem; border-radius: 12px;
      text-align: center; backdrop-filter: blur(10px);
      transition: transform 0.2s ease, background 0.2s ease;
    }
    
    .stat-card:hover { transform: translateY(-2px); background: rgba(255,255,255,0.15); }
    
    .stat-number { font-size: 1.8rem; font-weight: 700; margin-bottom: 0.2rem; }
    .stat-label { opacity: 0.8; font-size: 0.9rem; }
    
    .gallery {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2rem; margin-top: 2rem;
    }
    
    .theme-card {
      background: rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid transparent; position: relative;
      animation: slideInUp 0.6s ease;
    }
    
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .theme-card:hover {
      transform: translateY(-8px); background: rgba(255,255,255,0.1);
      border-color: rgba(96, 165, 250, 0.5); box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    
    .theme-card.selected {
      border-color: #60a5fa; background: rgba(96, 165, 250, 0.1);
      box-shadow: 0 0 30px rgba(96, 165, 250, 0.3);
    }
    
    .theme-image {
      width: 100%; height: 300px; object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .theme-card:hover .theme-image { transform: scale(1.02); }
    
    .theme-info {
      padding: 1.5rem;
    }
    
    .theme-name {
      font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;
      color: #f1f5f9;
    }
    
    .theme-id {
      font-size: 0.8rem; opacity: 0.6; margin-bottom: 1rem;
      font-family: 'Monaco', monospace;
    }
    
    .rating-section {
      display: flex; justify-content: space-between; align-items: center;
    }
    
    .stars {
      display: flex; gap: 3px;
    }
    
    .star {
      width: 24px; height: 24px; cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    
    .star:hover { transform: scale(1.2); }
    
    .star.filled {
      color: #fbbf24;
      animation: starPulse 0.4s ease;
    }
    
    .star.empty { color: #475569; }
    
    @keyframes starPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
    
    .rating-display {
      font-weight: 600; font-size: 1.1rem;
      color: #fbbf24; text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .shortcuts {
      position: fixed; bottom: 2rem; right: 2rem;
      background: rgba(0,0,0,0.8); padding: 1rem; border-radius: 12px;
      backdrop-filter: blur(10px); font-size: 0.85rem; opacity: 0.9;
      transition: opacity 0.3s ease;
    }
    
    .shortcuts:hover { opacity: 1; }
    
    .shortcuts h4 { margin: 0 0 0.5rem 0; color: #60a5fa; font-size: 0.9rem; }
    
    .shortcut-item { margin-bottom: 0.3rem; }
    
    .key { 
      background: #374151; padding: 0.2rem 0.4rem; border-radius: 4px;
      font-family: monospace; margin-right: 0.5rem; color: #fbbf24;
    }
    
    @media (max-width: 768px) {
      .gallery { grid-template-columns: 1fr; gap: 1.5rem; }
      .header h1 { font-size: 2rem; }
      .gallery-container { padding: 1rem; }
      .shortcuts { display: none; }
    }
    
    .zoom-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000;
      background: rgba(0,0,0,0.9); display: none; align-items: center; justify-content: center;
      backdrop-filter: blur(5px);
    }
    
    .zoom-image {
      max-width: 90vw; max-height: 90vh; border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    
    .filter-bar {
      display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    
    .filter-btn {
      background: rgba(255,255,255,0.1); border: none; color: #f1f5f9;
      padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .filter-btn:hover, .filter-btn.active {
      background: #60a5fa; transform: translateY(-1px);
    }
    
    .rating-animation {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      z-index: 2000; pointer-events: none;
      font-size: 4rem; font-weight: bold; color: #fbbf24;
      text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
      animation: ratingPop 1.2s ease-out forwards;
    }
    
    @keyframes ratingPop {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
      30% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
      70% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    .export-section {
      text-align: center; margin-top: 2rem; padding-top: 2rem;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    
    .export-btn {
      background: linear-gradient(45deg, #10b981, #059669);
      border: none; color: white; padding: 0.75rem 1.5rem;
      border-radius: 8px; font-weight: 600; cursor: pointer;
      transition: all 0.2s ease; font-size: 1rem;
    }
    
    .export-btn:hover {
      transform: translateY(-2px); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }
  </style>
</head>
<body>
  <header class="header">
    <h1>🎨 Theme Gallery</h1>
    <p>Rate your favorite themes from 1-10 stars</p>
    <div class="controls">
      <div class="control-item">
        <span>🏠</span> Navigate with <strong>←/→</strong>
      </div>
      <div class="control-item">
        <span>⭐</span> Rate <strong>1-9</strong> (or <strong>0</strong> for 10★)
      </div>
      <div class="control-item">
        <span>🔍</span> Click image to zoom
      </div>
    </div>
  </header>

  <div class="gallery-container">
    <div class="gallery-stats">
      <div class="stat-card">
        <div class="stat-number" id="total-themes">${themes.length}</div>
        <div class="stat-label">Total Themes</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="rated-themes">0</div>
        <div class="stat-label">Rated</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="avg-rating">0.0</div>
        <div class="stat-label">Avg Rating</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="top-rated">-</div>
        <div class="stat-label">Top Rated</div>
      </div>
    </div>

    <div class="filter-bar">
      <button class="filter-btn active" onclick="filterThemes('all')">All Themes</button>
      <button class="filter-btn" onclick="filterThemes('rated')">Rated Only</button>
      <button class="filter-btn" onclick="filterThemes('unrated')">Unrated</button>
      <button class="filter-btn" onclick="filterThemes('favorites')">★ 8+ Stars</button>
    </div>

    <div class="gallery" id="gallery">
      <!-- Themes will be populated by JavaScript -->
    </div>

    <div class="export-section">
      <button class="export-btn" onclick="exportRatings()">
        📊 Export Ratings as CSV
      </button>
    </div>
  </div>

  <div class="shortcuts">
    <h4>Keyboard Shortcuts</h4>
    <div class="shortcut-item"><span class="key">←/→</span> Navigate themes</div>
    <div class="shortcut-item"><span class="key">1-9</span> Rate 1-9 stars</div>
    <div class="shortcut-item"><span class="key">0</span> Rate 10 stars</div>
    <div class="shortcut-item"><span class="key">Space</span> Zoom image</div>
    <div class="shortcut-item"><span class="key">Esc</span> Close zoom</div>
  </div>

  <div class="zoom-overlay" id="zoom-overlay" onclick="closeZoom()">
    <img class="zoom-image" id="zoom-image" onclick="event.stopPropagation()">
  </div>

  <script>
    // Embedded theme data
    const themes = ${JSON.stringify(themes, null, 2)};
    
    // State
    let currentThemeIndex = 0;
    let ratings = JSON.parse(localStorage.getItem('themeRatings') || '{}');
    let currentFilter = 'all';

    // Initialize
    function init() {
      renderGallery();
      updateStats();
      setupKeyboardHandlers();
      
      setTimeout(() => {
        document.querySelectorAll('.theme-card').forEach((card, index) => {
          card.style.animationDelay = \`\${index * 0.1}s\`;
        });
      }, 100);
    }

    function renderGallery() {
      const gallery = document.getElementById('gallery');
      const filteredThemes = getFilteredThemes();
      
      gallery.innerHTML = filteredThemes.map((theme, displayIndex) => \`
        <div class="theme-card \${currentThemeIndex === theme.index ? 'selected' : ''}" 
             data-theme-index="\${theme.index}" 
             onclick="selectTheme(\${theme.index})">
          <img class="theme-image" 
               src="\${theme.image}" 
               alt="\${theme.name}"
               onclick="event.stopPropagation(); zoomImage('\${theme.image}')"
               onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'300\\'%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' fill=\\'%23374151\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' font-family=\\'sans-serif\\' font-size=\\'16\\' fill=\\'%23f1f5f9\\'%3EImage not found%3C/text%3E%3C/svg%3E'">
          <div class="theme-info">
            <div class="theme-name">\${theme.name}</div>
            <div class="theme-id">#\${theme.index + 1} • \${theme.id}</div>
            <div class="rating-section">
              <div class="stars" onclick="event.stopPropagation();">
                \${generateStars(theme.index)}
              </div>
              <div class="rating-display">
                \${ratings[theme.index] ? ratings[theme.index] + '/10' : 'Not rated'}
              </div>
            </div>
          </div>
        </div>
      \`).join('');
    }

    function getFilteredThemes() {
      switch(currentFilter) {
        case 'rated': return themes.filter(theme => ratings[theme.index]);
        case 'unrated': return themes.filter(theme => !ratings[theme.index]);
        case 'favorites': return themes.filter(theme => ratings[theme.index] >= 8);
        default: return themes;
      }
    }

    function generateStars(themeIndex) {
      const rating = ratings[themeIndex] || 0;
      return Array.from({length: 10}, (_, i) => 
        \`<span class="star \${i < rating ? 'filled' : 'empty'}" 
               onclick="rateTheme(\${themeIndex}, \${i + 1})">★</span>\`
      ).join('');
    }

    function selectTheme(index) {
      currentThemeIndex = index;
      document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('selected');
      });
      document.querySelector(\`[data-theme-index="\${index}"]\`)?.classList.add('selected');
      
      document.querySelector(\`[data-theme-index="\${index}"]\`)?.scrollIntoView({
        behavior: 'smooth', block: 'center'
      });
    }

    function rateTheme(themeIndex, rating) {
      ratings[themeIndex] = rating;
      localStorage.setItem('themeRatings', JSON.stringify(ratings));
      
      showRatingAnimation(rating);
      
      setTimeout(() => {
        const filteredThemes = getFilteredThemes();
        const nextUnrated = filteredThemes.find(theme => 
          theme.index > themeIndex && !ratings[theme.index]
        );
        
        if (nextUnrated) {
          selectTheme(nextUnrated.index);
        } else {
          const firstUnrated = filteredThemes.find(theme => !ratings[theme.index]);
          if (firstUnrated) {
            selectTheme(firstUnrated.index);
          }
        }
        
        updateStats();
        renderGallery();
      }, 1200);
    }

    function showRatingAnimation(rating) {
      const existingAnimation = document.querySelector('.rating-animation');
      if (existingAnimation) {
        existingAnimation.remove();
      }
      
      const animationEl = document.createElement('div');
      animationEl.className = 'rating-animation';
      animationEl.innerHTML = \`★ \${rating}\`;
      
      document.body.appendChild(animationEl);
      
      setTimeout(() => {
        animationEl.remove();
      }, 1200);
    }

    function updateStats() {
      const ratedCount = Object.keys(ratings).length;
      const avgRating = ratedCount > 0 ? 
        (Object.values(ratings).reduce((a, b) => a + b, 0) / ratedCount).toFixed(1) : '0.0';
      
      const topRated = ratedCount > 0 ? 
        Math.max(...Object.values(ratings)) : '-';

      document.getElementById('rated-themes').textContent = ratedCount;
      document.getElementById('avg-rating').textContent = avgRating;
      document.getElementById('top-rated').textContent = topRated === '-' ? '-' : topRated + '/10';
    }

    function filterThemes(filter) {
      currentFilter = filter;
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      renderGallery();
    }

    function zoomImage(imageSrc) {
      document.getElementById('zoom-image').src = imageSrc;
      document.getElementById('zoom-overlay').style.display = 'flex';
    }

    function closeZoom() {
      document.getElementById('zoom-overlay').style.display = 'none';
    }

    function exportRatings() {
      const ratedThemes = themes.filter(theme => ratings[theme.index]);
      
      if (ratedThemes.length === 0) {
        alert('No ratings to export! Rate some themes first.');
        return;
      }
      
      const csvHeaders = 'Theme Name,Rating\\n';
      const csvRows = ratedThemes.map(theme => 
        \`"\${theme.name}",\${ratings[theme.index]}\`
      ).join('\\n');
      
      const csvContent = csvHeaders + csvRows;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', \`theme-ratings-\${new Date().toISOString().split('T')[0]}.csv\`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      const exportBtn = document.querySelector('.export-btn');
      const originalText = exportBtn.textContent;
      exportBtn.textContent = '✅ Exported!';
      exportBtn.style.background = '#10b981';
      
      setTimeout(() => {
        exportBtn.textContent = originalText;
        exportBtn.style.background = '';
      }, 2000);
    }

    function setupKeyboardHandlers() {
      document.addEventListener('keydown', (e) => {
        const filteredThemes = getFilteredThemes();
        
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            if (currentThemeIndex > 0) {
              const prevTheme = filteredThemes.find(t => t.index < currentThemeIndex);
              if (prevTheme) selectTheme(prevTheme.index);
            }
            break;
            
          case 'ArrowRight':
            e.preventDefault();
            if (currentThemeIndex < themes.length - 1) {
              const nextTheme = filteredThemes.find(t => t.index > currentThemeIndex);
              if (nextTheme) selectTheme(nextTheme.index);
            }
            break;
            
          case ' ':
            e.preventDefault();
            const currentTheme = themes[currentThemeIndex];
            if (currentTheme) zoomImage(currentTheme.image);
            break;
            
          case 'Escape':
            closeZoom();
            break;
            
          default:
            const num = parseInt(e.key);
            if (!isNaN(num) && num >= 0 && num <= 9) {
              if (num === 0) {
                rateTheme(currentThemeIndex, 10);
              } else {
                rateTheme(currentThemeIndex, num);
              }
            }
            break;
        }
      });
    }

    init();
  </script>
</body>
</html>`;

  await fs.writeFile('index.html', html);
  console.log('✅ Static gallery generated: index.html');
  console.log('🚀 Ready for GitHub Pages deployment!');
}

generateStaticGallery().catch(console.error);
