
-- Check if policies exist and create only missing ones
DO $$ 
BEGIN
    -- Check and create inventory SELECT policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'inventory' 
        AND policyname = 'Users can view their own inventory'
    ) THEN
        CREATE POLICY "Users can view their own inventory" 
          ON public.inventory 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;

    -- Check and create inventory INSERT policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'inventory' 
        AND policyname = 'Users can create their own inventory'
    ) THEN
        CREATE POLICY "Users can create their own inventory" 
          ON public.inventory 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Check and create inventory UPDATE policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'inventory' 
        AND policyname = 'Users can update their own inventory'
    ) THEN
        CREATE POLICY "Users can update their own inventory" 
          ON public.inventory 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;

    -- Check and create inventory DELETE policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'inventory' 
        AND policyname = 'Users can delete their own inventory'
    ) THEN
        CREATE POLICY "Users can delete their own inventory" 
          ON public.inventory 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;

    -- Check and create strains SELECT policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'strains' 
        AND policyname = 'Users can view their own strains'
    ) THEN
        CREATE POLICY "Users can view their own strains" 
          ON public.strains 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;

    -- Check and create strains INSERT policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'strains' 
        AND policyname = 'Users can create their own strains'
    ) THEN
        CREATE POLICY "Users can create their own strains" 
          ON public.strains 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Check and create strains UPDATE policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'strains' 
        AND policyname = 'Users can update their own strains'
    ) THEN
        CREATE POLICY "Users can update their own strains" 
          ON public.strains 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;

    -- Check and create strains DELETE policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'strains' 
        AND policyname = 'Users can delete their own strains'
    ) THEN
        CREATE POLICY "Users can delete their own strains" 
          ON public.strains 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Ensure RLS is enabled on both tables
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strains ENABLE ROW LEVEL SECURITY;
