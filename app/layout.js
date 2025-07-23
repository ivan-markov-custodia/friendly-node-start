export const metadata = {
  title: 'Weather App',
  description: 'A weather application with authentication',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}