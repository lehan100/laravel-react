import { Link, router, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import { MediaPosition, PaginatedData } from '@/types';
import { useMemo } from 'react';
import Pagination from '@/Components/Pagination/Pagination';
import TableView from '@/Components/Table/TableViewAll';
import DeleteButton from '@/Components/Button/DeleteButton';
import DeleteButtonView from '@/Components/Button/DeleteButtonView';
import EditButton from '@/Components/Button/EditButtonView';
import CreatedButton from '@/Components/Button/CreatedButton';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import Card from '@/Components/Main/Card';
function IndexPage() {
  const { trans } = useTrans();
  const { data, setData, errors, post, processing } = useForm({
    data_ids: ''
  });
  const { items, config_path }: any = usePage<{ items: PaginatedData<MediaPosition>; }>().props;
  const { meta: { links } }: any = items;
  const statusClass: any = {
    '0': {
      'bg': 'inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-red-500 text-white',
      'text': trans('hancms.status.inactive')
    },
    '1': {
      'bg': 'inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-green-500 text-white',
      'text': trans('hancms.status.active')
    }
  };
  const columns = useMemo(
    () => [
      {
        label: 'ID',
        name: 'id'
      },
      {
        label: trans('hancms.column.name'),
        name: 'name',
      },

      {
        label: trans('hancms.column.code'),
        name: 'code'
      },
      {
        label: trans('hancms.column.status'),
        name: 'status',
        renderCell: (row: any) => (
          <span className={statusClass[row.status]['bg']}>{statusClass[row.status]['text']}</span >
        )
      },
      {
        label: trans('hancms.column.action'),
        name: 'action',
        renderCell: (row: any) => (
          <>
            <div className="flex gap-2">
              <EditButton href={route('languages.edit', row.id)}>
                {trans('hancms.button.edit')}
              </EditButton>
              <DeleteButtonView size_icon={14} onDelete={() => destroy(row.id)}>
                {trans('hancms.button.delete')}
              </DeleteButtonView>
            </div>

          </>
        )
      },
    ],
    []
  );
  function destroy(id: any) {
    if (confirm(trans('hancms.message.destroy', { name: trans('hancms.media.position.name').toLowerCase() }))) {
      router.delete(route('media-position.destroy', id), {

        onSuccess: () => {

        }
      });
    }
  }
  function destroys() {
    if (confirm(trans('hancms.message.destroys'))) {
      let ids = data.data_ids;
      if (ids.length > 0) {
        router.delete(route('media-position.destroyMany', { 'ids': data.data_ids }));
      }

    }
  }
  // Callback function to receive data
  const handleChildData = (data: any) => {
    setData('data_ids', data);
  };
  return (
    <div>
      <HeaderToolbar title={trans('hancms.media.position.name')}>
        <CreatedButton
          href={route("media-position.create")}
        >
          {trans('hancms.button.created')}
        </CreatedButton>
        <DeleteButton
          onDelete={() => destroys()}
          size={18}
        >
          {trans('hancms.button.delete.selected')}
        </DeleteButton>
      </HeaderToolbar>
      <Card>
        <div className="overflow-x-auto">
          <TableView
            columns={columns}
            rows={items.data}
            sendDataSelectItems={handleChildData}
            getRowDetailsUrl={row => route('media-position.edit', row.id)}
          />
        </div>
        <Pagination links={links} />
      </Card>
    </div>
  );
}

IndexPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.media.position.name" children={page} />
);

export default IndexPage;
