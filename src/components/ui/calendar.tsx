
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  profitData?: {
    [key: string]: number;
  };
  maxProfit?: number;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  profitData = {},
  maxProfit = 100,
  ...props
}: CalendarProps) {
  const getProfitColor = (day: Date): string => {
    if (!day) return "";
    
    const dateKey = day.toISOString().split('T')[0];
    const profit = profitData[dateKey] || 0;
    
    // Calculate color based on profit percentage of max
    const percentage = Math.min(profit / maxProfit, 1);
    
    if (percentage === 0) return "hover:bg-red-200 dark:hover:bg-red-900/30";
    if (percentage < 0.3) return "bg-red-100/50 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30";
    if (percentage < 0.6) return "bg-yellow-100/50 dark:bg-yellow-900/20 hover:bg-yellow-200 dark:hover:bg-yellow-900/30";
    return "bg-green-100/50 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30";
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 transition-colors duration-300"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        DayContent: ({ date, ...props }) => {
          const dayProfit = profitData?.[date.toISOString().split('T')[0]] || 0;
          const colorClass = getProfitColor(date);
          
          return (
            <div 
              className={`flex flex-col items-center justify-center w-full h-full rounded-md group ${colorClass}`}
              {...props}
            >
              <span>{date.getDate()}</span>
              {dayProfit > 0 && (
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-xs rounded px-2 py-1 transition-opacity duration-200 z-50 whitespace-nowrap pointer-events-none">
                  ${dayProfit.toFixed(2)} profit
                </div>
              )}
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
