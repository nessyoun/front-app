"use client";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function NotAllowedPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-green-200 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white opacity-90" />

          <div className="relative p-10 text-center">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-green-100 ring-1 ring-green-200">
              <Lock className="h-8 w-8 text-green-700" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-green-900">
              Accès refusé
            </h1>
            <p className="mt-2 text-green-700/80">
              Vous n'avez pas la permission d'accéder à cette ressource.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-green-300 bg-green-600 px-5 py-3 text-white transition hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                S'authentifier
              </a>
            </div>
          </div>

          <div className="relative h-2 w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600" />
        </div>

        <p className="mt-4 text-center text-sm text-green-800/70">
        <span>© {new Date().getFullYear()} Gantour</span>
        </p>
      </motion.div>
    </div>
  );
}
