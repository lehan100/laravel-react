import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
export const usePermission = () => {
    const { auth } = usePage<PageProps>().props;
  // console.log( auth.permissions);
   
    const can = (permission: any) => auth.permissions?.includes(permission);
    return { can };
};