"use client";

import { api } from "./api";

// Generate or retrieve session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
    sessionStorage.setItem("analytics_session_start", Date.now().toString());
  }
  return sessionId;
}

// Get session start time
function getSessionStart(): number {
  if (typeof window === "undefined") return Date.now();
  const start = sessionStorage.getItem("analytics_session_start");
  return start ? parseInt(start) : Date.now();
}

// Track event with full context
export async function trackEvent(
  eventType: string,
  eventData?: any,
  path?: string,
  duration?: number
) {
  try {
    const sessionId = getSessionId();
    const metadata: any = {
      sessionId,
      sessionDuration: Date.now() - getSessionStart(),
    };

    // Add comprehensive device/browser/OS info
    if (typeof window !== "undefined") {
      metadata.screenWidth = window.screen.width;
      metadata.screenHeight = window.screen.height;
      metadata.viewportWidth = window.innerWidth;
      metadata.viewportHeight = window.innerHeight;
      metadata.language = navigator.language;
      metadata.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Detect device type
      const ua = navigator.userAgent.toLowerCase();
      if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
        metadata.deviceType = "mobile";
      } else if (/tablet|ipad/i.test(ua)) {
        metadata.deviceType = "tablet";
      } else {
        metadata.deviceType = "desktop";
      }
      
      // Detect browser
      if (ua.includes("chrome") && !ua.includes("edg")) metadata.browser = "chrome";
      else if (ua.includes("firefox")) metadata.browser = "firefox";
      else if (ua.includes("safari") && !ua.includes("chrome")) metadata.browser = "safari";
      else if (ua.includes("edg")) metadata.browser = "edge";
      else if (ua.includes("opera") || ua.includes("opr")) metadata.browser = "opera";
      else metadata.browser = "unknown";
      
      // Detect OS
      if (ua.includes("win")) metadata.os = "windows";
      else if (ua.includes("mac")) metadata.os = "macos";
      else if (ua.includes("linux")) metadata.os = "linux";
      else if (ua.includes("android")) metadata.os = "android";
      else if (ua.includes("iphone") || ua.includes("ipad")) metadata.os = "ios";
      else metadata.os = "unknown";
    }

    await api.analytics.track(
      eventType,
      { ...eventData, metadata },
      path || window.location.pathname,
      document.referrer,
      duration
    );
  } catch (error) {
    // Silent fail
  }
}

// Track page view with duration
let pageViewStart = Date.now();
export function trackPageView(path?: string) {
  const currentPath = path || (typeof window !== "undefined" ? window.location.pathname : "");
  
  // Track previous page view duration if we have one
  if (typeof window !== "undefined" && sessionStorage.getItem("last_page_path")) {
    const duration = Date.now() - pageViewStart;
    const lastPath = sessionStorage.getItem("last_page_path");
    if (lastPath && duration > 0) {
      trackEvent("page_view_end", { path: lastPath }, lastPath, duration);
    }
  }
  
  pageViewStart = Date.now();
  sessionStorage.setItem("last_page_path", currentPath);
  
  trackEvent("page_view", {}, currentPath);
}

// Track click events
export function trackClick(element: string, context?: any) {
  trackEvent("click", {
    element,
    ...context,
  });
}

// Track search
export function trackSearch(query: string, resultsCount?: number) {
  trackEvent("search", {
    query,
    resultsCount,
  });
}

// Track form interaction
export function trackFormAction(formName: string, action: "start" | "submit" | "abandon", fieldData?: any) {
  trackEvent("form_action", {
    formName,
    action,
    fieldData,
  });
}

// Track feature usage
export function trackFeature(featureName: string, action: string, data?: any) {
  trackEvent("feature_usage", {
    feature: featureName,
    action,
    ...data,
  });
}

// Track engagement
export function trackEngagement(engagementType: string, data?: any) {
  trackEvent("engagement", {
    type: engagementType,
    ...data,
  });
}

// Track conversion event
export function trackConversion(conversionType: string, value?: number, data?: any) {
  trackEvent("conversion", {
    type: conversionType,
    value,
    ...data,
  });
}

