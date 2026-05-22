import { usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PostAssistantWorkspace from './Components/PostAssistantWorkspace';

type BatchItem = {
    draft_id: string;
    title: string;
    description: string;
    content: string;
    photo: string;
    photo_url?: string;
    translations?: Record<string, {
        title: string;
        description: string;
        content: string;
        photo: string;
        photo_url?: string;
    }>;
    published_at: string;
};

export default function EditPage() {
    const { batch }: any = usePage().props;
    const items = Array.isArray(batch?.items) ? batch.items as BatchItem[] : [];

    return (
        <PostAssistantWorkspace
            mode="edit"
            initialBatchToken={batch?.token || ''}
            initialDrafts={items}
            backHref={route('ai.post-assistant.index')}
        />
    );
}

EditPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.ai_assistant.post_assistant.name" children={page} />
);
