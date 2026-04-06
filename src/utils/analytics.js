/**
 * Centralized Analytics Hooks for the Hanuut Web Platform.
 * Connect this to Mixpanel, Google Analytics, or your custom Dashboard tracking.
 */

export const trackEvent = (eventName, data = {}) => {
  // TODO: Replace with actual analytics provider (e.g., mixpanel.track(eventName, data))
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Analytics] ${eventName}`, data);
  }
};

export const trackFunnelStep = (funnelName, stepName, stepNumber, data = {}) => {
  trackEvent(`${funnelName} - Step ${stepNumber}: ${stepName}`, {
    step: stepNumber,
    timestamp: new Date().toISOString(),
    ...data,
  });
};