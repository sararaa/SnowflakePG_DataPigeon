'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Calendar, TrendingUp } from 'lucide-react';
import { supabase, Prediction, Charger } from '@/lib/supabase';

const RISK_COLORS = {
  Low: 'bg-green-500',
  Medium: 'bg-yellow-500',
  High: 'bg-orange-500',
  Critical: 'bg-red-500',
};

export default function PredictivePage() {
  const [predictions, setPredictions] = useState<
    (Prediction & { charger: Charger | null })[]
  >([]);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    const { data } = await supabase
      .from('predictions')
      .select('*, charger:chargers(*)')
      .order('confidence_percentage', { ascending: false });

    if (data) {
      setPredictions(data as any);
    }
  };

  const getTimeToFailure = (predictedDate: string) => {
    const now = new Date().getTime();
    const predicted = new Date(predictedDate).getTime();
    const diff = predicted - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  const riskMatrixData = [
    { impact: 'High', probability: 'High', count: 3, color: 'bg-red-500' },
    { impact: 'High', probability: 'Medium', count: 2, color: 'bg-orange-500' },
    { impact: 'High', probability: 'Low', count: 1, color: 'bg-yellow-500' },
    { impact: 'Medium', probability: 'High', count: 2, color: 'bg-orange-500' },
    { impact: 'Medium', probability: 'Medium', count: 4, color: 'bg-yellow-500' },
    { impact: 'Medium', probability: 'Low', count: 2, color: 'bg-green-500' },
    { impact: 'Low', probability: 'High', count: 1, color: 'bg-yellow-500' },
    { impact: 'Low', probability: 'Medium', count: 3, color: 'bg-green-500' },
    { impact: 'Low', probability: 'Low', count: 5, color: 'bg-green-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Predictive Maintenance
          </h1>
          <p className="text-muted-foreground">
            AI-powered failure prediction and preventive recommendations
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              High Risk Chargers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-red-500" />
              <span className="text-3xl font-bold">
                {predictions.filter((p) => p.risk_level === 'High' || p.risk_level === 'Critical').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Average Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <span className="text-3xl font-bold">
                {predictions.length > 0
                  ? (
                      predictions.reduce((sum, p) => sum + p.confidence_percentage, 0) /
                      predictions.length
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Maintenance Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-green-500" />
              <span className="text-3xl font-bold">
                {predictions.filter((p) => p.confidence_percentage > 70).length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Risk Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {['High', 'Medium', 'Low'].map((probability) => (
              <div key={probability} className="text-center font-medium text-sm">
                {probability} Probability
              </div>
            ))}
            {riskMatrixData.map((cell, index) => (
              <div
                key={index}
                className={`${cell.color} text-white p-6 rounded-lg flex items-center justify-center`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">{cell.count}</div>
                  <div className="text-xs">{cell.impact} Impact</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Chargers at Risk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {predictions.map((prediction) => (
              <Card key={prediction.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold">
                        {prediction.charger?.charger_id || 'N/A'}
                      </span>
                      <Badge
                        className={`${
                          RISK_COLORS[
                            prediction.risk_level as keyof typeof RISK_COLORS
                          ]
                        } text-white`}
                      >
                        {prediction.risk_level} Risk
                      </Badge>
                      <Badge variant="outline">
                        {prediction.confidence_percentage}% confidence
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Predicted failure in:{' '}
                      <span className="font-medium text-foreground">
                        {getTimeToFailure(prediction.predicted_failure_date)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Recommended action:{' '}
                      </span>
                      <span className="font-medium">
                        {prediction.recommended_action}
                      </span>
                    </div>
                  </div>
                  <Button size="sm">Schedule Maintenance</Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
