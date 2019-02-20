declare function MobileView(config: {
  tips?: string;
  message?: string;
  threshold?: number;
  noThrowError?: boolean;
}): boolean;

export default MobileView;
export as namespace MobileView;
