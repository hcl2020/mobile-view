declare function MobileView(option?: {
  tips?: string;
  message?: string;
  threshold?: number;
  noThrowError?: boolean;
  logo?: string;
}): boolean;

export default MobileView;
export as namespace MobileView;
