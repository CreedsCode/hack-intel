import os
import json
import psycopg2
import requests
from datetime import datetime
from dotenv import load_dotenv
import sys
import time

# Load environment variables
load_dotenv()

# Database configuration from environment variables
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "host.docker.internal")
DB_PORT = os.getenv("DB_PORT", "5432")
TABLE_NAME = os.getenv("PG_TABLE_NAME", "transaction_entries")
UNTIL_TIMESTAMP = os.getenv("UNTIL_TIMESTAMP", "2025-05-28")

# Blockscout configuration
BLOCK_SCOUT_URL = os.getenv("BLOCK_SCOUT_URL", "https://rootstock-testnet.blockscout.com/api/v2/transactions")
ITEMS_PER_PAGE = int(os.getenv("ITEMS_PER_PAGE", "50"))
MAX_PAGES_TO_FETCH = int(os.getenv("MAX_PAGES_TO_FETCH", "999"))
FILTER_VALIDATED = "validated"
REQUEST_TIMEOUT = 30  # seconds

def fetch_transactions_until_timestamp(endpoint_url, stop_timestamp_prefix, initial_params=None):
    """
    Fetches transactions by paginating through the API until a transaction with a timestamp
    starting with stop_timestamp_prefix is encountered, or until no more pages are available,
    or MAX_PAGES_TO_FETCH is reached.
    Uses 'block_number' and 'items_count' from API's next_page_params for subsequent requests.
    Adds 'filter=validated' to all requests.
    """
    collected_transactions = []
    current_params = initial_params.copy() if initial_params else {}
    # Ensure items_count and filter are set for the first request
    current_params["items_count"] = ITEMS_PER_PAGE 
    current_params["filter"] = FILTER_VALIDATED
    
    page_num = 1
    stop_fetching_due_to_timestamp = False

    print(f"Starting transaction collection from {endpoint_url}.")
    print(f"Will stop if a transaction timestamp starts with '{stop_timestamp_prefix}' or after {MAX_PAGES_TO_FETCH} pages.")
    print(f"Applying filter: '{FILTER_VALIDATED}' to all requests.")

    while page_num <= MAX_PAGES_TO_FETCH:
        # Construct a string for logging current parameters
        param_log_parts = []
        if 'block_number' in current_params: 
             param_log_parts.append(f"block_number={current_params['block_number']}")
        if 'index' in current_params:
            param_log_parts.append(f"index={current_params['index']}")
        # filter and items_count are expected to always be in current_params
        param_log_parts.append(f"filter={current_params['filter']}")
        param_log_parts.append(f"items_count={current_params['items_count']}")
        param_summary_log = ", ".join(param_log_parts)
        
        print(f"  Fetching page {page_num}, params: ({param_summary_log})...")
        
        response_obj = None 
        try:
            response_obj = requests.get(endpoint_url, params=current_params, timeout=REQUEST_TIMEOUT)
            response_obj.raise_for_status() 
            data = response_obj.json()
        except requests.exceptions.Timeout:
            print(f"  Timeout while fetching page {page_num}. Params: {current_params}.")
            break 
        except requests.exceptions.RequestException as e:
            err_msg = f"  Request error on page {page_num}. Params: {current_params}. Error: {e}"
            if response_obj is not None:
                 err_msg += f" Response text (first 200 chars): {response_obj.text[:200]}"
            print(err_msg)
            break
        except json.JSONDecodeError as e:
            response_text = response_obj.text if response_obj is not None else "[No response object]"
            print(f"  JSON decode error on page {page_num}. Response text: {response_text[:200]}... Error: {e}")
            break
        
        current_page_transactions = data.get('items')
        if not current_page_transactions:
            print(f"  No transactions returned on page {page_num}. Assuming end of available data.")
            break

        print(f"  Fetched {len(current_page_transactions)} transactions on page {page_num}.")

        for tx in current_page_transactions:
            timestamp = tx.get('timestamp')
            if timestamp and stop_timestamp_prefix and timestamp.startswith(stop_timestamp_prefix):
                print(f"    Transaction with hash {tx.get('hash')} (timestamp: {timestamp}) matches stop prefix '{stop_timestamp_prefix}'. Stopping collection.")
                stop_fetching_due_to_timestamp = True
                break 
            
            collected_transactions.append(tx)
        
        if stop_fetching_due_to_timestamp:
            print("  Cutoff timestamp reached. Finishing transaction collection.")
            break

        next_page_params_from_api = data.get('next_page_params')
        if next_page_params_from_api:
            current_params = dict(next_page_params_from_api) 
            # block_number and items_count from next_page_params_from_api are now used directly.
            
            # Ensure our standard filter is always applied/enforced for the next request.
            current_params['filter'] = FILTER_VALIDATED
            
            page_num += 1
        else:
            print(f"  No 'next_page_params' received from API after page {page_num}. Assuming end of all transactions.")
            break
            
    if page_num > MAX_PAGES_TO_FETCH and not stop_fetching_due_to_timestamp:
        print(f"  Reached max pages limit ({MAX_PAGES_TO_FETCH}).")

    print(f"Finished fetching. Collected {len(collected_transactions)} transactions in total.")
    
    if collected_transactions:
        first_tx = collected_transactions[0]
        last_tx = collected_transactions[-1]
        print(f"  Timestamp of first collected transaction: {first_tx.get('timestamp')} (Hash: {first_tx.get('hash')})")
        print(f"  Timestamp of last collected transaction: {last_tx.get('timestamp')} (Hash: {last_tx.get('hash')})")
    
    return collected_transactions

def get_db_connection():
    """Establishes a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to PostgreSQL: {e}", file=sys.stderr)
        sys.exit(1)

def clear_table(conn, table_name):
    """Clears all data from the specified table if it exists and has data."""
    try:
        with conn.cursor() as cur:
            # First check if table exists and has data
            cur.execute(f"""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = %s
                );
            """, (table_name,))
            table_exists = cur.fetchone()[0]
            
            if not table_exists:
                print(f"Table '{table_name}' does not exist yet. Will be created during import.")
                return
            
            # Check if table has data
            cur.execute(f'SELECT COUNT(*) FROM "{table_name}";')
            count = cur.fetchone()[0]
            
            if count > 0:
                print(f"Found {count} existing records in table '{table_name}'. Clearing data...")
                cur.execute(f'TRUNCATE TABLE "{table_name}" CASCADE;')
                conn.commit()
                print(f"Successfully cleared {count} records from table '{table_name}'.")
            else:
                print(f"Table '{table_name}' exists but is empty. No need to clear.")
                
    except psycopg2.Error as e:
        print(f"Error checking/clearing table '{table_name}': {e}", file=sys.stderr)
        conn.rollback()
        sys.exit(1)

def get_sql_type_for_value(name, value):
    """Determine the appropriate PostgreSQL type for a given Python value and column name."""
    if name == "timestamp":
        return "TIMESTAMP WITH TIME ZONE"
    if value is None:
        return "TEXT"  # Default to TEXT for NULL values
    elif isinstance(value, (dict, list)):
        return "JSONB"
    elif isinstance(value, bool):
        return "BOOLEAN"
    elif isinstance(value, int):
        return "BIGINT"
    elif isinstance(value, float):
        return "DOUBLE PRECISION"
    else:
        return "TEXT"  # Default to TEXT for strings and other types

def create_table_if_not_exists(conn, table_name, schema_definitions):
    """Creates the table if it doesn't exist."""
    if not schema_definitions:
        print("Error: No schema definitions provided for table creation.", file=sys.stderr)
        if conn:
            conn.close()
        sys.exit(1)

    # Create column definitions with proper quoting and types
    column_definitions = []
    for name, sql_type in schema_definitions:
        safe_name = name.replace('"', '""')
        column_definitions.append(f'"{safe_name}" {sql_type}')
    
    columns_sql = ", ".join(column_definitions)
    safe_table_name = table_name.replace('"', '""')
    
    create_table_sql = f"""
    CREATE TABLE IF NOT EXISTS "{safe_table_name}" (
        {columns_sql}
    );
    """
    
    try:
        with conn.cursor() as cur:
            cur.execute(create_table_sql)
        conn.commit()
        print(f"Table '{table_name}' checked/created successfully.")
    except psycopg2.Error as e:
        print(f"Error creating table '{table_name}': {e}", file=sys.stderr)
        conn.rollback()
        if conn:
            conn.close()
        sys.exit(1)

def get_schema_definitions_from_first_object(transactions):
    """Determines column names and their types from the first transaction object."""
    if not transactions:
        print("Error: No transactions provided for schema definition.", file=sys.stderr)
        sys.exit(1)
    
    first_obj = transactions[0]
    if not isinstance(first_obj, dict):
        print("Error: First transaction is not a JSON object.", file=sys.stderr)
        sys.exit(1)
    
    return [(name, get_sql_type_for_value(name, value)) for name, value in first_obj.items()]

def prepare_value_for_sql(value, column_name, column_type):
    """
    Prepare a Python value for SQL insertion based on its target PostgreSQL type.
    Handles JSONB serialization and logs conversions or issues.
    """
    if value is None:
        return None
    
    if column_type == "JSONB":
        if isinstance(value, (dict, list)):
            return json.dumps(value)
        else:
            # Convert non-dict/list values to a JSON representation (e.g., a JSON string or number)
            # print(f"Info: Column '{column_name}' is JSONB, auto-converting non-dict/list value to JSON: {value}", file=sys.stderr)
            return json.dumps(value) # This will store "string" as "\"string\"", 123 as "123" etc.
    
    if isinstance(value, (dict, list)):
        # This value is a dict/list but the column is not JSONB.
        if column_type == "TEXT":
            print(f"Warning: Column '{column_name}' is TEXT, serializing dict/list value to JSON string: {value}", file=sys.stderr)
            return json.dumps(value)
        else:
            print(f"Error: Column '{column_name}' is {column_type} but received dict/list value: {value}. Storing as NULL.", file=sys.stderr)
            return None
            
    return value

def main():
    print("Starting transaction import process...")
    
    # Fetch transactions from Blockscout
    transactions = fetch_transactions_until_timestamp(
        endpoint_url=BLOCK_SCOUT_URL,
        stop_timestamp_prefix=UNTIL_TIMESTAMP
    )
    
    if not transactions:
        print("No transactions found to import.")
        sys.exit(0)
    
    # Database operations
    conn = get_db_connection()
    try:
        # Clear existing data first
        clear_table(conn, TABLE_NAME)
        
        # Get schema definitions and create table
        schema_definitions = get_schema_definitions_from_first_object(transactions)
        create_table_if_not_exists(conn, TABLE_NAME, schema_definitions)
        
        # Prepare column names string and placeholders for SQL insert statement once
        column_names_sql = ", ".join(f'"{name}"' for name, _ in schema_definitions)
        placeholders_sql = ", ".join(['%s'] * len(schema_definitions))
        insert_sql_template = f'INSERT INTO "{TABLE_NAME}" ({column_names_sql}) VALUES ({placeholders_sql})'
        
        inserted_count = 0
        error_count = 0

        # Import data to database
        with conn.cursor() as cur:
            for i, transaction_dict in enumerate(transactions, 1):
                values_for_insert = []
                valid_transaction = True
                for col_name, col_type in schema_definitions:
                    raw_value = transaction_dict.get(col_name) 
                    prepared_value = prepare_value_for_sql(raw_value, col_name, col_type)
                    
                    # Check if prepare_value_for_sql returned None due to an error for a non-JSONB column
                    if prepared_value is None and raw_value is not None and \
                       isinstance(raw_value, (dict, list)) and \
                       col_type not in ["JSONB", "TEXT"]:
                        # This indicates an error was logged by prepare_value_for_sql
                        # and None was returned to prevent bad data insertion.
                        # We might want to skip this transaction or handle it specifically.
                        # For now, we mark it as invalid to skip.
                        print(f"Error: Transaction at index {i-1} has incompatible type for column '{col_name}' ({col_type}). Skipping transaction.", file=sys.stderr)
                        valid_transaction = False
                        break 
                    values_for_insert.append(prepared_value)
                
                if not valid_transaction:
                    error_count += 1
                    conn.rollback() # Rollback any potential partial execution for this transaction if any
                    continue

                try:
                    cur.execute(insert_sql_template, values_for_insert)
                    inserted_count += 1
                except psycopg2.Error as db_err:
                    print(f"Database error inserting transaction at index {i-1}: {db_err}", file=sys.stderr)
                    # Log problematic data for debugging (first few keys)
                    problematic_keys = list(transaction_dict.keys())[:5]
                    problematic_data_preview = {k: transaction_dict.get(k) for k in problematic_keys}
                    print(f"Problematic transaction data preview: {problematic_data_preview}", file=sys.stderr)
                    print(f"Schema for this insert: {schema_definitions}", file=sys.stderr)
                    print(f"Values attempted: {values_for_insert}", file=sys.stderr)
                    conn.rollback() 
                    error_count += 1
                    continue 
                
                if inserted_count > 0 and inserted_count % 1000 == 0:
                    conn.commit()
                    print(f"Committed {inserted_count} transactions...")
        
        conn.commit() # Commit any remaining transactions
        print(f"Successfully imported {inserted_count} transactions to database.")
        if error_count > 0:
            print(f"{error_count} transactions were skipped due to errors.")
        
    except Exception as e:
        print(f"Error during database operations: {e}")
        conn.rollback()
        sys.exit(1)
    finally:
        conn.close()
    
    print("Process completed successfully!")

if __name__ == "__main__":
    main() 