import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { LuHome } from "@qwikest/icons/lucide";

export default component$(() => {
  return (
    <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background */}
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-blue-400/20 blur-3xl" />
        <div class="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-purple-400/20 blur-3xl" />
      </div>

      <div class="relative z-10 mx-auto max-w-lg px-6 text-center">
        {/* 404 big number */}
        <h1 class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-[10rem] leading-none font-extrabold text-transparent select-none">
          404
        </h1>

        {/* Message */}
        <h2 class="mt-2 text-2xl font-semibold text-white">Page Not Found</h2>
        <p class="mt-3 text-slate-400">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        {/* Action */}
        <Link
          href="/"
          class="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
        >
          <LuHome class="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
});
