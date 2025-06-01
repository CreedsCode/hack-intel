cube(`unique_wallets`, {
  sql: `
    SELECT 
      t.timestamp,
      (t.from::jsonb->>'hash') as from_address_hash
    FROM ${transaction_entries.sql()} t
    WHERE (t.from::jsonb->>'hash') IS NOT NULL -- Ensure we count actual addresses
  `,

  dimensions: {
    from_address: {
      sql: `from_address_hash`,
      type: `string`,
      primaryKey: true // Good practice for dimensions used in distinct counts
    },
    observation_date: {
      sql: `DATE_TRUNC('day', timestamp)`,
      type: `time`
    }
  },

  measures: {
    total_unique_address_count: {
      sql: `from_address_hash`,
      type: `countDistinct`
    }
  },

  preAggregations: {
    main: {
      type: `originalSql`
    }
  }
}); 