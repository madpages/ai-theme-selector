# Theme Gallery - Rate Your Favorites 🎨

An interactive gallery for rating and comparing blog themes with auto-captured screenshots.

## ✨ Features

- **Theme Screenshots**: Auto-captured screenshots of 56 themes at 800px width
- **Interactive Rating**: Rate themes 1-10 stars with keyboard or mouse
- **Smart Navigation**: Auto-advance to next unrated theme after rating
- **CSV Export**: Download your ratings as CSV for analysis
- **Local Storage**: Ratings persist in browser storage
- **Responsive Design**: Works on desktop and mobile

## 🚀 GitHub Pages Deployment

1. Push this repository to GitHub
2. Enable GitHub Pages in Settings → Pages → Source: GitHub Actions
3. Your gallery will be live at: `https://yourusername.github.io/repository-name/`

## 🎮 Controls

- **←/→**: Navigate between themes
- **1-9**: Rate theme 1-9 stars
- **0**: Rate theme 10 stars
- **Space**: Zoom image
- **Esc**: Close zoom

## 📁 Structure

```
docs/                   # GitHub Pages files
├── index.html         # Theme gallery
├── themes.json        # Theme data
└── screenshots-optimized/ # Optimized theme screenshots
```

## Original Theme Lab

The original AI-powered theme lab is available in `index.html`.

## How to Use

### Basic Theme Management
- **Reset**: Click the "Reset" button to return to the default theme
- **History**: Click "History" to view and manage saved themes
- **Preview**: Click any theme's "Preview" button to try it temporarily
- **Apply**: Click "Apply" to permanently set a theme

### AI Theme Generation
1. Click "Ask AI" to open the chat panel
2. Describe your desired theme (e.g., "Make it cooler and slightly darker")
3. Click "Suggest Theme" to generate a new theme
4. Use "Preview" to test the theme, or "Apply" to save and use it

### Import/Export
- **Export All**: Download all your themes as a JSON file
- **Import**: Upload a previously exported JSON file
- **Clear All**: Remove all theme history (with confirmation)

## Example Theme Requests

- "Make it cooler and slightly darker, keep high contrast for long reads"
- "Try a muted forest palette with warm paper background"
- "Dark mode with ink tints and off-white text, keep links readable"
- "Give me a playful accent — coral for buttons — but don't kill contrast"

## Technical Details

### CSS Variables
The theme system uses CSS custom properties for consistent theming:
```css
--bg              /* Main background */
--surface         /* Card/panel backgrounds */
--text            /* Primary text color */
--text-muted      /* Secondary text color */
--primary         /* Primary accent color */
--primary-contrast /* Text on primary color */
--accent-fill     /* Subtle accent backgrounds */
--border          /* Border colors */
--ring            /* Focus ring colors */
```

### API Integration
- **Model**: Defaults to `gemini-1.5-flash` for speed, switchable to `gemini-1.5-pro` for quality
- **Structured Output**: Uses Gemini's `response_schema` for guaranteed JSON responses
- **Validation**: All generated colors are validated for proper hex format
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Browser Support
- Modern browsers with CSS custom properties support
- localStorage for theme persistence
- Fetch API for Gemini integration

## Development Notes

This is a complete single-file implementation with no build steps required. The file includes:
- Embedded CSS with the complete design system
- Vanilla JavaScript for all functionality
- Inline SVG placeholder image
- Google Fonts integration

## Security Considerations

🔒 **For Production Use**:
- Implement a backend proxy to hide your API key
- Use environment variables for sensitive configuration
- Consider rate limiting for API calls
- Implement proper CORS policies

## License

This implementation is provided as a demonstration. Adapt and modify as needed for your projects.
