const DEFAULT_MESSAGE = "Une erreur est survenue. Réessaie.";

const CODE_MESSAGES = {
  // --- Input / validation ---
  validation_failed: "Vérifie les champs (email / mot de passe).",
  bad_json: "Erreur technique (requête invalide). Réessaie.",

  // --- Login / signup ---
  invalid_credentials: "Email ou mot de passe incorrect.",
  email_not_confirmed: "Confirme ton email avant de te connecter.",
  email_exists: "Cet email est déjà utilisé. Essaie de te connecter.",
  user_already_exists: "Ce compte existe déjà. Essaie de te connecter.",
  signup_disabled: "Les inscriptions sont désactivées pour le moment.",
  weak_password: "Mot de passe trop faible. Choisis-en un plus solide.",

  // --- OTP / magic link / reset ---
  otp_expired: "Le code a expiré. Redemande un nouveau lien/code.",
  otp_disabled: "Connexion par code/lien désactivée.",

  // --- Rate limits ---
  over_email_send_rate_limit:
    "Trop d’emails envoyés. Attends un peu et réessaie.",
  over_request_rate_limit:
    "Trop de tentatives. Attends quelques minutes et réessaie.",
  over_sms_send_rate_limit: "Trop de SMS envoyés. Attends un peu et réessaie.",

  // --- Session ---
  session_expired: "Session expirée. Reconnecte-toi.",
  session_not_found: "Session introuvable. Reconnecte-toi.",

  // --- Server / infra ---
  request_timeout: "Le serveur met trop de temps. Réessaie.",
  unexpected_failure: "Service indisponible. Réessaie dans quelques instants.",
  conflict: "Conflit de requêtes. Réessaie (et évite les doubles clics).",
};

export function mapSupabaseAuthError(err) {
  if (!err) return DEFAULT_MESSAGE;

  // Supabase docs: AuthApiError a toujours `code` et `status` :contentReference[oaicite:1]{index=1}
  const code = err.code;
  const name = err.name;
  const status = err.status;

  // Cas spécial: AuthWeakPasswordError peut donner plus d'infos (si tu veux plus tard)
  // Mais pour "easy app" on garde simple.
  if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code];

  // Quelques "client errors" (CustomAuthError) — on se base sur `name`.
  // (Les noms exacts peuvent varier, поэтому fallback остаётся важным.)
  if (name === "AuthRetryableFetchError") {
    return "Problème réseau. Vérifie ta connexion et réessaie.";
  }

  // Fallback status (utile quand code отсутствует)
  if (status === 429) return "Trop de tentatives. Attends un peu et réessaie.";
  if (status >= 500) return "Serveur indisponible. Réessaie plus tard.";

  return DEFAULT_MESSAGE;
}
