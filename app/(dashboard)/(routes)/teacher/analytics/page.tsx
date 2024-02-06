import { useCoursePurchasesSummary } from '../../../hooks/useCoursePurchasesSummary';
import {PurchasesSummaryChart }from './_components/purchase-summary-chart';

export const AnalyticsPage = () => {
  const data = useCoursePurchasesSummary();

  return (
    <div>
      <h2>Course Purchases Analytics</h2>
      <PurchasesSummaryChart data={data} />
    </div>
  );
}

export default AnalyticsPage;