const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/propertycousinsstl?igsh=MW45NHFvbmk2MG1iYw==",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17" cy="7" r="1" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/The-Property-Cousins-Real-Estate-Team/61565912713909/",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M14.2 8.4V6.9c0-.7.5-1.1 1.2-1.1h1.8V3h-2.5c-2.7 0-4.2 1.6-4.2 4.4v1H8v3.1h2.5V21h3.7v-9.5h2.5l.5-3.1h-3Z" />
      </svg>
    ),
  },
];

function SocialSticky() {
  return (
    <aside className="social-sticky" aria-label="Social media links">
      <span className="social-sticky__label">Follow us</span>

      {socialLinks.map(({ href, icon, label }) => (
        <a
          href={href}
          aria-label={label}
          className="social-sticky__link"
          key={label}
          rel="noreferrer"
          target="_blank"
        >
          {icon}
        </a>
      ))}
    </aside>
  );
}

export default SocialSticky;
