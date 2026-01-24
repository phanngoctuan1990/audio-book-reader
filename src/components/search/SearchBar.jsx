import { useRef, useEffect, useCallback } from "react";
import { isYouTubeUrl } from "../../hooks/useSearch";

/**
 * SearchBar component with debounce, clear button, and URL paste support
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
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg pointer-events-none">
        {inputMode === "url" ? "🔗" : "🔍"}
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
          w-full bg-dark-700 text-white placeholder-white/40 
          rounded-2xl px-5 py-4 pl-12 pr-12
          border transition-colors text-base
          focus:outline-none
          ${
            inputMode === "url"
              ? "border-accent-purple focus:border-accent-purple"
              : "border-white/10 focus:border-primary"
          }
        `}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* URL mode indicator */}
      {inputMode === "url" && (
        <span className="absolute left-12 top-1/2 -translate-y-1/2 text-xs text-accent-purple font-medium">
          URL
        </span>
      )}

      {/* Loading indicator or Clear button */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {isLoading ? (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : value ? (
          <button
            onClick={handleClear}
            className="w-8 h-8 flex items-center justify-center 
                       text-white/40 hover:text-white/80 
                       rounded-full hover:bg-white/10
                       transition-colors touch-target"
            aria-label="Xóa tìm kiếm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default SearchBar;
