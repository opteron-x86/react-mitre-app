// src/utils/colorModeUtil.ts
import { useTheme } from '@mui/material/styles';

/**
 * Hook to provide color handling utilities that adapt to light/dark mode
 */
export function useColorModeAwareUtilities() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  /**
   * Gets appropriate heatmap color based on light/dark mode
   * In dark mode, we use brighter colors for better visibility
   */
  const getHeatmapColor = (count: number, max: number): string => {
    if (max === 0) return 'transparent';
    
    if (isDarkMode) {
      // For dark mode, use more vibrant colors to ensure visibility
      const hue = 200 - (140 * count) / max; // 200 (blue) to 60 (yellow-green)
      const saturation = 80 + (20 * count) / max; // More saturated for higher counts
      const lightness = 30 + (40 * count) / max; // Brighter for higher counts
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    } else {
      // Original light mode colors
      const hue = 120 - (120 * count) / max; // 120 (green) to 0 (red)
      return `hsl(${hue}, 100%, 75%)`;
    }
  };

  /**
   * Gets a color for text that contrasts with the background
   */
  const getContrastText = (backgroundColor: string): string => {
    // Simple contrast algorithm - in a more complex app, we would analyze the HSL values
    // to determine appropriate text color
    return isDarkMode ? '#ffffff' : '#000000';
  };

  /**
   * Returns background color for technique card based on rule count and theme mode
   */
  const getTechniqueCardBackgroundColor = (count: number, max: number): string => {
    const color = getHeatmapColor(count, max);
    
    // In dark mode, add a slight overlay to ensure separation from the background
    if (isDarkMode && count === 0) {
      return 'rgba(255, 255, 255, 0.03)';
    }
    
    return color;
  };

  return {
    getHeatmapColor,
    getContrastText,
    getTechniqueCardBackgroundColor,
    isDarkMode
  };
}