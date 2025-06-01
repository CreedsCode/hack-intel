cube(`total_gas_spent`, {
  sql: `
    SELECT 
      t.timestamp,
      (t.fee::jsonb->>'value')::numeric / 1000000000000000000.0 as gas_spent_native_token
    FROM ${transaction_entries.sql()} t
    WHERE t.fee IS NOT NULL AND (t.fee::jsonb->>'value') IS NOT NULL -- Ensure fee and its value exist
  `,

  dimensions: {
    gas_spent_date: {
      sql: `DATE_TRUNC('day', timestamp)`,
      type: `time`
    },
    gas_spent_month: {
      sql: `DATE_TRUNC('month', timestamp)`,
      type: `time`
    },
    gas_spent_hour: {
      sql: `DATE_TRUNC('hour', timestamp)`,
      type: `time`
    }
  },

  measures: {
    total_gas_in_native_token: {
      sql: `gas_spent_native_token`,
      type: `sum`
    }
  },

  preAggregations: {
    main: {
      type: `originalSql`
    }
  }
}); 