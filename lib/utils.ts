import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// クラス名を条件付きで結合するユーティリティ関数
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// インラインで実装する代替バージョン（clsxが見つからない場合用）
export function cnFallback(...classes: (string | boolean | undefined | null | Record<string, boolean>)[]) {
  return classes
    .filter(Boolean)
    .map((entry) => {
      if (typeof entry === "string") return entry
      if (typeof entry === "object") {
        return Object.entries(entry)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(" ")
      }
      return ""
    })
    .join(" ")
}
