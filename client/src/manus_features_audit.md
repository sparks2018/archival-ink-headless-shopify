# Manus Site Features Audit

**Date**: January 16, 2026
**Live Site**: https://archivalink-ieytrltw.manus.space/

---

## LIGHTBOX COMPONENTS

### Main Structure
- Fixed overlay with backdrop blur
- Left side: Image viewer with zoom controls
- Right side: Info panel with glass-card styling

### Buttons (in order)
1. **Close button** (X icon, top right, absolute positioned)
2. **Zoom In** (+ icon, circular glass button)
3. **Zoom Out** (- icon, circular glass button)
4. **Add to Cart** (purple gradient, full width)
5. **View in Room** (outline style, home icon)
6. **Comments** (outline style, message icon)
7. **Add to Favorites** (outline style, heart icon)

### Info Panel Sections
1. **Category Badge** - Purple pill badge at top
2. **Title** - Large font, white text
3. **Artist** - "by [Artist Name]" in muted white
4. **Price** - Large bold price, with optional strikethrough original price
5. **Button Group** - 4 stacked buttons
6. **About this piece** - Section with description text
7. **Keyboard Hints** - ESC to close, +/- to zoom

### About This Piece Section
- Heading: "About this piece"
- Description text in white/60 opacity
- Located below the button group
- Has border-top separator

---

## COMMENTS PANEL

### Structure
- Slides in from right side
- Overlays the lightbox info panel
- Glass-card styling with backdrop blur
- Full height panel

### Components
1. **Header**
   - "Back to details" button (top left)
   - "Comments (0)" title
   - Close X button (top right)

2. **Empty State**
   - Message icon
   - "No comments yet" heading
   - "Be the first to share your thoughts!" subtext

3. **Action Button**
   - "Sign in to comment" button
   - Full width, outline style

4. **Comments List** (when populated)
   - User avatar
   - Username
   - Comment text
   - Timestamp
   - Like/Reply buttons

---

## PROFILE PAGE

### Header Section (Purple gradient background)
- **Avatar** - Large circular avatar with camera icon overlay
- **Name** - Large bold text
- **Edit Profile** button (outline, white)
- **Bio** - Multi-line description text
- **Location** - San Francisco, CA (with location icon)
- **Join Date** - "Joined Dec 2024" (with calendar icon)
- **Website** - myartcollection.com (with link icon)

### Stats Bar
- **Favorites** - Count with label
- **Following** - Count with label
- **Followers** - Count with label

### Tabs Navigation
- Activity (grid icon)
- Favorites (heart icon)
- Orders (shopping bag icon)
- Following (users icon)
- Settings (gear icon)

### Activity Feed
Each activity item has:
- **Icon** (colored circle with symbol)
  - Red heart for likes
  - Blue comment bubble for comments
  - Green shopping bag for purchases
  - Purple users icon for follows
- **Action text** - "Liked [Artwork] by [Artist]"
- **Timestamp** - "2 hours ago"
- **Quote/Detail** - For comments, shows the comment text

---

## CART SIDEBAR

### Header
- Shopping bag icon
- "Your Cart" title
- Item count badge (number)
- Close X button

### Cart Items
Each item shows:
- **Thumbnail** - Square artwork image
- **Title** - Artwork name
- **Artist** - Artist name in muted text
- **Price** - In purple/pink color
- **Quantity Controls**
  - Minus button
  - Number display
  - Plus button
- **Remove button** - Trash icon (red)

### Footer Section
- **Subtotal** - Label and amount
- **Shipping** - "Free" or amount
- **Total** - Large bold text with amount
- **Checkout Button** - Full width, purple gradient
- **Stripe Badge** - "Secure checkout powered by Stripe"

---

## HEADER MENU ICONS (Working)

All icons in the top right are clickable:
1. **Search** (magnifying glass) - Opens search modal
2. **Messages** (chat bubble) - Opens messages
3. **User Profile** (person icon) - Goes to /profile
4. **Favorites** (heart with badge) - Shows favorite count
5. **Cart** (shopping bag with badge) - Opens cart sidebar

---

## MISSING FEATURES IN SHOPIFY VERSION

### High Priority
1. **Comments Panel** - Complete component missing
2. **About this piece section** - Not in lightbox
3. **Profile Page** - Entire page missing
4. **Cart Sidebar** - Slide-in cart missing
5. **Working header icons** - Icons exist but don't function

### Medium Priority
6. **View in Room** - Currently placeholder
7. **Search Modal** - Search icon doesn't open anything
8. **Messages** - Messages icon doesn't work
9. **Activity Feed** - No user activity tracking
10. **Following System** - No follow/unfollow functionality

### Low Priority
11. **User Authentication** - Sign in/up system
12. **Order History** - Orders tab in profile
13. **Settings Page** - User settings
14. **Stripe Integration** - Payment processing

---

## IMPLEMENTATION PRIORITY

### Phase 1 (Critical for MVP)
1. Comments Panel UI (without backend)
2. About this piece section
3. Cart Sidebar with working add/remove
4. Header icon click handlers

### Phase 2 (Enhanced UX)
5. Profile Page UI (static/demo data)
6. Search Modal
7. View in Room placeholder modal

### Phase 3 (Backend Required)
8. Real comments system
9. User authentication
10. Order processing
11. Activity tracking
12. Following system
