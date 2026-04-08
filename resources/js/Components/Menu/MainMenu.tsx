import { CircleGauge, Users, UserCog, Cog, Languages, FileText, Library, LayoutTemplate, Image, LayoutDashboard, Store, FolderTree, Package } from 'lucide-react';
import classNames from 'classnames';
import MainMenuItem from '@/Components/Menu/MainMenuItem';
import BsFace from '@/Components/Menu/Fade';
import BsFaceLink from '@/Components/Menu/FadeLink';
import { usePermission } from '@/Hooks/usePermission';
import { useTrans } from '@/Hooks/useTrans';

interface MainMenuProps {
  className?: string;
  mobile?: boolean;
  onNavigate?: () => void;
}

function getRoute() {
  const path = window.location.pathname;
  const regex = /(?<=^\/[^/]+\/)([^/]+)/;
  const match = path.match(regex);
  return match ? match[0] : null;
}

export default function MainMenu({ className, mobile = false, onNavigate }: MainMenuProps) {
  const routers: any = {
    dashboard: ['dashboard'],
    users: ['roles', 'users'],
    catalog: ['category', 'product'],
    media: ['media-position', 'media-banner'],
    settings: ['languages', 'labels', 'layout'],
  };
  const { can } = usePermission();
  const { trans } = useTrans();
  const routeIndex = getRoute();

  return (
    <div className={classNames(className, mobile ? 'flex flex-col gap-3' : 'flex flex-col gap-4')}>
      {can('dashboard') && (
        <BsFaceLink
          mobile={mobile}
          onNavigate={onNavigate}
          title={trans('hancms.dashboard.main')}
          href={route('dashboard')}
          index={routers.dashboard.indexOf(routeIndex)}
          icon={<CircleGauge size={20} />}
        />
      )}

      {(can('roles.index') || can('users.index')) && (
        <BsFace
          mobile={mobile}
          title={trans('hancms.users.main')}
          id="menu-1"
          index={routers.users.indexOf(routeIndex)}
          icon={<Users size={20} />}
        >
          <ul className={classNames(mobile ? 'ps-2' : 'ps-3')}>
            {can('roles.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.roles.name')}
                  link="roles.index"
                  icon={<UserCog size={20} />}
                />
              </li>
            )}
            {can('users.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.users.admin.name')}
                  link="users.index"
                  icon={<Users size={20} />}
                />
              </li>
            )}
          </ul>
        </BsFace>
      )}

      {(can('category.index') || can('product.index')) && (
        <BsFace
          mobile={mobile}
          title={trans('hancms.catalog.name')}
          id="menu-5"
          index={routers.catalog.indexOf(routeIndex)}
          icon={<Store size={20} />}
        >
          <ul className={classNames(mobile ? 'ps-2' : 'ps-3')}>
            {can('category.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.catalog.category.name')}
                  link="category.index"
                  icon={<FolderTree size={20} />}
                />
              </li>
            )}
            {can('product.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.catalog.product.name')}
                  link="product.index"
                  icon={<Package size={20} />}
                />
              </li>
            )}
          </ul>
        </BsFace>
      )}

      {(can('media-position.index') || can('media-banner.index')) && (
        <BsFace
          mobile={mobile}
          title={trans('hancms.media.name')}
          id="menu-2"
          index={routers.media.indexOf(routeIndex)}
          icon={<Library size={20} />}
        >
          <ul className={classNames(mobile ? 'ps-2' : 'ps-3')}>
            {can('media-position.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.media.position.name')}
                  link="media-position.index"
                  icon={<LayoutTemplate size={20} />}
                />
              </li>
            )}
            {can('media-banner.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.media.banner.name')}
                  link="media-banner.index"
                  icon={<Image size={20} />}
                />
              </li>
            )}
          </ul>
        </BsFace>
      )}

      {(can('languages.index') || can('labels.index') || can('layout.index')) && (
        <BsFace
          mobile={mobile}
          title={trans('hancms.settings.main')}
          id="menu-3"
          index={routers.settings.indexOf(routeIndex)}
          icon={<Cog size={20} />}
        >
          <ul className={classNames(mobile ? 'ps-2' : 'ps-3')}>
            {can('languages.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.languages.name')}
                  link="languages.index"
                  icon={<Languages size={20} />}
                />
              </li>
            )}
            {can('labels.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.label.name')}
                  link="labels.index"
                  icon={<FileText size={20} />}
                />
              </li>
            )}
            {can('layout.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.layout.admin.name')}
                  link="layout.index"
                  icon={<LayoutDashboard size={20} />}
                />
              </li>
            )}
          </ul>
        </BsFace>
      )}
    </div>
  );
}
