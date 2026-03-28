/**
 * Contact-info filter
 * Runs on every message before it is saved to Firestore.
 * Returns { blocked, reason } — if blocked, the message is NOT saved
 * and a system warning is shown instead.
 */

const PATTERNS: Array<{ regex: RegExp; reason: string }> = [
  { regex: /\+?[\d\s\-().]{10,}/,                           reason: 'phone number'     },
  { regex: /@[a-zA-Z0-9_.]{3,}/,                            reason: 'social handle'    },
  { regex: /t\.me\/\S+/i,                                   reason: 'Telegram link'    },
  { regex: /wa\.me\/\S+/i,                                  reason: 'WhatsApp link'    },
  { regex: /instagram\.com\/\S+/i,                          reason: 'Instagram link'   },
  { regex: /facebook\.com\/\S+/i,                           reason: 'Facebook link'    },
  { regex: /\btelegram\b.*[:=@]\s*\S+/i,                   reason: 'Telegram contact' },
  { regex: /\bwhatsapp\b.*[:=@]\s*\S+/i,                   reason: 'WhatsApp contact' },
  { regex: /\bsignal\b.*[:=@]\s*\S+/i,                     reason: 'Signal contact'   },
  { regex: /\bviber\b.*[:=@]\s*\S+/i,                      reason: 'Viber contact'    },
  { regex: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/, reason: 'email address' },
  { regex: /discord\.gg\/\S+/i,                             reason: 'Discord link'     },
  { regex: /skype:\S+/i,                                    reason: 'Skype contact'    },
]

export interface FilterResult {
  blocked: boolean
  reason?: string
  sanitised: string
}

export function filterMessage(text: string): FilterResult {
  for (const { regex, reason } of PATTERNS) {
    if (regex.test(text)) {
      return {
        blocked:   true,
        reason,
        sanitised: text.replace(regex, '[blocked]'),
      }
    }
  }
  return { blocked: false, sanitised: text }
}
