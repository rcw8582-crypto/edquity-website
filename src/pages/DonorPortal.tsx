import { useEffect } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "dbox-widget": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        campaign?: string;
        type?: string;
        "enable-auto-scroll"?: string;
        "show-content"?: string;
      };
    }
  }
}

export default function DonorPortal() {
  useEffect(() => {
    if (document.querySelector('script[src="https://donorbox.org/widgets.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://donorbox.org/widgets.js";
    script.type = "module";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      const existing = document.querySelector('script[src="https://donorbox.org/widgets.js"]');
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-background">
      <dbox-widget
        campaign="iep-advocacy-at-the-margins"
        type="donation_form"
        enable-auto-scroll="true"
        show-content="true"
      />
    </div>
  );
}
