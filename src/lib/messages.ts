// Ready-made WhatsApp messages. Plain functions, no server-only import.

type CredentialsMessage = {
  customerName: string;
  couple: string;
  loginUrl: string;
  inviteUrl: string;
  username: string;
  password: string | null;
};

/** The message the owner sends to a customer when their invitation is ready. */
export function credentialsMessage(m: CredentialsMessage): string {
  const login = m.password
    ? `Username: ${m.username}\nPassword: ${m.password}`
    : `Username: ${m.username}\n(Use your existing password)`;
  return [
    `Assalamu Alaikum ${m.customerName}! 🎉`,
    "",
    `Your wedding invitation for ${m.couple} is ready.`,
    "",
    "Log in here to add your events, families, photos and guest list:",
    m.loginUrl,
    login,
    "",
    "Your invitation link:",
    m.inviteUrl,
    "",
    "Note: the couple names are locked. If you spot a spelling mistake, message us and we will fix it.",
  ].join("\n");
}

/** The message a customer sends to one guest with their personal link. */
export function guestMessage(template: string, v: { name: string; couple: string; link: string }): string {
  return template.replaceAll("{name}", v.name).replaceAll("{couple}", v.couple).replaceAll("{link}", v.link);
}
