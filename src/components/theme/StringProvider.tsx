
import React, { createContext, useContext, useState, useEffect } from 'react';

// String dictionary type
export type StringDictionary = {
  [key: string]: {
    default: string;
    stoner: string;
  };
};

// Create our string dictionary with all the text variations
export const stringDictionary: StringDictionary = {
  // Dashboard
  "dashboard.title": {
    default: "Dashboard",
    stoner: "HQ - Mission Control"
  },
  "dashboard.stats": {
    default: "View your stats",
    stoner: "Peep your green empire 🍃"
  },
  "dashboard.analytics": {
    default: "Analytics",
    stoner: "Weed-o-Meter 📊"
  },
  "dashboard.last_login": {
    default: "Last login",
    stoner: "Last sesh"
  },
  "dashboard.welcome_back": {
    default: "Welcome back!",
    stoner: "Wassup dawg, you back in the grow game 🌱"
  },

  // Inventory
  "inventory.add": {
    default: "Add Inventory",
    stoner: "Drop Some Fresh Bud In 🌿"
  },
  "inventory.quantity": {
    default: "Quantity",
    stoner: "How chunky? (in g's bruh)"
  },
  "inventory.purchase_date": {
    default: "Purchase Date",
    stoner: "When'd it land in your stash?"
  },
  "inventory.total_cost": {
    default: "Total Cost",
    stoner: "How much this bad boy cost ya?"
  },
  "inventory.strain": {
    default: "Strain",
    stoner: "What's this magical leafy boi?"
  },
  "inventory.low_stock": {
    default: "Low Stock Warning",
    stoner: "Yo you runnin' dry!"
  },
  "inventory.edit": {
    default: "Edit Item",
    stoner: "Tweak this nug"
  },
  "inventory.delete": {
    default: "Delete",
    stoner: "Yeet it from the stash"
  },

  // Sales
  "sales.new": {
    default: "New Sale",
    stoner: "Cha-ching that green 💵"
  },
  "sales.price": {
    default: "Price",
    stoner: "What they paid (or said they would 👀)"
  },
  "sales.customer": {
    default: "Customer Name",
    stoner: "Who scored the goods?"
  },
  "sales.profit": {
    default: "Profit",
    stoner: "Leftover cheddar 🧀"
  },
  "sales.date": {
    default: "Date of Sale",
    stoner: "When the trade went down"
  },

  // Tick Ledger
  "tick.title": {
    default: "Tick Ledger",
    stoner: "IOUs & Smoke Promises 💨"
  },
  "tick.amount_owed": {
    default: "Amount Owed",
    stoner: "They still owe you this much dank 💰"
  },
  "tick.add_payment": {
    default: "Add Payment",
    stoner: "They finally paid, hallelujah"
  },
  "tick.outstanding": {
    default: "Outstanding Ticks",
    stoner: "Still owe ya, dodgy af"
  },

  // Calendar
  "calendar.upcoming": {
    default: "Upcoming Events",
    stoner: "Don't forget this weed biz sh*t 📅"
  },
  "calendar.reminder_set": {
    default: "Reminder Set",
    stoner: "Your future self gonna thank you"
  },
  "calendar.add_reminder": {
    default: "Add Reminder",
    stoner: "Yo set a heads-up"
  },
  "calendar.due_date": {
    default: "Due Date",
    stoner: "Doomsday / Delivery Day 🌬️"
  },

  // Supplies
  "supplies.title": {
    default: "Business Supplies",
    stoner: "Packaging, Bags, and Other Jazz 📦"
  },
  "supplies.restock": {
    default: "Restock Needed",
    stoner: "Running low on the baggies!"
  },
  "supplies.add": {
    default: "Add Supply",
    stoner: "Toss it in the back room"
  },
  "supplies.current": {
    default: "Current Stock",
    stoner: "What's left in the loot chest?"
  },

  // Customers
  "customers.title": {
    default: "Customers",
    stoner: "The Homies"
  },
  "customers.contact": {
    default: "Contact Info",
    stoner: "How to find 'em when they ghost you 👻"
  },
  "customers.top": {
    default: "Top Buyer",
    stoner: "MVP Burner of the Month 🔥"
  },
  "customers.add": {
    default: "Add Customer",
    stoner: "Add another leaf-head to the list"
  },

  // Settings
  "settings.title": {
    default: "Application Settings",
    stoner: "App Vibes"
  },
  "settings.timezone": {
    default: "Timezone",
    stoner: "Where you vibin' from?"
  },
  "settings.currency": {
    default: "Currency",
    stoner: "Cash style ($, €, ₿, etc)"
  },
  "settings.low_inventory": {
    default: "Low Inventory Alerts",
    stoner: "Yo, we're almost dry alert 🚨"
  },
  "settings.default_quantity": {
    default: "Default Purchase Quantity",
    stoner: "How fat is your usual pickup?"
  },
  "settings.save": {
    default: "Save Settings",
    stoner: "Lock it in 🔒"
  },
  "settings.stoner_mode": {
    default: "Enable Stoner Vibes Mode",
    stoner: "Enable Stoner Vibes Mode"
  },
  "settings.stoner_description": {
    default: "Turns the app into a chilled-out, slang-packed stoner dashboard. For legends only 💨😎",
    stoner: "Turns the app into a chilled-out, slang-packed stoner dashboard. For legends only 💨😎"
  },

  // Notifications
  "notifications.enable": {
    default: "Enable Notifications",
    stoner: "Turn on the good news 🔔"
  },
  "notifications.low_inventory": {
    default: "Low Inventory",
    stoner: "Dry alert 🌵"
  },
  "notifications.calendar": {
    default: "Calendar Reminder",
    stoner: "Yo don't miss your plug meetup"
  },

  // Misc
  "misc.help": {
    default: "Help",
    stoner: "Lost in the weed clouds?"
  },
  "misc.logout": {
    default: "Logout",
    stoner: "Dip out"
  },
  "misc.profile": {
    default: "Profile",
    stoner: "Your Vibe Card"
  },
  "misc.delete_account": {
    default: "Delete Account",
    stoner: "Peace out permanently 💀"
  },
  "misc.not_found": {
    default: "404 - Not Found",
    stoner: "Oops... That page smoked itself 💨"
  },
  "misc.loading": {
    default: "Loading...",
    stoner: "Hang tight... rolling it up 😵‍💫"
  },
  "misc.error": {
    default: "Error",
    stoner: "Welp, tech tripped out 🍄"
  }
};

// Context type
interface StringContextType {
  getString: (key: string) => string;
  isStonerMode: boolean;
  toggleStonerMode: () => void;
  stonerModeWithIcon: JSX.Element;
}

// Create context with default values
const StringContext = createContext<StringContextType>({
  getString: () => "",
  isStonerMode: false,
  toggleStonerMode: () => {},
  stonerModeWithIcon: <></>,
});

export const StringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isStonerMode, setIsStonerMode] = useState<boolean>(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const storedPreference = localStorage.getItem("stonerMode");
    if (storedPreference === "true") {
      setIsStonerMode(true);
    }
  }, []);

  // Toggle stoner mode
  const toggleStonerMode = () => {
    const newMode = !isStonerMode;
    setIsStonerMode(newMode);
    localStorage.setItem("stonerMode", String(newMode));
    
    // Add a bit of flair when enabling
    if (newMode) {
      // Play a sound effect if allowed
      const audio = new Audio("/sounds/toggle.mp3");
      audio.volume = 0.3;
      // Only try to play if audio is supported and user has interacted with page
      if (typeof document !== "undefined" && document.documentElement.hasAttribute("data-user-interacted")) {
        audio.play().catch(() => {
          // Silently fail if audio can't play
        });
      }
    }
  };

  // Get the appropriate string based on current mode with safety checks
  const getString = (key: string): string => {
    if (!key) {
      console.warn('Trying to get string with undefined or empty key');
      return '';
    }
    
    if (!stringDictionary[key]) {
      console.warn(`String key not found: ${key}`);
      return key;
    }
    
    try {
      return isStonerMode 
        ? (stringDictionary[key].stoner || stringDictionary[key].default || key) 
        : (stringDictionary[key].default || key);
    } catch (error) {
      console.error(`Error accessing string for key: ${key}`, error);
      return key;
    }
  };

  // Special element with icon for stoner mode label
  const stonerModeWithIcon = (
    <span className="flex items-center gap-1">
      Enable Stoner Vibes Mode
      {isStonerMode && (
        <span className="inline-flex animate-pulse">🍃</span>
      )}
    </span>
  );

  const contextValue: StringContextType = {
    getString,
    isStonerMode,
    toggleStonerMode,
    stonerModeWithIcon
  };

  return (
    <StringContext.Provider value={contextValue}>
      {children}
    </StringContext.Provider>
  );
};

// Hook for easy access to string context
export const useStrings = () => {
  const context = useContext(StringContext);
  if (!context) {
    throw new Error("useStrings must be used within a StringProvider");
  }
  return context;
};

// Effect hook to mark when user has interacted with the page
export const useDocumentInteraction = () => {
  useEffect(() => {
    const markInteraction = () => {
      document.documentElement.setAttribute('data-user-interacted', 'true');
    };
    
    document.addEventListener('click', markInteraction, { once: true });
    document.addEventListener('keydown', markInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', markInteraction);
      document.removeEventListener('keydown', markInteraction);
    };
  }, []);
};
