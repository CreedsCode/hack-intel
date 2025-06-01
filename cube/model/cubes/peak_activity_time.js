cube(`peak_activity_time`, {
  sql: `
    SELECT 
      t.timestamp
    FROM ${transaction_entries.sql()} t
  `,

  dimensions: {
    activity_timestamp_raw: {
      sql: `timestamp`,
      type: `time`
    },
    activity_minute: {
      sql: `DATE_TRUNC('minute', timestamp)`,
      type: `time`
    },
    activity_hour: {
      sql: `DATE_TRUNC('hour', timestamp)`,
      type: `time`
    },
    activity_day: {
      sql: `DATE_TRUNC('day', timestamp)`,
      type: `time`
    }
  },

  measures: {
    transaction_count: {
      type: `count`
    }
  },

  preAggregations: {
    main: {
      type: `originalSql`
    }
  }
}); 