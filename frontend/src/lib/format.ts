export const money = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export const shortId = (id: string) => id.slice(-6).toUpperCase();
