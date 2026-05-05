import BackButton from '@/Components/Button/BackButton';
import SaveButton from '@/Components/Button/SaveButton';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import { ReactNode } from 'react';

type AdminFormHeaderProps = {
    title: ReactNode;
    backHref: string;
    submitLabel: string;
    processing: boolean;
    undo: number;
    handleUndo: (status: number) => void;
    trans: (key: string, params?: Record<string, any>) => string;
    icon?: ReactNode;
    formId?: string;
};

export default function AdminFormHeader({
    title,
    backHref,
    submitLabel,
    processing,
    undo,
    handleUndo,
    trans,
    icon,
    formId = 'my-form',
}: AdminFormHeaderProps) {
    return (
        <HeaderToolbar title={title}>
            <SaveButton
                loading={processing}
                undo={undo}
                icon={icon}
                sendDataStatusUndo={handleUndo}
                form={formId}
            >
                {submitLabel}
            </SaveButton>
            <BackButton href={backHref}>{trans('hancms.button.back')}</BackButton>
        </HeaderToolbar>
    );
}
