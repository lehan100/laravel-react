import { useLaravelReactI18n } from 'laravel-react-i18n';

export function useTrans() {
    const { t } = useLaravelReactI18n();

    // Định nghĩa kiểu rõ ràng để tránh lỗi 'unknown'
    const trans = (key: string, replace: Record<string, any> = {}): string => {
        const result = t(key, replace);
        if (result === key && process.env.NODE_ENV === 'development') {
            console.warn(`[I18n] Thiếu bản dịch cho key: "${key}"`);
        }
        return result;
    };

    return { trans };
}