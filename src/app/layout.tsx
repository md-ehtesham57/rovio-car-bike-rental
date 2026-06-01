import { Poppins } from 'next/font/google';
import "./styles.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'Ridenow Rentals',
  description: 'Rent cars and bikes near you',
};

export default function RootLayout(
  { children }: { children: React.ReactNode }
) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
};

