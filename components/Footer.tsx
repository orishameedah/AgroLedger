import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-linear-to-b from-brand-green/90 to-green-950 mt-10  py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-emerald-50 mb-3">
              AgroLedger
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Securing Nigeria&apos;s harvest through blockchain transparency.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-green-200 mb-3">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="#home"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="#about"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="#how-it-works"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="#contact"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-green-200 mb-3">Get Started</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/signup/farmer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Farmer Signup
              </Link>
              <Link
                href="/signup/buyer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Farmer Login
              </Link>
              <Link
                href="/login/farmer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Go to Marketplace
              </Link>
            </nav>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} AgroLedger. <br />
            All rights reserved. Empowering Nigerian farmers through blockchain
            technology.
          </p>
        </div>
      </div>
    </footer>
  );
}
