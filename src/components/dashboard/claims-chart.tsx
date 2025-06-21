'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { Claim } from '@/lib/types';

export function ClaimsChart({ claims }: { claims: Claim[] }) {
  const data = [
    { name: 'Low Risk', value: claims.filter(c => c.riskLabel === 'Low').length, fill: 'var(--color-low)' },
    { name: 'Medium Risk', value: claims.filter(c => c.riskLabel === 'Medium').length, fill: 'var(--color-medium)' },
    { name: 'High Risk', value: claims.filter(c => c.riskLabel === 'High').length, fill: 'var(--color-high)' },
  ];

  return (
    <div className="h-[350px]">
        <style>{`
            :root {
                --color-low: #10B981;
                --color-medium: #F59E0B;
                --color-high: #EF4444;
            }
            .dark {
                --color-low: #10B981;
                --color-medium: #F59E0B;
                --color-high: #EF4444;
            }
        `}</style>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={value => `${value}`} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
            }}
          />
          <Legend iconType="circle" />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
