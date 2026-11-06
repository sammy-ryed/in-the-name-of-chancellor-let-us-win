import styles from "@/app/contact/contact.module.css";

type Props = { phone?: { label: string; href: string }; email?: string };

export function ContactLinks({ phone, email }: Props) {
  return (
    <div className={styles.contactLinks}>
      {phone && <a href={phone.href} aria-label={`Call ${phone.label}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7.3 3.5 2.6 4.7-2.1 2.2a15.5 15.5 0 0 0 5.8 5.8l2.2-2.1 4.7 2.6-.4 3.2c-.1.7-.7 1.2-1.4 1.1C10 20.3 3.7 14 3 5.3c-.1-.7.4-1.3 1.1-1.4z" /></svg>
        <span>{phone.label}</span>
      </a>}
      {email && <a href={`mailto:${email}`} aria-label={`Email ${email}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
        <span>{email}</span>
      </a>}
    </div>
  );
}
