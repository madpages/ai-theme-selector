# Theme Lab - Minimalist Blog with AI-Powered Theme Generation

A single-file HTML implementation of a minimalist blog article page with live Gemini-powered theme tuning.

## Features

- ✨ **Minimalist Design**: Clean, readable article layout using Spectral typography
- 🎨 **CSS Variable System**: Complete theme system with semantic color tokens
- 🤖 **AI Theme Generation**: Integration with Google Gemini API for intelligent theme suggestions
- 💾 **Theme History**: Persistent storage of all generated themes in localStorage
- 🔄 **Live Preview**: Instant theme application and preview without page reload
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ♿ **Accessibility**: WCAG AA contrast compliance and keyboard navigation

## Getting Started

1. **Open the file**: Simply open `index.html` in any modern web browser
2. **Get a Gemini API Key**: 
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key
3. **Configure the API**: Click "Ask AI" and paste your API key in the configuration section

⚠️ **Important**: The current implementation exposes your API key in the browser and is intended for prototyping only. For production use, implement a backend proxy or use Firebase AI Logic.

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
