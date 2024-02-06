
// hooks/use-course-purchase.ts
import { useEffect, useState } from 'react';

interface CoursePurchaseSummary {
  courseId: string;
  purchases: number;
}

export const useCoursePurchasesSummary = () => {
  const [data, setData] = useState<CoursePurchaseSummary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // APIから購入データをフェッチする
        const response = await fetch('/api/purchases/summary');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const purchasesSummary = await response.json();

        // データを加工してセットする
        const processedData = purchasesSummary.map((item: any) => ({
          courseId: item.courseId,
          purchases: item.sum // 仮にsumプロパティに購入数の合計が格納されているとする
        }));

        setData(processedData);
      } catch (error) {
        console.error("Failed to fetch course purchases summary:", error);
        setData([]);
      }
    };

    fetchData();
  }, []);

  return data;
};