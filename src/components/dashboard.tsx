'use client';

import { DollarSign, TowerControl } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/lib/handlers/invoices';
import { formatCurrency } from '@/lib/utils';

export function Dashboard() {
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {/* Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>
              Consumo de Energia Elétrica
            </CardTitle>
            <TowerControl className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dashboardData?.energyConsumption} kWh
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>
              Energia Compensada
            </CardTitle>
            <TowerControl className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dashboardData?.compensatedEnergy} kWh
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>
              Valor Total sem GD
            </CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatCurrency(dashboardData?.totalWithoutGD || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Economia GD</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatCurrency(dashboardData?.gdEconomy || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='mt-6 grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Energia (kWh)</CardTitle>
            <CardDescription>
              Comparativo entre os resultados de energia
              <br />
              Sem GD e Compensação GD
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <ChartContainer
                config={{
                  value: {
                    label: 'Valor',
                    color: '#350d80',
                  },
                }}
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={dashboardData?.energyResults}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey='name'
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator='dashed' />}
                    />
                    <Bar dataKey='value' fill='var(--color-value)' radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resultados Financeiros (R$)</CardTitle>
            <CardDescription>
              Comparativo entre os resultados financeiros
              <br />
              Sem GD e Economia GD
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <ChartContainer
                config={{
                  value: {
                    label: 'Valor',
                    color: '#471f35',
                  },
                }}
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={dashboardData?.financialResults}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey='name'
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator='dashed' />}
                    />
                    <Bar dataKey='value' fill='var(--color-value)' radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
