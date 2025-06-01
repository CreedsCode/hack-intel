cube(`post_submission_deployments`, {
  sql: `
    SELECT 
      t.timestamp,
      CASE 
        WHEN t.created_contract::jsonb->>'is_verified' = 'true' THEN true
        ELSE false
      END as is_verified
    FROM ${transaction_entries.sql()} t
    WHERE t.created_contract IS NOT NULL
      AND t.timestamp > '2024-01-01 00:00:00+00' -- IMPORTANT: Update this placeholder with your actual submission timestamp
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

    deployment_hour: {
      sql: `DATE_TRUNC('hour', timestamp)`,
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
  },

  preAggregations: {
    main: {
      type: `originalSql`
    }
  }
}); 