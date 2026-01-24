import { useRef, useEffect, useCallback } from "react";
import { Search, Link, X } from "lucide-react";
import { isYouTubeUrl } from "../../hooks/useSearch";

/**
 * SearchBar component with Soft Gold theme, debounce, clear button, and URL paste support
 */
function SearchBar({
  value,
  onChange,
  onClear,
  onUrlPaste,
  isLoading,
  inputMode = "text",
  placeholder,
}) {
  const inputRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    // Delay focus to avoid keyboard popup on mobile
    const timer = setTimeout(() => {
      if (inputRef.current && window.innerWidth > 768) {
        inputRef.current.focus();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle paste event for URL detection
  const handlePaste = useCallback(
    (e) => {
      const pastedText = e.clipboardData.getData("text");

      if (isYouTubeUrl(pastedText) && onUrlPaste) {
        e.preventDefault();
        onUrlPaste(pastedText);
      }
    },
    [onUrlPaste],
  );

  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };

  // Dynamic placeholder based on input mode
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (inputMode === "url") return "Đã dán URL YouTube...";
    return "Tìm sách nói hoặc dán URL YouTube...";
  };

  return (
    <div className="relative">
      {/* Search/URL icon */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-600 pointer-events-none">
        {inputMode === "url" ? (
          <Link className="w-5 h-5" />
        ) : (
          <Search className="w-5 h-5" />
        )}
      </span>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        placeholder={getPlaceholder()}
        className={`
          w-full bg-cream-300/50 text-cream-800 placeholder-cream-600
          rounded-full px-5 py-4 pl-12 pr-12
          border transition-all duration-200 text-base
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cream-200
          ${
            inputMode === "url"
              ? "border-gold-400 focus:ring-gold-400 bg-gold-50"
              : "border-cream-400/50 focus:ring-gold-400 focus:border-gold-400"
          }
        `}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        aria-label="Tìm kiếm sách nói"
      />

      {/* URL mode indicator */}
      {inputMode === "url" && (
        <span className="absolute left-12 top-1/2 -translate-y-1/2 text-xs text-gold-600 font-semibold">
          URL
        </span>
      )}

      {/* Loading indicator or Clear button */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {isLoading ? (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : value ? (
          <button
            onClick={handleClear}
            className="w-10 h-10 flex items-center justify-center 
                       text-cream-600 hover:text-cream-800 
                       rounded-full hover:bg-cream-300/50
                       transition-colors min-h-[44px] min-w-[44px]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700"
            aria-label="Xóa tìm kiếm"
          >
            <X className="w-5 h-5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default SearchBar;
