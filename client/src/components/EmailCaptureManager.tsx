import { useState, useEffect } from "react";
import { EmailCapturePopup } from "./EmailCapturePopup";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../hooks/useAuth";

export function EmailCaptureManager() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupTrigger, setPopupTrigger] = useState<"cart" | "engagement">("engagement");
  const { items } = useCart();
  const { isAuthenticated } = useAuth();

  // Track if user has already seen the popup
  const [hasSeenPopup, setHasSeenPopup] = useState(() => {
    return localStorage.getItem("hasSeenEmailPopup") === "true";
  });

  // Track cart additions
  const [previousCartLength, setPreviousCartLength] = useState(0);

  useEffect(() => {
    // Don't show popup if user is authenticated or has already seen it
    if (isAuthenticated || hasSeenPopup) return;

    // Cart/Wishlist trigger: Show popup 60 seconds after adding item
    if (items.length > previousCartLength) {
      setPopupTrigger("cart");
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 60000); // 60 seconds

      return () => clearTimeout(timer);
    }

    setPreviousCartLength(items.length);
  }, [items.length, previousCartLength, isAuthenticated, hasSeenPopup]);

  useEffect(() => {
    // Don't show popup if user is authenticated or has already seen it
    if (isAuthenticated || hasSeenPopup) return;

    // Engagement trigger: Show popup after 60 seconds of browsing
    const timer = setTimeout(() => {
      // Only show if cart is empty (otherwise cart trigger takes precedence)
      if (items.length === 0) {
        setPopupTrigger("engagement");
        setShowPopup(true);
      }
    }, 60000); // 60 seconds

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasSeenPopup, items.length]);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem("hasSeenEmailPopup", "true");
    setHasSeenPopup(true);
  };

  const handleSubmit = async (email: string) => {
    // TODO: Send email to backend API to create account
    console.log("Email submitted:", email);
    
    // For now, just mark as authenticated
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("authProvider", "email");
    
    // Mark popup as seen
    localStorage.setItem("hasSeenEmailPopup", "true");
    setHasSeenPopup(true);

    // Send welcome email (TODO: implement backend)
    await fetch("/api/send-welcome-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email, 
        cartItems: items,
        trigger: popupTrigger 
      }),
    }).catch(console.error);
  };

  if (!showPopup) return null;

  return (
    <EmailCapturePopup
      trigger={popupTrigger}
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  );
}
