
-- Update inventory table to support any gram amount
-- Change quantity_unit to be more flexible and add a display_unit for UI purposes
ALTER TABLE public.inventory 
ADD COLUMN IF NOT EXISTS display_unit text;

-- Update existing records to have display_unit based on quantity
UPDATE public.inventory 
SET display_unit = quantity_unit 
WHERE display_unit IS NULL;

-- We'll keep quantity_unit for backward compatibility but make it more flexible
-- The quantity column will now store the exact gram amount
-- display_unit will show what the user originally selected (like "112g", "224g", "448g", "custom")

-- Update the check constraint to be more flexible (remove if it exists)
DO $$ 
BEGIN
    -- Remove any existing check constraints on quantity_unit
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%quantity_unit%' 
        AND table_name = 'inventory'
    ) THEN
        ALTER TABLE public.inventory DROP CONSTRAINT IF EXISTS inventory_quantity_unit_check;
    END IF;
END $$;
