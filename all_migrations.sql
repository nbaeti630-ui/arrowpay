-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- Create the wallets table
create table if not exists public.wallets (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  blockchain text,
  address text,
  circle_wallet_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint wallets_pkey primary key (id)
);

-- Create an index on user_id for faster lookups
create index if not exists wallets_user_id_idx on public.wallets(user_id);

-- Create a unique index on circle_wallet_id to prevent duplicates
create unique index if not exists wallets_circle_wallet_id_idx on public.wallets(circle_wallet_id);

-- Enable Row Level Security (RLS)
alter table public.wallets enable row level security;

-- Create Policies
-- 1. Allow users to view their own wallets
create policy "Users can view their own wallets"
  on public.wallets
  for select
  using (auth.uid() = user_id);

-- 2. Allow users to insert their own wallets
create policy "Users can insert their own wallets"
  on public.wallets
  for insert
  with check (auth.uid() = user_id);

-- 3. Allow users to update their own wallets
create policy "Users can update their own wallets"
  on public.wallets
  for update
  using (auth.uid() = user_id);

-- 4. Allow users to delete their own wallets
create policy "Users can delete their own wallets"
  on public.wallets
  for delete
  using (auth.uid() = user_id);

-- Enable Realtime for the wallets table
alter publication supabase_realtime add table public.wallets;-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- 1. Create the custom enum type
create type public.wallet_type as enum ('treasury', 'payout', 'customer');

-- 2. Add the new column to the wallets table
-- We set a default of 'treasury' to handle any existing rows safely
alter table public.wallets
add column type public.wallet_type not null default 'treasury';-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- Create compliance_logs table
CREATE TABLE IF NOT EXISTS public.compliance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallet_address TEXT NOT NULL,
  blockchain TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('PASS', 'REVIEW', 'FAIL')),
  rule_name TEXT,
  actions JSONB,
  risk_categories JSONB,
  risk_score TEXT,
  reasons JSONB,
  screening_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_compliance_logs_user_id ON public.compliance_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_wallet_address ON public.compliance_logs(wallet_address);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_result ON public.compliance_logs(result);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_created_at ON public.compliance_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.compliance_logs ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- 1. Allow users to view their own compliance logs
CREATE POLICY "Users can view their own compliance logs"
  ON public.compliance_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Allow users to insert their own compliance logs
CREATE POLICY "Users can insert their own compliance logs"
  ON public.compliance_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable Realtime for the compliance_logs table
ALTER PUBLICATION supabase_realtime ADD TABLE public.compliance_logs;
-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- Create the transactions table
create table if not exists public.transactions (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null, -- Using numeric for precise financial calculations
  sender_address text not null,
  recipient_address text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint transactions_pkey primary key (id)
);

-- Create indexes for faster querying
create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_sender_address_idx on public.transactions(sender_address);
create index if not exists transactions_recipient_address_idx on public.transactions(recipient_address);

-- Enable Row Level Security (RLS)
alter table public.transactions enable row level security;

-- Create Policies
-- 1. Allow users to view their own transactions
create policy "Users can view their own transactions"
  on public.transactions
  for select
  using (auth.uid() = user_id);

-- 2. Allow users to insert their own transactions
create policy "Users can insert their own transactions"
  on public.transactions
  for insert
  with check (auth.uid() = user_id);

-- 3. Allow users to update their own transactions (optional, depending on logic)
create policy "Users can update their own transactions"
  on public.transactions
  for update
  using (auth.uid() = user_id);

-- Function to automatically update 'updated_at' on change
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to execute the function before update
create trigger handle_transactions_updated_at
  before update on public.transactions
  for each row
  execute function public.handle_updated_at();

-- Enable Realtime for the transactions table (so the dashboard updates automatically)
alter publication supabase_realtime add table public.transactions;-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- Create the transaction_webhook_events table for logging and deduplication
create table if not exists public.transaction_webhook_events (
  id uuid not null default gen_random_uuid(),
  circle_event_id text,
  circle_transaction_id text,
  mapped_status text,
  raw_payload jsonb not null,
  signature_valid boolean not null default false,
  dedupe_hash text not null,
  created_at timestamptz not null default now(),

  constraint transaction_webhook_events_pkey primary key (id),
  constraint transaction_webhook_events_dedupe_hash_unique unique (dedupe_hash)
);

-- Create indexes for faster querying
create index if not exists transaction_webhook_events_circle_event_id_idx 
  on public.transaction_webhook_events(circle_event_id);
create index if not exists transaction_webhook_events_circle_transaction_id_idx 
  on public.transaction_webhook_events(circle_transaction_id);
create index if not exists transaction_webhook_events_created_at_idx 
  on public.transaction_webhook_events(created_at);

-- Enable Row Level Security (RLS)
alter table public.transaction_webhook_events enable row level security;

-- Create policy to allow service role (backend) to manage webhook events
-- Regular users should not have access to webhook events
create policy "Service role can manage webhook events"
  on public.transaction_webhook_events
  for all
  using (auth.jwt()->>'role' = 'service_role');

-- Add new columns to transactions table to support webhook processing
alter table public.transactions
  add column if not exists status text not null default 'pending',
  add column if not exists tx_hash text,
  add column if not exists circle_transaction_id text,
  add column if not exists transaction_type text not null default 'USER',
  add column if not exists direction text not null default 'debit',
  add column if not exists credit_amount numeric default 0;

-- Create index on tx_hash for webhook lookups
create index if not exists transactions_tx_hash_idx on public.transactions(tx_hash);
create index if not exists transactions_circle_transaction_id_idx on public.transactions(circle_transaction_id);
create index if not exists transactions_status_idx on public.transactions(status);
create index if not exists transactions_transaction_type_idx on public.transactions(transaction_type);
-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- 1. Drop the webhook events table
drop table if exists public.transaction_webhook_events;

-- 2. Create the Enum type for status
-- We use a DO block to ensure we don't error if the type already exists
do $$ begin
    if not exists (select 1 from pg_type where typname = 'transaction_status') then
        create type public.transaction_status as enum ('PENDING', 'CONFIRMED', 'COMPLETE');
    end if;
end $$;

-- 3. Modify the transactions table
alter table public.transactions
  -- Drop the unwanted columns
  drop column if exists tx_hash,
  drop column if exists circle_transaction_id,
  drop column if exists transaction_type,
  drop column if exists direction,
  drop column if exists credit_amount,

  -- Prepare status column for conversion (drop old default first)
  alter column status drop default;

-- 4. Convert the status column to the new Enum type
alter table public.transactions
  alter column status type public.transaction_status
  using (
    case
      -- Handle case-insensitive mapping (e.g. 'pending' -> 'PENDING')
      when upper(status) = 'PENDING' then 'PENDING'::public.transaction_status
      when upper(status) = 'CONFIRMED' then 'CONFIRMED'::public.transaction_status
      when upper(status) = 'COMPLETE' then 'COMPLETE'::public.transaction_status
      -- Default fallback for any other values
      else 'PENDING'::public.transaction_status
    end
  );

-- 5. Set the new default for status
alter table public.transactions
  alter column status set default 'PENDING'::public.transaction_status;-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- Add a column to store the Circle Transaction ID
ALTER TABLE public.transactions
ADD COLUMN circle_transaction_id text UNIQUE;-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- 1. Create the Enum types
create type public.transaction_type as enum (
  'INBOUND',
  'OUTBOUND'
);

create type public.blockchain_network as enum (
  'ETH-SEPOLIA',
  'BASE-SEPOLIA',
  'AVAX-FUJI',
  'ARC-TESTNET'
);

-- 2. Add the columns to the transactions table
-- We must provide DEFAULT values because the columns are NOT NULL and the table has existing data.
-- You can change 'ETH-SEPOLIA' to whichever network is most common in your existing data.
alter table public.transactions
add column type public.transaction_type not null default 'OUTBOUND',
add column blockchain public.blockchain_network not null default 'ETH-SEPOLIA';

-- 3. Create indexes for performance
create index if not exists transactions_type_idx on public.transactions using btree (type);
create index if not exists transactions_blockchain_idx on public.transactions using btree (blockchain);-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- 1. Add BRIDGE to the transaction_type enum
ALTER TYPE public.transaction_type ADD VALUE IF NOT EXISTS 'BRIDGE';

-- 2. Add tx_hash column to transactions table
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS tx_hash text;

-- 3. Create index on tx_hash for webhook lookups
CREATE INDEX IF NOT EXISTS transactions_tx_hash_idx ON public.transactions(tx_hash);

-- 4. Add comment for documentation
COMMENT ON COLUMN public.transactions.tx_hash IS 'Blockchain transaction hash for webhook matching';
COMMENT ON COLUMN public.transactions.circle_transaction_id IS 'Circle internal transaction ID';
-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- Add REBALANCE to transaction_type enum
ALTER TYPE public.transaction_type ADD VALUE IF NOT EXISTS 'REBALANCE';

-- Add balance columns to transactions table
ALTER TABLE public.transactions
ADD COLUMN before_balance numeric,
ADD COLUMN after_balance numeric;
-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- 1. Drop the index explicitly
DROP INDEX IF EXISTS public.transactions_tx_hash_idx;

-- 2. Drop the tx_hash column
-- This will automatically remove the comment associated with this column.
ALTER TABLE public.transactions
DROP COLUMN IF EXISTS tx_hash;-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- Migration: remove_balance_columns_from_transactions

ALTER TABLE public.transactions
DROP COLUMN IF EXISTS before_balance,
DROP COLUMN IF EXISTS after_balance;-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- Add 'gateway_signer' to the wallet_type enum
alter type public.wallet_type add value 'gateway_signer';
-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

-- Migration: re_add_tx_hash_column

-- 1. Add tx_hash column back to transactions table
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS tx_hash text;

-- 2. Re-create index on tx_hash for webhook lookups
CREATE INDEX IF NOT EXISTS transactions_tx_hash_idx ON public.transactions(tx_hash);

-- 3. Add comment for documentation
COMMENT ON COLUMN public.transactions.tx_hash IS 'Blockchain transaction hash for webhook matching';-- Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
-- SPDX-License-Identifier: Apache-2.0

ALTER TYPE public.transaction_status ADD VALUE IF NOT EXISTS 'FAILED';
