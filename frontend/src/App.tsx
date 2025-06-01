import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CubeProvider } from '@cubejs-client/react';
import cube, { PivotConfig, Query } from '@cubejs-client/core';
import WebSocketTransport from '@cubejs-client/ws-transport';
import { ChartViewer } from './ChartViewer.tsx';
import { extractHashConfig } from './config.ts';
import { QueryRenderer } from './QueryRenderer.tsx';
import { ChartType, Config } from './types.ts';
import { LandingPage } from './components/LandingPage';

const CONFIG = {
  query: {
    dimensions: [
      'contract_deployments_view.is_verified',
      'contract_deployments_view.deployment_date',
    ],
    measures: ['contract_deployments_view.count'],
  } as Query,
  pivotConfig: {
    x: ['contract_deployments_view.is_verified', 'measures'],
    y: ['contract_deployments_view.deployment_date'],
    fillMissingDates: true,
    joinDateRange: false,
  } as PivotConfig,
  chartType: 'area' as ChartType,
};

// Configuration for the new Faucet Drips chart
const FAUCET_DRIPS_CONFIG = {
  query: {
    dimensions: ["faucet_drips.drip_hour"],
    measures: ["faucet_drips.count", "faucet_drips.total_amount_dripped"],
    order: { "faucet_drips.drip_hour": "desc" }
  } as Query,
  pivotConfig: {
    x: ["faucet_drips.drip_hour"],
    y: ["measures"],
    fillMissingDates: true,
    joinDateRange: false
  } as PivotConfig,
  chartType: 'line' as ChartType,
};

// Configuration for the new Chain Activity chart
const CHAIN_ACTIVITY_CONFIG = {
  query: {
    dimensions: ["chain_activity.activity_hour", "chain_activity.activity_type"],
    timeDimensions: [],
    measures: ["chain_activity.new_wallets_count", "chain_activity.event_count"],
  } as Query,
  pivotConfig: {
    x: ["chain_activity.activity_hour", "chain_activity.activity_type"],
    y: ["measures"],
    fillMissingDates: true,
    joinDateRange: false
  } as PivotConfig,
  chartType: 'line' as ChartType, // Defaulting to line chart
};

// Configuration for the Post Submission Deployments chart
const POST_SUBMISSION_DEPLOYMENTS_CONFIG = {
  query: {
    timeDimensions: [{ dimension: "post_submission_deployments.deployment_hour", granularity: "hour" }],
    dimensions: [],
    measures: ["post_submission_deployments.count"],
  } as Query,
  pivotConfig: {
    x: ["post_submission_deployments.deployment_hour.hour"],
    y: ["measures"],
    fillMissingDates: true,
    joinDateRange: false
  } as PivotConfig,
  chartType: 'bar' as ChartType, // Defaulting to bar chart for this one
};

// Query for the Total Hackers metric
const TOTAL_HACKERS_QUERY = {
  measures: ["unique_wallets.total_unique_address_count"],
  dimensions: [], // Ensure dimensions is always an array even if empty
} as Query;

// Query for Total Contract Deployments
const TOTAL_CONTRACTS_DEPLOYED_QUERY = {
  measures: ["chain_activity.event_count"],
  filters: [{
    member: "chain_activity.activity_type",
    operator: "equals",
    values: ["deployment"]
  }],
  dimensions: [], // Ensure dimensions is always an array even if empty
} as Query;

// Query for Peak Activity Time
const PEAK_ACTIVITY_QUERY = {
  timeDimensions: [{
    dimension: "peak_activity_time.activity_hour",
    granularity: "hour"
  }],
  measures: ["peak_activity_time.transaction_count"], // Used for ordering
  order: { "peak_activity_time.transaction_count": "desc" },
  limit: 1
} as Query;

// Query for Total Gas Spent
const TOTAL_GAS_SPENT_QUERY = {
  measures: ["total_gas_spent.total_gas_in_native_token"],
  dimensions: [], // Ensure dimensions is always an array
} as Query;

function Dashboard() {
  const { apiUrl, apiToken, useWebSockets, useSubscription } = extractHashConfig({
    apiUrl: import.meta.env.VITE_CUBE_API_URL || '',
    apiToken: import.meta.env.VITE_CUBE_API_TOKEN || '',
    useWebSockets: import.meta.env.VITE_CUBE_API_USE_WEBSOCKETS === 'true',
    useSubscription: import.meta.env.VITE_CUBE_API_USE_SUBSCRIPTION === 'true',
  } as Config);

  let transport = undefined;
  if (useWebSockets) {
    transport = new WebSocketTransport({ authorization: apiToken, apiUrl });
  }

  const cubeApi = cube(apiToken, { apiUrl, transport });

  return (
    <CubeProvider cubeApi={cubeApi}>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">HackVision Analytics</h1>
                <p className="mt-1 text-sm text-gray-400">Real-time Hackathon Insights</p>
              </div>
              <Link to="/" className="text-gray-300 hover:text-white transition">
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Hackers Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-indigo-500/10">
                  <svg className="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-300">Total Hackers</h2>
                  <QueryRenderer query={TOTAL_HACKERS_QUERY} subscribe={useSubscription}>
                    {({ resultSet, isLoading, error }) => {
                      if (isLoading) return <p className="mt-2 text-3xl font-bold text-white">...</p>;
                      if (error) return <p className="mt-2 text-3xl font-bold text-red-500">Error</p>;
                      if (!resultSet) return <p className="mt-2 text-3xl font-bold text-white">N/A</p>;
                      const measureName = TOTAL_HACKERS_QUERY.measures?.[0];
                      const count = measureName ? resultSet.tablePivot()[0]?.[measureName] || 0 : 0;
                      return <p className="mt-2 text-3xl font-bold text-white">{count.toLocaleString()}</p>;
                    }}
                  </QueryRenderer>
                </div>
              </div>
            </div>

            {/* Total Contract Deployments Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-300">Contract Deployments</h2>
                  <QueryRenderer query={TOTAL_CONTRACTS_DEPLOYED_QUERY} subscribe={useSubscription}>
                    {({ resultSet, isLoading, error }) => {
                      if (isLoading) return <p className="mt-2 text-3xl font-bold text-white">...</p>;
                      if (error) return <p className="mt-2 text-3xl font-bold text-red-500">Error</p>;
                      if (!resultSet) return <p className="mt-2 text-3xl font-bold text-white">N/A</p>;
                      const measureName = TOTAL_CONTRACTS_DEPLOYED_QUERY.measures?.[0];
                      const count = measureName ? resultSet.tablePivot()[0]?.[measureName] || 0 : 0;
                      return <p className="mt-2 text-3xl font-bold text-white">{count.toLocaleString()}</p>;
                    }}
                  </QueryRenderer>
                </div>
              </div>
            </div>

            {/* Peak Activity Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-300">Peak Activity</h2>
                  <QueryRenderer query={PEAK_ACTIVITY_QUERY} subscribe={useSubscription}>
                    {({ resultSet, isLoading, error }) => {
                      if (isLoading) return <p className="mt-2 text-3xl font-bold text-white">...</p>;
                      if (error) return <p className="mt-2 text-3xl font-bold text-red-500">Error</p>;
                      if (!resultSet || resultSet.tablePivot().length === 0) return <p className="mt-2 text-3xl font-bold text-white">N/A</p>;
                      const peakRecord = resultSet.tablePivot()[0];
                      const peakTimestamp = peakRecord["peak_activity_time.activity_hour.hour"];
                      if (!peakTimestamp) return <p className="mt-2 text-3xl font-bold text-white">No data</p>;
                      const formattedPeakTime = new Date(peakTimestamp as string).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        hour12: true
                      });
                      return <p className="mt-2 text-2xl font-bold text-white">{formattedPeakTime}</p>;
                    }}
                  </QueryRenderer>
                </div>
              </div>
            </div>

            {/* Total Gas Spent Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-300">Gas Spent (tRBTC)</h2>
                  <QueryRenderer query={TOTAL_GAS_SPENT_QUERY} subscribe={useSubscription}>
                    {({ resultSet, isLoading, error }) => {
                      if (isLoading) return <p className="mt-2 text-3xl font-bold text-white">...</p>;
                      if (error) return <p className="mt-2 text-3xl font-bold text-red-500">Error</p>;
                      if (!resultSet || resultSet.tablePivot().length === 0) return <p className="mt-2 text-3xl font-bold text-white">N/A</p>;
                      const measureName = TOTAL_GAS_SPENT_QUERY.measures?.[0];
                      const gasSpent = measureName ? resultSet.tablePivot()[0]?.[measureName] : null;
                      if (gasSpent === null || typeof gasSpent === 'undefined') return <p className="mt-2 text-3xl font-bold text-white">No data</p>;
                      return <p className="mt-2 text-3xl font-bold text-white">{Number(gasSpent).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</p>;
                    }}
                  </QueryRenderer>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-8">
            {/* First Row - Full Width Charts */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-medium text-white mb-6">Contract Deployment vs Verification</h3>
              <div className="h-96">
                <QueryRenderer query={CONFIG.query} subscribe={useSubscription}>
                  {({ resultSet, isLoading, error }) => {
                    if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>;
                    if (error) return <div className="flex items-center justify-center h-full text-red-500">Error: {error.toString()}</div>;
                    if (!resultSet) return <div className="flex items-center justify-center h-full text-gray-400">No data available</div>;
                    return (
                      <ChartViewer
                        chartType={CONFIG.chartType}
                        resultSet={resultSet}
                        pivotConfig={CONFIG.pivotConfig}
                        legendLabels={['Unverified', 'Verified']}
                        title="Contract Deployment vs Verification"
                        xLabel="Verification Status & Date"
                        yLabel="Count"
                      />
                    );
                  }}
                </QueryRenderer>
              </div>
            </div>

            {/* Second Row - Two Column Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Faucet Drips Chart */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-medium text-white mb-6">Hourly Faucet Drips</h3>
                <div className="h-96">
                  <QueryRenderer query={FAUCET_DRIPS_CONFIG.query} subscribe={useSubscription}>
                    {({ resultSet, isLoading, error }) => {
                      if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>;
                      if (error) return <div className="flex items-center justify-center h-full text-red-500">Error: {error.toString()}</div>;
                      if (!resultSet) return <div className="flex items-center justify-center h-full text-gray-400">No data available</div>;
                      return (
                        <ChartViewer
                          chartType={FAUCET_DRIPS_CONFIG.chartType}
                          resultSet={resultSet}
                          pivotConfig={FAUCET_DRIPS_CONFIG.pivotConfig}
                          legendLabels={["Drip Count", "Total Amount Dripped"]}
                          title="Hourly Faucet Drips"
                          xLabel="Hour of Drip"
                          yLabel="Value"
                        />
                      );
                    }}
                  </QueryRenderer>
                </div>
              </div>

              {/* Chain Activity Chart */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-medium text-white mb-6">Chain Activity by Type</h3>
                <div className="h-96">
                  <QueryRenderer query={CHAIN_ACTIVITY_CONFIG.query} subscribe={useSubscription}>
                    {({ resultSet, isLoading, error }) => {
                      if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>;
                      if (error) return <div className="flex items-center justify-center h-full text-red-500">Error: {error.toString()}</div>;
                      if (!resultSet) return <div className="flex items-center justify-center h-full text-gray-400">No data available</div>;
                      return (
                        <ChartViewer
                          chartType={CHAIN_ACTIVITY_CONFIG.chartType}
                          resultSet={resultSet}
                          pivotConfig={CHAIN_ACTIVITY_CONFIG.pivotConfig}
                          legendLabels={["New Wallets", "Event Count"]}
                          title="Chain Activity by Type"
                          xLabel="Hour & Type of Activity"
                          yLabel="Count"
                        />
                      );
                    }}
                  </QueryRenderer>
                </div>
              </div>
            </div>

            {/* Third Row - Full Width Chart */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-medium text-white mb-6">Hourly Post-Submission Deployments</h3>
              <div className="h-96">
                <QueryRenderer query={POST_SUBMISSION_DEPLOYMENTS_CONFIG.query} subscribe={useSubscription}>
                  {({ resultSet, isLoading, error }) => {
                    if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>;
                    if (error) return <div className="flex items-center justify-center h-full text-red-500">Error: {error.toString()}</div>;
                    if (!resultSet) return <div className="flex items-center justify-center h-full text-gray-400">No data available</div>;
                    return (
                      <ChartViewer
                        chartType={POST_SUBMISSION_DEPLOYMENTS_CONFIG.chartType}
                        resultSet={resultSet}
                        pivotConfig={POST_SUBMISSION_DEPLOYMENTS_CONFIG.pivotConfig}
                        legendLabels={["Deployment Count"]}
                        title="Hourly Post-Submission Deployments"
                        xLabel="Hour of Deployment"
                        yLabel="Count"
                      />
                    );
                  }}
                </QueryRenderer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CubeProvider>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
