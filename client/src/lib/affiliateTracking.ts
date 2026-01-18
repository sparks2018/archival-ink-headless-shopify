// Affiliate Tracking System

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  code: string;
  commission: number; // percentage
  totalSales: number;
  totalCommission: number;
  clicks: number;
  conversions: number;
  createdAt: number;
}

export interface AffiliateClick {
  affiliateCode: string;
  timestamp: number;
  referrer: string;
  converted: boolean;
  orderId?: string;
}

export class AffiliateTracker {
  private static STORAGE_KEY = "affiliate_data";
  private static CLICK_STORAGE_KEY = "affiliate_clicks";
  private static COOKIE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

  // Track affiliate click
  static trackClick(affiliateCode: string) {
    // Store in localStorage (cookie alternative)
    const clickData = {
      code: affiliateCode,
      timestamp: Date.now(),
      referrer: document.referrer,
    };
    
    localStorage.setItem("affiliate_click", JSON.stringify(clickData));

    // Record click
    const click: AffiliateClick = {
      affiliateCode,
      timestamp: Date.now(),
      referrer: document.referrer,
      converted: false,
    };

    const clicks = this.getClicks();
    clicks.push(click);
    localStorage.setItem(this.CLICK_STORAGE_KEY, JSON.stringify(clicks));

    // Update affiliate stats
    this.incrementClicks(affiliateCode);
  }

  // Check for affiliate attribution
  static getAttribution(): { code: string; timestamp: number } | null {
    const data = localStorage.getItem("affiliate_click");
    if (!data) return null;

    const clickData = JSON.parse(data);
    const age = Date.now() - clickData.timestamp;

    // Check if within cookie duration
    if (age > this.COOKIE_DURATION) {
      localStorage.removeItem("affiliate_click");
      return null;
    }

    return clickData;
  }

  // Track conversion
  static trackConversion(orderId: string, orderTotal: number) {
    const attribution = this.getAttribution();
    if (!attribution) return;

    const affiliate = this.getAffiliate(attribution.code);
    if (!affiliate) return;

    // Calculate commission
    const commission = orderTotal * (affiliate.commission / 100);

    // Update affiliate stats
    affiliate.totalSales += orderTotal;
    affiliate.totalCommission += commission;
    affiliate.conversions++;

    this.updateAffiliate(affiliate);

    // Mark click as converted
    const clicks = this.getClicks();
    const click = clicks.find(
      (c) => c.affiliateCode === attribution.code && !c.converted
    );
    if (click) {
      click.converted = true;
      click.orderId = orderId;
      localStorage.setItem(this.CLICK_STORAGE_KEY, JSON.stringify(clicks));
    }

    // Clear attribution
    localStorage.removeItem("affiliate_click");

    // Send to backend
    this.reportConversion(affiliate.id, orderId, orderTotal, commission);
  }

  // Create affiliate
  static createAffiliate(name: string, email: string, commission: number = 10): Affiliate {
    const code = this.generateAffiliateCode(name);
    
    const affiliate: Affiliate = {
      id: `aff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      code,
      commission,
      totalSales: 0,
      totalCommission: 0,
      clicks: 0,
      conversions: 0,
      createdAt: Date.now(),
    };

    const affiliates = this.getAffiliates();
    affiliates.push(affiliate);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(affiliates));

    return affiliate;
  }

  // Generate affiliate code
  private static generateAffiliateCode(name: string): string {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${cleanName.substr(0, 6)}${random}`;
  }

  // Get all affiliates
  static getAffiliates(): Affiliate[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Get affiliate by code
  static getAffiliate(code: string): Affiliate | null {
    const affiliates = this.getAffiliates();
    return affiliates.find((a) => a.code === code) || null;
  }

  // Update affiliate
  private static updateAffiliate(affiliate: Affiliate) {
    const affiliates = this.getAffiliates();
    const index = affiliates.findIndex((a) => a.id === affiliate.id);
    if (index !== -1) {
      affiliates[index] = affiliate;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(affiliates));
    }
  }

  // Increment clicks
  private static incrementClicks(code: string) {
    const affiliate = this.getAffiliate(code);
    if (affiliate) {
      affiliate.clicks++;
      this.updateAffiliate(affiliate);
    }
  }

  // Get clicks
  private static getClicks(): AffiliateClick[] {
    const data = localStorage.getItem(this.CLICK_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Report conversion to backend
  private static async reportConversion(
    affiliateId: string,
    orderId: string,
    orderTotal: number,
    commission: number
  ) {
    try {
      await fetch("/api/affiliate/conversion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateId,
          orderId,
          orderTotal,
          commission,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.error("Failed to report affiliate conversion:", error);
    }
  }

  // Generate affiliate link
  static generateAffiliateLink(code: string, path: string = "/"): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}${path}?ref=${code}`;
  }

  // Get affiliate dashboard stats
  static getAffiliateStats(code: string) {
    const affiliate = this.getAffiliate(code);
    if (!affiliate) return null;

    const clicks = this.getClicks().filter((c) => c.affiliateCode === code);
    const conversions = clicks.filter((c) => c.converted);
    const conversionRate = clicks.length > 0 
      ? (conversions.length / clicks.length) * 100 
      : 0;

    return {
      ...affiliate,
      conversionRate: conversionRate.toFixed(2),
      averageOrderValue: affiliate.conversions > 0
        ? (affiliate.totalSales / affiliate.conversions).toFixed(2)
        : "0.00",
      pendingCommission: affiliate.totalCommission.toFixed(2),
    };
  }
}

// Check for affiliate code in URL on page load
if (typeof window !== "undefined") {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  
  if (ref) {
    AffiliateTracker.trackClick(ref);
    
    // Clean URL (remove ref parameter)
    const url = new URL(window.location.href);
    url.searchParams.delete("ref");
    window.history.replaceState({}, "", url.toString());
  }
}
