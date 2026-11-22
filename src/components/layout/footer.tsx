export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 mt-auto">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="h-4 w-auto"
        />
        <p className="text-xs text-slate-500 text-center sm:text-right">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
