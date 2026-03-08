import React from 'react';
import { motion } from 'framer-motion';
import { Link, Hash, User, Activity } from 'lucide-react';
import type { EntityAuditLog } from '../../types';

interface Props {
  logs: EntityAuditLog[];
}

export const AuditTrail: React.FC<Props> = ({ logs }) => {
  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5d768b' }}>
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Zero Trust Audit Trail</h3>
          <p className="text-sm text-gray-500">Cryptographically verified chain &bull; {logs.length} entries</p>
        </div>
      </div>

      <div className="space-y-0">
        {logs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className="relative"
          >
            {/* Timeline connector */}
            {index < logs.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent" />
            )}

            <div className="flex gap-4 pb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-200 bg-white z-10">
                <Activity className="w-4 h-4 text-gray-500" />
              </div>

              <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{log.action}</span>
                    {log.actorUsername && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{log.actorUsername}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Hash chain */}
                <div className="mt-2 space-y-1">
                  {log.previousHash && (
                    <div className="flex items-center gap-1.5">
                      <Link className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400 font-mono truncate">prev: {log.previousHash.substring(0, 16)}...</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-blue-600 font-mono truncate">hash: {log.currentHash.substring(0, 16)}...</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {logs.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No audit entries yet</p>
        </div>
      )}
    </div>
  );
};
