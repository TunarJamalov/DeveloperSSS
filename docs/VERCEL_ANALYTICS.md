# Vercel Web Analytics Setup Guide

This document describes how Vercel Web Analytics is integrated into the DeveloperSSS project.

## Overview

Vercel Web Analytics is enabled on this project to track user interactions, page views, and overall site performance. This helps us understand how developers are using the platform and where to focus our improvements.

## Current Implementation

### Package Installation

The `@vercel/analytics` package is already installed in the project:

```bash
npm install @vercel/analytics
```

Check `package.json` to verify:

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.6.1"
  }
}
```

### Integration in the Application

The analytics integration is initialized in `/src/main.js`:

```javascript
import { inject } from '@vercel/analytics'

// Initialize Vercel Analytics
inject();
```

This uses the `inject()` function for plain JavaScript/Vanilla JS applications, which is appropriate for this Vite + Vanilla JS setup.

## How It Works

1. **Automatic Tracking**: Once deployed to Vercel, the analytics script automatically tracks:
   - Page views
   - Navigation events
   - User interactions
   - Performance metrics

2. **No Route Support**: Since we're using the `inject()` function directly (rather than a framework-specific component), route detection is not available. However, URL changes are still tracked.

3. **Data Collection**: After deployment, you can view collected data in your Vercel dashboard under the **Analytics** tab.

## Viewing Analytics Data

### Prerequisites

- A Vercel account (available at https://vercel.com)
- The DeveloperSSS project deployed on Vercel

### Accessing the Dashboard

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the **developersss** project
3. Click the **Analytics** tab
4. View real-time visitor data, page views, and performance metrics

### Available Metrics

- **Web Vitals**: Core Web Vitals performance metrics
- **Visitors**: Unique visitor counts and trends
- **Page Views**: Most visited pages and user flows
- **Custom Events**: (Pro/Enterprise only) Track specific user interactions

## Development vs. Production

- **Development**: Analytics are not collected when running `npm run dev`
- **Production**: Analytics are automatically collected after deployment to Vercel

## Troubleshooting

### Verifying Analytics is Working

After deploying to Vercel, check that analytics is properly tracking:

1. Open your deployed site in a browser
2. Open Developer Tools (F12) → Network tab
3. Look for requests to `/_vercel/insights/view`
4. If present, analytics is working correctly

### Enable Web Analytics (if not already enabled)

If analytics data isn't showing up in your dashboard:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click the **Analytics** tab
4. Click **Enable** if it shows the option
5. Wait a few moments for analytics to initialize

## Next Steps

### Custom Events (Pro/Enterprise)

Once analytics is collecting data, you can add custom events to track specific user interactions:

```javascript
// Track custom events
window.va?.('event', { 
  name: 'user_clicked_resource',
  data: { resource_type: 'tutorial' }
});
```

For more information, see [Vercel Analytics Custom Events Documentation](https://vercel.com/docs/analytics/custom-events).

### Data Analysis

After collecting data for a few days:

1. Monitor user engagement trends
2. Identify popular content areas
3. Find pages with high bounce rates
4. Optimize based on user behavior patterns

## Resources

- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Getting Started Guide](https://vercel.com/docs/analytics/quickstart)
- [Privacy & Compliance](https://vercel.com/docs/analytics/privacy-policy)
- [Custom Events](https://vercel.com/docs/analytics/custom-events)

## Contributing

If you're contributing to this project and want to:

1. **Add custom event tracking**: Update `/src/main.js` with new event calls
2. **Modify analytics configuration**: Edit the `inject()` call with appropriate options
3. **Report analytics issues**: Create a GitHub issue with details about the problem

For general contribution guidelines, see [CONTRIBUTING.md](../CONTRIBUTING.md).
