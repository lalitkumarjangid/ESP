'use client';

interface ReceivingChainProps {
  chain: {
    server: string;
    ip?: string;
    timestamp?: string;
    position?: number;
  }[];
}

export const ReceivingChain = ({ chain }: ReceivingChainProps) => {
  if (!chain || chain.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Receiving Chain</h3>
        <div className="text-sm text-gray-500 text-center py-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-xl">🔗</span>
          </div>
          <p>No receiving chain information available</p>
          <p className="text-xs mt-1">This email may not have detailed routing headers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <span className="mr-2">🔗</span>
        Receiving Chain ({chain.length} servers)
      </h3>
      
      <div className="space-y-3">
        {chain.map((hop, index) => (
          <div key={index} className="flex items-start space-x-3">
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              {index < chain.length - 1 && (
                <div className="w-0.5 h-6 bg-gray-300 mt-1"></div>
              )}
            </div>
            
            {/* Server details */}
            <div className="flex-1 bg-white border border-gray-200 rounded-md p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-black">{hop.server}</span>
                <span className="text-xs text-gray-500">
                  {index === 0 ? 'Origin' : index === chain.length - 1 ? 'Destination' : 'Relay'}
                </span>
              </div>
              
              {hop.ip && (
                <div className="text-xs text-gray-600 mb-1">
                  <span className="font-medium">IP:</span> {hop.ip}
                </div>
              )}
              
              {hop.timestamp && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Time:</span> {hop.timestamp}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Total hops: {chain.length}</span>
          <span>Path: Sender → {chain.length > 2 ? `${chain.length - 2} relays →` : ''} Receiver</span>
        </div>
      </div>
    </div>
  );
};
