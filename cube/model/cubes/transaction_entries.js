cube(`transaction_entries`, {
  sql_table: `public.transaction_entries`,
  
  data_source: `default`,
  
  joins: {
    
  },
  
  dimensions: {
    from: {
      sql: `from`,
      type: `string`
    },
    
    confirmation_duration: {
      sql: `confirmation_duration`,
      type: `string`
    },
    
    to: {
      sql: `to`,
      type: `string`
    },
    
    authorization_list: {
      sql: `authorization_list`,
      type: `string`
    },
    
    transaction_types: {
      sql: `transaction_types`,
      type: `string`
    },
    
    fee: {
      sql: `fee`,
      type: `string`
    },
    
    actions: {
      sql: `actions`,
      type: `string`
    },
    
    gas_used: {
      sql: `gas_used`,
      type: `string`
    },
    
    status: {
      sql: `status`,
      type: `string`
    },
    
    method: {
      sql: `method`,
      type: `string`
    },
    
    gas_limit: {
      sql: `gas_limit`,
      type: `string`
    },
    
    gas_price: {
      sql: `gas_price`,
      type: `string`
    },
    
    decoded_input: {
      sql: `decoded_input`,
      type: `string`
    },
    
    token_transfers: {
      sql: `token_transfers`,
      type: `string`
    },
    
    base_fee_per_gas: {
      sql: `base_fee_per_gas`,
      type: `string`
    },
    
    timestamp: {
      sql: `timestamp`,
      type: `string`
    },
    
    historic_exchange_rate: {
      sql: `historic_exchange_rate`,
      type: `string`
    },
    
    exchange_rate: {
      sql: `exchange_rate`,
      type: `string`
    },
    
    priority_fee: {
      sql: `priority_fee`,
      type: `string`
    },
    
    has_error_in_internal_transactions: {
      sql: `has_error_in_internal_transactions`,
      type: `string`
    },
    
    raw_input: {
      sql: `raw_input`,
      type: `string`
    },
    
    result: {
      sql: `result`,
      type: `string`
    },
    
    hash: {
      sql: `hash`,
      type: `string`
    },
    
    max_fee_per_gas: {
      sql: `max_fee_per_gas`,
      type: `string`
    },
    
    revert_reason: {
      sql: `revert_reason`,
      type: `string`
    },
    
    transaction_burnt_fee: {
      sql: `transaction_burnt_fee`,
      type: `string`
    },
    
    token_transfers_overflow: {
      sql: `token_transfers_overflow`,
      type: `string`
    },
    
    max_priority_fee_per_gas: {
      sql: `max_priority_fee_per_gas`,
      type: `string`
    },
    
    transaction_tag: {
      sql: `transaction_tag`,
      type: `string`
    },
    
    created_contract: {
      sql: `created_contract`,
      type: `string`
    },
    
    value: {
      sql: `value`,
      type: `string`
    }
  },
  
  measures: {
    count: {
      type: `count`
    },
    
    block_number: {
      sql: `block_number`,
      type: `sum`
    }
  },
  
  pre_aggregations: {
    // Pre-aggregation definitions go here.
    // Learn more in the documentation: https://cube.dev/docs/caching/pre-aggregations/getting-started
  }
});
