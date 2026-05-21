<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project Name

NexBuy

## Project Overview

NexBuy is an AI-enhanced premium groupbuy platform focused on niche hobby communities such as:

- Mechanical keyboards
- Artisan keycaps
- Designer toys
- Limited action figures
- Gaming accessories
- Hobby collectibles

The platform combines:

- Groupbuy ecommerce
- AI prediction systems
- Escrow payment concepts
- Creator analytics
- Fraud/anomaly detection

This repository is currently focused on:

- UI/UX prototype
- Frontend architecture
- Mock dashboards
- Product flows
- AI feature placeholders

DO NOT implement real machine learning models or real payment systems yet.

---

# Main Goals

Build a responsive premium web application with:

- Excellent UI/UX
- Dark premium aesthetic
- Clean SaaS dashboard feel
- Community hobby ecommerce vibe
- Fully clickable navigation
- Realistic dummy data
- AI-focused analytics widgets

The website should feel:

- Premium
- Trustworthy
- Modern
- Comfortable to look at
- Not overly futuristic
- Easy on the eyes

Avoid excessive glow effects or cyberpunk overload.

---

# Tech Stack

## Frontend

- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion

## State

- React hooks
- Mock local state only

## Charts

- Recharts

## Icons

- Lucide React

---

# Design System

## Color Palette

### Background

- #121212
- #1E1E24

### Surface/Card

- #22232B

### Primary CTA

- #2563EB

### AI Accent

- #8B5CF6

### Text Primary

- #F3F4F6

### Text Secondary

- #9CA3AF

### Success

- #22C55E

### Warning

- #F59E0B

---

# UI Style Rules

## General Style

- Minimalist premium UI
- Modern dashboard aesthetic
- Soft shadows
- Rounded corners
- Proper spacing
- Strong hierarchy
- Smooth hover states
- Responsive layouts

## Avoid

- Giant hero images
- Visual clutter
- Overly futuristic AI design
- Neon overload
- Harsh pure black backgrounds
- Excessive animations

## Product Images

- Medium-sized only
- Clean presentation
- Balanced spacing

---

# AI Feature Styling

AI-related widgets should use:

- Purple accents
- Subtle glow
- Analytics cards
- Prediction badges
- Risk indicators

AI should feel integrated naturally into the product.

DO NOT make the entire interface look like an AI tool.

---

# Application Structure

## Public Pages

- Homepage
- Login
- Signup

## Dashboard Areas

- Collector Dashboard
- Creator Dashboard
- Admin Dashboard

Use role switcher dropdown instead of complex authentication.

---

# User Roles

## 1. Collector

Features:

- Browse projects
- Wishlist
- Product details
- Checkout flow
- Order history
- AI success probability
- Escrow payment visibility

Important pages:

- Dashboard
- Product detail
- Checkout
- Orders
- Wishlist

---

## 2. Creator

Features:

- Project analytics
- Fill rate charts
- MOQ recommendation
- AI anomaly alerts
- Escrow status
- Participation trends
- Production milestone tracking

Dashboard should feel like:

- SaaS analytics panel
- Command center
- Creator operations hub

---

## 3. Admin

Features:

- Fraud monitoring
- User management
- AI anomaly overview
- Transaction monitoring
- Platform statistics
- Trust score moderation

Dashboard should feel:

- Operational
- Analytical
- Professional

---

# Homepage Requirements

Homepage must include:

## Hero Section

Explain:

- AI-powered groupbuy platform
- Escrow security
- Premium hobby ecosystem

CTA:

- Explore Projects
- Start Groupbuy

---

## Featured Projects

Use realistic dummy data:

- Keyboard kits
- Artisan keycaps
- Figures
- Gaming accessories

Each card should include:

- Product image
- MOQ progress
- Join count
- Countdown
- AI probability
- Trust score
- Join button

---

## How Groupbuy Works

Simple step-by-step section:

1. Join Project
2. Secure Escrow Payment
3. MOQ Reached
4. Production & Fulfillment

---

## AI Features Section

Highlight:

- AI Success Prediction
- MOQ Recommendation
- AI Anomaly Detection
- Trust Score System

IMPORTANT:
Only create placeholder interfaces.
No actual AI implementation required.

---

## Latest Customer Reviews

Use realistic hobby-community testimonials.

Examples:

- Keyboard enthusiasts
- Figure collectors
- Artisan keycap collectors

Reviews should feel authentic.

---

# Product Detail Page

Must include:

- Product gallery
- Description
- Variants
- Quantity selector
- MOQ progress
- Countdown timer
- AI success widget
- Trust score
- Secure escrow CTA

Everything should be interactive.

---

# Checkout Flow

Include:

- Shipping section
- Payment summary
- Escrow explanation
- Confirmation page

No real payment integration required.

---

# Navigation Rules

Everything must be clickable.

Required flow:
Homepage
→ Login
→ Role Switcher
→ Dashboard
→ Product Detail
→ Checkout
→ Confirmation

Use:

- Sidebar navigation
- Top navigation
- Breadcrumbs where appropriate

---

# Dummy Data Rules

Use realistic product names such as:

- Neo65 Aluminum Keyboard Kit
- GMK Eclipse Keycaps
- Resin Oni Artisan Keycap
- EVA Unit-01 Figure
- Cyberpunk Deskmat
- Titanium Switch Puller

Use realistic:

- Prices
- MOQ targets
- Join counts
- AI probabilities
- Creator names
- Customer reviews

---

# Important Constraints

## DO NOT

- Build real backend authentication
- Build real payment gateway
- Build actual AI models
- Add unnecessary complexity
- Use placeholder lorem ipsum everywhere

## DO

- Use realistic mock data
- Build production-quality UI
- Make navigation functional
- Prioritize UI consistency
- Prioritize UX quality
- Maintain premium visual identity

---

# Architecture Notes

NexBuy AI system concept:

- Random Forest → success prediction
- Isolation Forest → anomaly detection
- Batch prediction every hour
- Trust score filtering
- Escrow-based payment protection

These systems are conceptual only for now.
Create visual placeholders and dashboard widgets only.

---

# UX Direction

The experience should feel like:
“Premium hobby ecommerce meets modern AI SaaS dashboard.”

Reference inspirations:

- Linear
- Stripe Dashboard
- Framer
- Shopify Admin
- modern keyboard hobby stores

---

# Final Objective

Create a believable MVP-quality prototype for NexBuy that:

- Matches the business use case
- Reflects the AI-enhanced groupbuy concept
- Feels modern and premium
- Demonstrates strong UX thinking
- Looks presentation/demo ready
