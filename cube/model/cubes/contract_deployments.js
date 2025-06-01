cube(`contract_deployments`, {
  sql: `
    SELECT 
      t.timestamp,
      CASE 
        WHEN t.created_contract::jsonb->>'is_verified' = 'true' THEN true
        ELSE false
      END as is_verified
    FROM ${transaction_entries.sql()} t
    WHERE t.created_contract IS NOT NULL
  `,

  dimensions: {
    deployment_date: {
      sql: `DATE_TRUNC('day', timestamp)`,
      type: `time`
    },

    deployment_month: {
      sql: `DATE_TRUNC('month', timestamp)`,
      type: `time`
    },

    is_verified: {
      sql: `is_verified`,
      type: `boolean`
    }
  },

  measures: {
    count: {
      type: `count`
    }
  }
}); 