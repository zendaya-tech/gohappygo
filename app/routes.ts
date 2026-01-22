import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route("/annonces", "pages/annonces.tsx"),
  route("/announces", "pages/announces.$id.tsx"),
  route("/profile", "pages/profile.tsx"),
  route("/terms-privacy", "pages/terms.tsx"),
  route("/logout", "pages/logout.tsx"),
  route("/logos", "pages/logos.tsx"),
  route("/transporters", "pages/transporters.tsx"),
  route("/forgot-password", "pages/forgot-password.tsx"),
  route("/help-center", "pages/help-center.tsx"),
  route("/security-rules", "pages/security-rules.tsx"),
  route("/assurance-colis", "pages/assurance-colis.tsx"),
  route("/download-app", "pages/download-app.tsx"),
  route("/notifications", "pages/notifications.tsx"),
  route("/stripe-onboarding", "pages/stripe-onboarding.tsx"),
  route("/support", "pages/support.tsx"),
  route("/how-it-work", "pages/how-it-works.tsx"),
] satisfies RouteConfig;
