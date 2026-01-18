// Cart Abandonment Tracking System

export interface AbandonedCart {
  id: string;
  userEmail: string;
  items: Array<{
    id: string;
    title: string;
    price: number;
    image: string;
  }>;
  createdAt: number;
  lastUpdated: number;
  emailsSent: number;
  recovered: boolean;
}

export class CartAbandonmentTracker {
  private static STORAGE_KEY = "abandoned_carts";
  private static EMAIL_INTERVALS = [
    { hours: 1, template: "reminder" },
    { hours: 24, template: "discount" },
    { hours: 72, template: "last_chance" },
  ];

  // Save cart as potentially abandoned
  static trackCart(userEmail: string, items: any[]) {
    if (!userEmail || items.length === 0) return;

    const cart: AbandonedCart = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userEmail,
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        price: parseFloat(item.price.amount),
        image: item.images[0]?.url || "",
      })),
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      emailsSent: 0,
      recovered: false,
    };

    // Store in localStorage (in production, this would be a database)
    const carts = this.getAbandonedCarts();
    carts.push(cart);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carts));

    // Schedule email checks
    this.scheduleEmailChecks(cart);
  }

  // Get all abandoned carts
  static getAbandonedCarts(): AbandonedCart[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Check if emails need to be sent
  static async checkAndSendEmails() {
    const carts = this.getAbandonedCarts();
    const now = Date.now();

    for (const cart of carts) {
      if (cart.recovered || cart.emailsSent >= 3) continue;

      const hoursSinceCreation = (now - cart.createdAt) / (1000 * 60 * 60);
      const nextEmail = this.EMAIL_INTERVALS[cart.emailsSent];

      if (hoursSinceCreation >= nextEmail.hours) {
        await this.sendAbandonmentEmail(cart, nextEmail.template);
        cart.emailsSent++;
        cart.lastUpdated = now;
        this.updateCart(cart);
      }
    }
  }

  // Send abandonment email
  static async sendAbandonmentEmail(cart: AbandonedCart, template: string) {
    console.log(`Sending ${template} email to ${cart.userEmail}`);

    try {
      await fetch("/api/send-abandonment-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cart.id,
          email: cart.userEmail,
          items: cart.items,
          template,
          emailNumber: cart.emailsSent + 1,
        }),
      });
    } catch (error) {
      console.error("Failed to send abandonment email:", error);
    }
  }

  // Mark cart as recovered
  static markAsRecovered(cartId: string) {
    const carts = this.getAbandonedCarts();
    const cart = carts.find((c) => c.id === cartId);
    if (cart) {
      cart.recovered = true;
      cart.lastUpdated = Date.now();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carts));
    }
  }

  // Update cart
  private static updateCart(cart: AbandonedCart) {
    const carts = this.getAbandonedCarts();
    const index = carts.findIndex((c) => c.id === cart.id);
    if (index !== -1) {
      carts[index] = cart;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carts));
    }
  }

  // Schedule email checks (in production, this would be a cron job)
  private static scheduleEmailChecks(cart: AbandonedCart) {
    // Check every 15 minutes
    const checkInterval = 15 * 60 * 1000;
    
    const intervalId = setInterval(() => {
      this.checkAndSendEmails();
      
      // Stop checking after 3 days
      const hoursSinceCreation = (Date.now() - cart.createdAt) / (1000 * 60 * 60);
      if (hoursSinceCreation > 72 || cart.recovered) {
        clearInterval(intervalId);
      }
    }, checkInterval);
  }

  // Get email templates
  static getEmailTemplate(template: string, cart: AbandonedCart) {
    const templates = {
      reminder: {
        subject: "You left something behind at Archival Ink Gallery",
        body: `
          <h2>Your art is waiting for you</h2>
          <p>Hi there! We noticed you left some amazing artworks in your cart.</p>
          <p>Don't miss out on these pieces:</p>
          ${cart.items.map((item) => `
            <div style="margin: 20px 0;">
              <img src="${item.image}" alt="${item.title}" style="width: 200px; height: auto;">
              <h3>${item.title}</h3>
              <p>$${item.price}</p>
            </div>
          `).join("")}
          <a href="https://archival-ink-v1-6.vercel.app/gallery" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">
            Complete Your Purchase
          </a>
        `,
      },
      discount: {
        subject: "10% OFF your cart at Archival Ink Gallery",
        body: `
          <h2>Special offer just for you</h2>
          <p>We really want you to have these artworks! Here's 10% off your cart.</p>
          <p style="font-size: 24px; font-weight: bold; color: #7c3aed;">Use code: COMEBACK10</p>
          ${cart.items.map((item) => `
            <div style="margin: 20px 0;">
              <img src="${item.image}" alt="${item.title}" style="width: 200px; height: auto;">
              <h3>${item.title}</h3>
              <p><s>$${item.price}</s> <strong>$${(item.price * 0.9).toFixed(2)}</strong></p>
            </div>
          `).join("")}
          <a href="https://archival-ink-v1-6.vercel.app/gallery" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">
            Claim Your Discount
          </a>
        `,
      },
      last_chance: {
        subject: "Last chance: Your cart expires soon",
        body: `
          <h2>This is your final reminder</h2>
          <p>Your cart will expire in 24 hours. Don't miss out on these incredible artworks!</p>
          <p style="font-size: 24px; font-weight: bold; color: #7c3aed;">10% OFF still available: COMEBACK10</p>
          ${cart.items.map((item) => `
            <div style="margin: 20px 0;">
              <img src="${item.image}" alt="${item.title}" style="width: 200px; height: auto;">
              <h3>${item.title}</h3>
              <p>$${item.price}</p>
            </div>
          `).join("")}
          <a href="https://archival-ink-v1-6.vercel.app/gallery" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">
            Complete Your Purchase Now
          </a>
        `,
      },
    };

    return templates[template as keyof typeof templates];
  }
}

// Initialize cart abandonment checking on app load
if (typeof window !== "undefined") {
  // Check every 15 minutes
  setInterval(() => {
    CartAbandonmentTracker.checkAndSendEmails();
  }, 15 * 60 * 1000);
}
