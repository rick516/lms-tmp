import { useCoursePurchasesSummary } from '@/hooks/use-course-purchase';
import { PurchasesSummaryChart } from './_components/purchase-summary-chart';

export const AnalyticsPage = () => {
  const coursePurchasesData = useCoursePurchasesSummary();

  return (
    <div>
      <h2>Course Analytics</h2>
      <PurchasesSummaryChart data={coursePurchasesData} />
    </div>
  );
}

export default AnalyticsPage;