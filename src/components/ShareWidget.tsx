/**
 * ShareWidget
 *
 * Inline share buttons for blog posts and other shareable content.
 * Renders:
 *   - Native share button on devices that support the Web Share API
 *     (mobile primarily). When available, this opens the system
 *     share sheet which is faster and more familiar than per-platform
 *     buttons.
 *   - Twitter/X, Facebook, LinkedIn, Email buttons that open the
 *     platform's intent URL in a new tab.
 *   - Copy Link button that copies the canonical URL to the
 *     clipboard and briefly shows confirmation.
 */

import { useEffect, useState } from "react";
import { Facebook, Linkedin, Mail, Link as LinkIcon, Share2, Check } from "lucide-react";

interface ShareWidgetProps {
  /** The page URL to share. Defaults to current window.location.href. */
  url?: string;
  /** The page title or post title to include in tweets and emails. */
  title: string;
  /** Optional short description used in email body. */
  description?: string;
}

export default function ShareWidget({ url, title, description }: ShareWidgetProps) {
  const [shareUrl, setShareUrl] = useState(url ?? "");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true);
    }
  }, [url]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedBody = encodeURIComponent(
    `${description ? description + "\n\n" : ""}${shareUrl}`
  );

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const emailHref = `mailto:?subject=${encodedTitle}&body=${encodedBody}`;

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: description,
        url: shareUrl,
      });
    } catch {
      // User canceled or share failed silently. No action needed.
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for very old browsers: select-and-copy via a temp textarea
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // give up silently
      }
      document.body.removeChild(ta);
    }
  };

  const buttonClass =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-border bg-white text-primary text-sm font-medium hover:bg-muted hover:border-primary/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

  return (
    <div className="my-12 py-8 border-y border-border">
      <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
        Share this article
      </p>
      <div className="flex flex-wrap gap-3">
        {canNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            className={buttonClass}
            aria-label="Share via your device's share sheet"
          >
            <Share2 size={16} aria-hidden="true" />
            <span>Share</span>
          </button>
        )}

        <a
          href={twitterHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label="Share on X (Twitter)"
        >
          <span aria-hidden="true" className="font-bold">𝕏</span>
          <span>Post</span>
        </a>

        <a
          href={facebookHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label="Share on Facebook"
        >
          <Facebook size={16} aria-hidden="true" />
          <span>Facebook</span>
        </a>

        <a
          href={linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={16} aria-hidden="true" />
          <span>LinkedIn</span>
        </a>

        <a
          href={emailHref}
          className={buttonClass}
          aria-label="Share by email"
        >
          <Mail size={16} aria-hidden="true" />
          <span>Email</span>
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className={buttonClass}
          aria-label={copied ? "Link copied to clipboard" : "Copy link to clipboard"}
        >
          {copied ? (
            <>
              <Check size={16} aria-hidden="true" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon size={16} aria-hidden="true" />
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
