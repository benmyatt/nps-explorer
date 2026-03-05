import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-6">
      <div className="max-w-7xl mx-auto px-6 text-center text-[10px] text-white/20">
        This site was made with love by Ben Myatt
        <span className="mx-1.5">|</span>
        <Link href="/api-explorer" className="text-white/20 hover:text-white/40">
          API
        </Link>
      </div>
    </footer>
  );
}
