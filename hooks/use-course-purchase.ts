import { useEffect, useState } from 'react';

interface CoursePurchaseSummary {
  courseId: string;
  purchases: number;
}

export const useCoursePurchasesSummary = (courseId: string) => {
  const [data, setData] = useState<CoursePurchaseSummary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // APIから購入データをフェッチする
        const response = await fetch(`/api/purchases/summary/${courseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const purchasesSummary = await response.json();

        // データを加工してセットする
        const processedData = purchasesSummary.map((item: { courseId: string; sum: number; }) => ({
          courseId: item.courseId,
          purchases: item.sum
        }));

        setData(processedData);
      } catch (error) {
        console.error("Failed to fetch course purchases summary:", error);
        setData([]);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  return data;
};