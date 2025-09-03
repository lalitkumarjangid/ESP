'use client';

import { EmailResponse } from '@/lib/api';

interface AnalyticsDashboardProps {
  emails: EmailResponse[];
  loading: boolean;
}

export const AnalyticsDashboard = ({ emails, loading }: AnalyticsDashboardProps) => {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-black">Analytics Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Loading analytics data...</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black"></div>
            <span className="ml-3 text-gray-600 font-medium">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate ESP distribution
  const espDistribution = emails.reduce((acc, email) => {
    acc[email.espType] = (acc[email.espType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate server statistics
  const serverStats = emails.reduce((acc, email) => {
    const serverCount = email.receivingChain.length;
    acc.totalServers += serverCount;
    acc.maxServers = Math.max(acc.maxServers, serverCount);
    acc.minServers = serverCount > 0 ? Math.min(acc.minServers, serverCount) : acc.minServers;
    return acc;
  }, { totalServers: 0, maxServers: 0, minServers: Infinity });

  const avgServersPerEmail = emails.length > 0 ? (serverStats.totalServers / emails.length).toFixed(1) : '0';

  // Calculate processing time statistics
  const processingTimes = emails
    .map(email => email.metadata?.processingTime)
    .filter(time => time !== undefined) as number[];
  
  const avgProcessingTime = processingTimes.length > 0 
    ? (processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length).toFixed(0)
    : '0';

  // Recent activity (last 10 emails)
  const recentEmails = emails.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* ESP Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-black">ESP Distribution</h3>
          <p className="text-sm text-gray-600 mt-1">Email Service Provider breakdown</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(espDistribution).map(([esp, count]) => {
              const percentage = ((count / emails.length) * 100).toFixed(1);
              return (
                <div key={esp} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-black">{esp}</span>
                    <span className="text-sm text-gray-600">{count} emails</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Server Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-black">Server Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Receiving chain statistics</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Servers per Email:</span>
              <span className="font-medium text-black">{avgServersPerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Maximum Servers:</span>
              <span className="font-medium text-black">{serverStats.maxServers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Minimum Servers:</span>
              <span className="font-medium text-black">
                {serverStats.minServers === Infinity ? 0 : serverStats.minServers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Servers Tracked:</span>
              <span className="font-medium text-black">{serverStats.totalServers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-black">Performance Metrics</h3>
            <p className="text-sm text-gray-600 mt-1">Processing performance data</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Processing Time:</span>
              <span className="font-medium text-black">{avgProcessingTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Emails Processed:</span>
              <span className="font-medium text-black">{emails.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Successful ESP Detection:</span>
              <span className="font-medium text-black">
                {emails.filter(e => e.espType !== 'Unknown ESP').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate:</span>
              <span className="font-medium text-black">
                {emails.length > 0 
                  ? ((emails.filter(e => e.espType !== 'Unknown ESP').length / emails.length) * 100).toFixed(1)
                  : '0'
                }%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-black">Recent Activity</h3>
          <p className="text-sm text-gray-600 mt-1">Latest processed emails</p>
        </div>
        <div className="p-6">
          {recentEmails.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent activity to display
            </div>
          ) : (
            <div className="space-y-3">
              {recentEmails.map((email, index) => (
                <div key={email.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-black truncate">{email.subject}</div>
                    <div className="text-sm text-gray-600">
                      {email.senderEmail} • {email.receivingChain.length} servers
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-black">{email.espType}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(email.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
