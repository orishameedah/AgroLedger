// Do NOT redefine Metadata if it's already in RootLayout
// Unless you want to override it for these pages specifically.

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    
      {children}
    </>
  );
}
