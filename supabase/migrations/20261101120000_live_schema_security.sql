-- LUMSIC: align Supabase security with the live project schema.
-- This migration is intentionally separate from the stale initial schema in the repository.
-- Public reader access is exposed through a column-limited view; private_data is never granted to clients.

CREATE OR REPLACE FUNCTION public.lumsic_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin', 'operations_admin', 'chat_admin', 'content_admin', 'finance_admin')
  );
$$;

REVOKE ALL ON FUNCTION public.lumsic_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lumsic_is_admin() TO authenticated;

-- Remove broad/old policies before installing the intended access model.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('profiles','user_roles','readers','consultation_sessions','chat_messages','wallets','wallet_transactions','payment_intents','activity_logs','app_settings','app_state')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END $$;

-- Profiles: a customer can only read their own profile; admins can read all.
CREATE POLICY profiles_select_own_or_admin ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.lumsic_is_admin());

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Role assignments are never client-writable.
CREATE POLICY user_roles_select_own_or_admin ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.lumsic_is_admin());

-- Do not expose readers.private_data through the base table.
CREATE POLICY readers_select_active ON public.readers
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

REVOKE ALL ON public.readers FROM anon, authenticated;
GRANT SELECT (id, astro_id, name, public_data, status, is_active, created_at, updated_at)
  ON public.readers TO anon, authenticated;

CREATE OR REPLACE VIEW public.public_readers
WITH (security_invoker = true)
AS
SELECT id, astro_id, name, public_data, status, is_active, created_at, updated_at
FROM public.readers
WHERE is_active = true;

GRANT SELECT ON public.public_readers TO anon, authenticated;

-- Consultation records: customer, assigned reader (matched by authenticated email), or admin.
CREATE POLICY consultations_participant_select ON public.consultation_sessions
  FOR SELECT TO authenticated
  USING (
    customer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.readers r
      WHERE r.id = assigned_reader_id
        AND lower(r.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
    OR public.lumsic_is_admin()
  );

CREATE POLICY consultations_customer_insert ON public.consultation_sessions
  FOR INSERT TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY consultations_participant_update ON public.consultation_sessions
  FOR UPDATE TO authenticated
  USING (
    customer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.readers r
      WHERE r.id = assigned_reader_id
        AND lower(r.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
    OR public.lumsic_is_admin()
  )
  WITH CHECK (
    customer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.readers r
      WHERE r.id = assigned_reader_id
        AND lower(r.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
    OR public.lumsic_is_admin()
  );

-- Chat is visible only to the participants of its consultation.
CREATE POLICY chat_messages_participant_select ON public.chat_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.consultation_sessions s
      WHERE s.id = session_id
        AND (
          s.customer_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.readers r
            WHERE r.id = s.assigned_reader_id
              AND lower(r.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
          )
          OR public.lumsic_is_admin()
        )
    )
  );

CREATE POLICY chat_messages_participant_insert ON public.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.consultation_sessions s
      WHERE s.id = session_id
        AND (
          s.customer_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.readers r
            WHERE r.id = s.assigned_reader_id
              AND lower(r.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
          )
          OR public.lumsic_is_admin()
        )
    )
  );

-- Wallets and ledgers are read-only to customers. All balance mutations must be server-verified.
CREATE POLICY wallets_select_owner_or_admin ON public.wallets
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR public.lumsic_is_admin());

CREATE POLICY wallet_transactions_select_owner_or_admin ON public.wallet_transactions
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR public.lumsic_is_admin());

CREATE POLICY payment_intents_select_owner_or_admin ON public.payment_intents
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR public.lumsic_is_admin());

-- Audit and configuration data are admin-only; app_state is not a client-side data store.
CREATE POLICY activity_logs_admin_only ON public.activity_logs
  FOR SELECT TO authenticated
  USING (public.lumsic_is_admin());

CREATE POLICY app_settings_admin_only ON public.app_settings
  FOR SELECT TO authenticated
  USING (public.lumsic_is_admin());

CREATE POLICY app_settings_admin_update ON public.app_settings
  FOR ALL TO authenticated
  USING (public.lumsic_is_admin())
  WITH CHECK (public.lumsic_is_admin());

CREATE POLICY app_state_admin_only ON public.app_state
  FOR ALL TO authenticated
  USING (public.lumsic_is_admin())
  WITH CHECK (public.lumsic_is_admin());
