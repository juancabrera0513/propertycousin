# Firebase Authentication email template

## Password reset

- Subject: `Reset your Property Cousins password`
- Template: `password-reset.html`
- Firebase placeholders: `%LINK%`, `%EMAIL%`, and `%APP_NAME%`
- Custom action URL: `https://YOUR-PRODUCTION-DOMAIN/admin/reset-password`

Apply these values under **Authentication > Templates > Password reset**. The
action URL makes the email open the website's custom English reset screen.
