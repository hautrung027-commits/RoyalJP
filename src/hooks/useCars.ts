import { useCallback, useEffect, useRef, useState } from 'react';
import { Car } from '../types';
import { CarsStorageService } from '../services/carsStorage';

export const CARS_UPDATED_EVENT = 'royaljpcar-cars-updated';

export interface UseCarsResult {
  /** Danh sách xe hiện tại. Luôn là mảng, kể cả khi đang tải hoặc lỗi. */
  cars: Car[];
  /** True trong lần tải đầu tiên và mỗi lần refetch thủ công. */
  isLoading: boolean;
  /** Thông báo lỗi hiển thị được cho người dùng, null nếu không có lỗi. */
  error: string | null;
  /** Tải lại danh sách từ Firestore. */
  refetch: () => Promise<void>;
  /**
   * Cập nhật danh sách ngay tại client mà không gọi server.
   * Dùng cho optimistic update; trả về snapshot trước đó để rollback khi lỗi.
   */
  mutateLocal: (updater: (prev: Car[]) => Car[]) => Car[];
  /** Khôi phục danh sách về một snapshot đã lưu. */
  restore: (snapshot: Car[]) => void;
}

/**
 * Nguồn dữ liệu xe dùng chung cho cả website và Admin Portal.
 *
 * Tự đồng bộ khi có bất kỳ nơi nào phát sự kiện `royaljpcar-cars-updated`
 * (xem `CarsStorageService.notifyChange`).
 */
export function useCars(): UseCarsResult {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Chặn setState sau khi component đã unmount.
  const isMountedRef = useRef(true);
  // Giữ snapshot mới nhất để mutateLocal trả về giá trị rollback chính xác.
  const carsRef = useRef<Car[]>([]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const applyCars = useCallback((next: Car[]) => {
    carsRef.current = next;
    setCars(next);
  }, []);

  const load = useCallback(
    async (showSpinner: boolean) => {
      if (showSpinner) setIsLoading(true);

      try {
        const data = await CarsStorageService.getCars();
        if (!isMountedRef.current) return;

        applyCars(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        if (!isMountedRef.current) return;

        console.error('useCars: không tải được danh sách xe.', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Không thể tải danh sách xe. Vui lòng thử lại.'
        );
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    },
    [applyCars]
  );

  // Tải lần đầu + đồng bộ khi kho xe thay đổi.
  useEffect(() => {
    load(true);

    // Refresh nền: không bật spinner để danh sách không nhấp nháy sau mỗi thao tác.
    const handleUpdate = () => {
      load(false);
    };

    window.addEventListener(CARS_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(CARS_UPDATED_EVENT, handleUpdate);
    };
  }, [load]);

  const refetch = useCallback(() => load(true), [load]);

  const mutateLocal = useCallback(
    (updater: (prev: Car[]) => Car[]) => {
      const snapshot = carsRef.current;
      applyCars(updater(snapshot));
      return snapshot;
    },
    [applyCars]
  );

  const restore = useCallback(
    (snapshot: Car[]) => {
      applyCars(snapshot);
    },
    [applyCars]
  );

  return { cars, isLoading, error, refetch, mutateLocal, restore };
}
