import AttributeFormView from '@/Pages/Admin/Attribute/Components/AttributeFormView'
import Card from '@/Components/Main/Card'
import HeaderToolbar from '@/Components/Main/HeaderToolbar'
import MainLayout from '@/Layouts/MainLayout'
import SaveButton from '@/Components/Button/SaveButton'
import BackButton from '@/Components/Button/BackButton'
import { useTrans } from '@/Hooks/useTrans'
import { Save } from 'lucide-react'
import { useState } from 'react'

export default function Created() {
    const { trans } = useTrans()
    const [processing, setProcessing] = useState(false)
    const [undo, setUndo] = useState(0)

    const handleUndo = (status: number) => {
        setUndo(status)
    }

    return (
        <div>
            <HeaderToolbar title={trans('hancms.catalog.attribute.name')}>
                <SaveButton
                    loading={processing}
                    undo={undo}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form="attribute-form"
                >
                    {trans('hancms.button.save')}
                </SaveButton>
                <BackButton href={route('attribute.index')}>
                    {trans('hancms.button.back')}
                </BackButton>
            </HeaderToolbar>

            <Card>
                <AttributeFormView
                    undo={undo}
                    onProcessingChange={setProcessing}
                />
            </Card>
        </div>
    )
}

Created.layout = (page: React.ReactNode) => <MainLayout title="hancms.catalog.attribute.created" children={page} />
