"use client";

import {
  useTheme,
  themeColors,
  type ThemeColor,
} from "../context/ThemeContext";

export default function ThemeShowcase() {
  const { themeColor, setThemeColor } = useTheme();

  return (
    <div className="p-8 space-y-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-black gradient-text mb-8">
          Theme Showcase
        </h2>

        {/* Theme Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(themeColors) as ThemeColor[]).map((color) => {
            const theme = themeColors[color];
            const isActive = themeColor === color;

            return (
              <button
                key={color}
                onClick={() => setThemeColor(color)}
                className={`group relative p-6 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "ring-4 ring-offset-4 ring-indigo-500 dark:ring-offset-gray-900 scale-105"
                    : "hover:scale-105"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${theme.primary.start}, ${theme.primary.mid}, ${theme.primary.end})`,
                }}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-xl animate-scaleIn">
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Theme Content */}
                <div className="text-center space-y-4">
                  <div className="text-6xl filter drop-shadow-2xl">
                    {theme.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white drop-shadow-lg">
                    {theme.name}
                  </h3>

                  {/* Color Swatches */}
                  <div className="flex gap-2 justify-center pt-4">
                    <div
                      className="w-12 h-12 rounded-lg shadow-lg border-2 border-white/30"
                      style={{ backgroundColor: theme.primary.start }}
                    />
                    <div
                      className="w-12 h-12 rounded-lg shadow-lg border-2 border-white/30"
                      style={{ backgroundColor: theme.primary.mid }}
                    />
                    <div
                      className="w-12 h-12 rounded-lg shadow-lg border-2 border-white/30"
                      style={{ backgroundColor: theme.primary.end }}
                    />
                  </div>

                  {/* Sample Components */}
                  <div className="space-y-2 pt-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white text-sm font-semibold">
                      Glass Card
                    </div>
                    <div className="bg-white text-gray-900 rounded-lg p-3 text-sm font-semibold shadow-lg">
                      Solid Card
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Component Examples */}
        <div className="mt-16 space-y-8">
          <h3 className="text-3xl font-black gradient-text">
            Component Examples
          </h3>

          {/* Buttons */}
          <div className="glass-card p-8 rounded-2xl">
            <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Buttons
            </h4>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Primary Button
              </button>
              <button className="px-6 py-3 glass-card hover-lift rounded-xl font-semibold">
                Glass Button
              </button>
              <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-semibold transition-all">
                Secondary Button
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="glass-card p-8 rounded-2xl">
            <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Cards
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-6 rounded-xl hover-lift">
                <h5 className="font-bold text-lg mb-2 gradient-text">
                  Glass Card
                </h5>
                <p className="text-gray-600 dark:text-gray-300">
                  With glassmorphism effect
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover-lift">
                <h5 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                  Solid Card
                </h5>
                <p className="text-gray-600 dark:text-gray-300">
                  With solid background
                </p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg hover-lift">
                <h5 className="font-bold text-lg mb-2 text-white">
                  Gradient Card
                </h5>
                <p className="text-white/90">With gradient background</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="glass-card p-8 rounded-2xl">
            <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Badges
            </h4>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg">
                Primary
              </span>
              <span className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                Success
              </span>
              <span className="px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold text-sm">
                Warning
              </span>
              <span className="px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold text-sm">
                Error
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
