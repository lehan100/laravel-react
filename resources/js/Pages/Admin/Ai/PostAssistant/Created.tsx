import MainLayout from '@/Layouts/MainLayout';
import PostAssistantWorkspace from './Components/PostAssistantWorkspace';

export default function CreatedPage() {
    return (
        <PostAssistantWorkspace
            mode="create"
            initialDrafts={[]}
            initialBatchToken=""
            backHref={route('ai.post-assistant.index')}
        />
    );
}

CreatedPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.ai_assistant.post_assistant.name" children={page} />
);
