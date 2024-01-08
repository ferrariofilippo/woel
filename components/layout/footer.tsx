import Link from "next/link";

const Footer = () => {
  return (
    <div
      className="sm:px-24 px-6 flex sm:flex-row flex-col justify-between dark:text-gray-400 text-gray-600 border-t border-gray-100 dark:border-gray-900 py-4"
    >
      <span
        className="sm:text-start text-center sm:mb-0 mb-4"
      >
        Copyright &copy; 2024. I creatori di Woel
      </span>
      <div
        className="flex flex-wrap sm:justify-end justify-center gap-8 gap-y-4 sm:mx-0 mx-auto"
      >
        <Link
          href="/privacy"
          className="hover:text-gray-900 dark:hover:text-gray-300"
        >
          Privacy
        </Link>
        <a
          href="https://github.com/ferrariofilippo/woel/issues"
          className="hover:text-gray-900 dark:hover:text-gray-300"
        >
          Contattaci
        </a>
      </div>
    </div>
  );
}

export { Footer };
