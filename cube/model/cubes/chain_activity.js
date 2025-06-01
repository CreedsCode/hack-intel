cube(`chain_activity`, {
  sql: `
    SELECT
      t.timestamp,
      t.created_contract,
      t.transaction_types,
      t.token_transfers,
      (t.from::jsonb->>'hash') as from_address_hash,
      CASE
        WHEN t.created_contract IS NOT NULL THEN 'deployment'
        WHEN (COALESCE(t.transaction_types::jsonb, '[]'::jsonb) @> '["contract_call"]'::jsonb) THEN 'call'
        WHEN COALESCE(jsonb_array_length(t.token_transfers::jsonb), 0) > 0 THEN 'transfer'
        ELSE 'other'
      END as activity_category_value,
      ROW_NUMBER() OVER (PARTITION BY (t.from::jsonb->>'hash') ORDER BY t.timestamp ASC) as from_address_occurrence_rank
    FROM ${transaction_entries.sql()} t
  `,

  dimensions: {
    activity_date: {
      sql: `DATE_TRUNC('day', timestamp)`,
      type: `time`
    },
    activity_month: {
      sql: `DATE_TRUNC('month', timestamp)`,
      type: `time`
    },
    activity_hour: {
      sql: `DATE_TRUNC('hour', timestamp)`,
      type: `time`
    },
    activity_type: {
      sql: `activity_category_value`,
      type: `string`
    },
    from_address: {
      sql: `from_address_hash`,
      type: `string`
    }
  },

  measures: {
    event_count: {
      type: `count`
    },
    new_wallets_count: {
      sql: `from_address_hash`,
      type: `countDistinct`,
      filters: [
        { sql: `${CUBE}.from_address_occurrence_rank = 1` }
      ]
    }
  },

  preAggregations: {
    main: {
      type: `originalSql`
    }
  }
}); 