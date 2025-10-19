# Snowflake Migration Guide

This document outlines the migration from Supabase to Snowflake for the EV Charging Platform.

## What Changed

### 1. Database Client
- **Before**: `@supabase/supabase-js` client
- **After**: `snowflake-sdk` with custom wrapper

### 2. Database Schema
- **Before**: PostgreSQL (Supabase)
- **After**: Snowflake
- **Location**: `snowflake/schema.sql`

### 3. Environment Variables
- **Before**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **After**: Snowflake connection parameters (see Configuration section)

## Configuration

### Environment Variables
Create a `.env.local` file with the following variables:

```bash
# Snowflake Configuration
SNOWFLAKE_ACCOUNT=TFLNRNC-FXB95084
SNOWFLAKE_USERNAME=SINAVAGHEFI
SNOWFLAKE_PASSWORD=your_password_here
SNOWFLAKE_DATABASE=SUHANI_OCPP
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_WAREHOUSE=your_warehouse_name
SNOWFLAKE_ROLE=ACCOUNTADMIN
```

### Snowflake Account Details
- **Account Identifier**: TFLNRNC-FXB95084
- **Data Sharing Account**: TFLNRNC.FXB95084
- **Organization**: TFLNRNC
- **Account Name**: FXB95084
- **Account/Server URL**: TFLNRNC-FXB95084.snowflakecomputing.com
- **Login Name**: SINAVAGHEFI
- **Role**: ACCOUNTADMIN
- **Account Locator**: UNB65916
- **Cloud Platform**: AWS
- **Edition**: Enterprise
- **Database**: SUHANI_OCPP

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
1. Copy the environment variables from above into `.env.local`
2. Replace `your_password_here` with your actual Snowflake password
3. Replace `your_warehouse_name` with your Snowflake warehouse name

### 3. Create Database Schema
1. Log into your Snowflake account
2. Execute the SQL script from `snowflake/schema.sql`
3. This will create all necessary tables and sample data

### 4. Test the Application
```bash
npm run dev
```

## Database Schema

The schema has been converted from PostgreSQL to Snowflake with the following key changes:

### Data Types
- `uuid` → `VARCHAR(36)` with `UUID_STRING()` function
- `timestamptz` → `TIMESTAMP_TZ`
- `jsonb` → `VARIANT`
- `text` → `TEXT` or `VARCHAR` as appropriate
- `decimal` → `DECIMAL` (same)

### Functions
- `gen_random_uuid()` → `UUID_STRING()`
- `now()` → `CURRENT_TIMESTAMP()`
- `CASCADE` constraints remain the same

### Sample Data
The schema includes sample data for testing:
- 3 regions (North America, Europe, Asia Pacific)
- 3 cities (San Francisco, Los Angeles, London)
- 2 sites with coordinates
- 3 chargers with different statuses
- Sample alerts, tickets, and predictions

## API Compatibility

The Snowflake client wrapper maintains the same API as Supabase for seamless migration:

```typescript
// Same interface as before
const { data, error } = await supabase
  .from('chargers')
  .select('*')
  .order('created_at', { ascending: false });

// Update operations
const { error } = await supabase
  .from('alerts')
  .update({ acknowledged: true })
  .eq('id', alertId);
```

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify your Snowflake credentials
   - Check that your warehouse is running
   - Ensure your IP is whitelisted in Snowflake

2. **Schema Errors**
   - Make sure the schema was created successfully
   - Check that all tables exist in the correct database/schema

3. **Query Errors**
   - Snowflake uses different SQL syntax in some cases
   - Check the Snowflake documentation for specific function differences

### Getting Help

- Check the Snowflake documentation: https://docs.snowflake.com/
- Verify your connection with the Snowflake web interface
- Check the application logs for specific error messages

## Files Modified

- `lib/supabase.ts` - Now re-exports Snowflake client
- `lib/snowflake.ts` - New Snowflake client implementation
- `snowflake/schema.sql` - Snowflake DDL schema
- `snowflake/config.md` - Configuration details
- `package.json` - Updated dependencies

## Next Steps

1. Set up your environment variables
2. Create the database schema in Snowflake
3. Test the application
4. Deploy to your production environment
5. Monitor performance and adjust as needed
