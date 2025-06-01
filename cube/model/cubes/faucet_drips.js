cube(`faucet_drips`, {
  sql: `
    SELECT
      t.timestamp,
      t.value
    FROM ${transaction_entries.sql()} t
    WHERE (t.from::jsonb->>'hash') = '0x88250F772101179a4EcfAA4b92a983676a3cE445'
  `,

  dimensions: {
    drip_date: {
      sql: `DATE_TRUNC('day', timestamp)`,
      type: `time`
    },

    drip_month: {
      sql: `DATE_TRUNC('month', timestamp)`,
      type: `time`
    },

    drip_hour: {
      sql: `DATE_TRUNC('hour', timestamp)`,
      type: `time`
    }
  },

  measures: {
    count: {
      type: `count`
    },
    total_amount_dripped: {
      sql: `value::numeric / 1000000000000000000.0`,
      type: `sum`
    }
  },

  preAggregations: {
    // Pre-aggregation definition can be added here if needed for performance
    main: {
      type: `originalSql`
    }
  }
}); 