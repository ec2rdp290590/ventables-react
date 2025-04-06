import { Star, StarHalf } from "lucide-react";

interface RatingProps {
  value: number;
  reviews?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function Rating({ value, reviews, size = "md", showCount = true }: RatingProps) {
  // Calculate full and half stars
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  
  // Determine icon sizes
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  const iconSize = iconSizes[size];
  
  return (
    <div className="flex items-center">
      <div className="flex">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star 
            key={`star-${index}`} 
            className={`${iconSize} fill-yellow-400 text-yellow-400`} 
          />
        ))}
        
        {/* Half star if needed */}
        {hasHalfStar && (
          <StarHalf 
            className={`${iconSize} fill-yellow-400 text-yellow-400`} 
          />
        )}
        
        {/* Empty stars */}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, index) => (
          <Star 
            key={`empty-star-${index}`} 
            className={`${iconSize} text-yellow-400`} 
          />
        ))}
      </div>
      
      {showCount && reviews !== undefined && (
        <span className={`ml-1 text-neutral-500 dark:text-neutral-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({reviews})
        </span>
      )}
    </div>
  );
}
