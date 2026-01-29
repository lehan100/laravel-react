import { useEffect, useState } from 'react';

import { CircleGauge, Users, UserCog } from 'lucide-react';
import classNames from 'classnames';
import MainMenuItem from '@/Components/Menu/MainMenuItem';
import BsFace from '@/Components/Menu/Fade';
import BsFaceLink from '@/Components/Menu/FadeLink';
import { usePermission } from '@/Hooks/usePermission';
import { useTrans } from '@/Hooks/useTrans';
interface MainMenuProps {
  className?: string;
}
function getRoute() {
  const path = window.location.pathname;
  // Regex này bỏ qua dấu / đầu tiên, bỏ qua phần refix admin123, và lấy cụm chữ tiếp theo
  const regex = /(?<=^\/[^/]+\/)([^/]+)/;
  const match = path.match(regex);
  return match ? match[0] : null;;
}
export default function MainMenu({ className }: MainMenuProps) {
  const iconClasses = classNames(
    'text-white'
  );
  const textClasses = classNames(
    'text-white'
  );
  const routers: any = {
    'dashboard': ['dashboard'],
    'users': ['roles', 'users'],
  }
  const { can } = usePermission();
  const { trans } = useTrans();
  const [routeIndex, setRouteIndex] = useState(getRoute());
  useEffect(() => {
    setRouteIndex(getRoute());
  });
  return (
    <div className={className}>
      {can("dashboard") &&
        <BsFaceLink title={trans('hancms.dashboard.main')} href={route('dashboard')} index={routers['dashboard'].indexOf(routeIndex)} icon={<CircleGauge size={20} />} />
      }
      {(can("roles.index") || can("users.index")) &&
        <BsFace title={trans('hancms.users.main')} id={'menu-1'} index={routers['users'].indexOf(routeIndex)} icon={<Users size={20} />}>
          <ul>
            {can("roles.index") &&
              <li>
                <MainMenuItem
                  text={trans('hancms.roles.name')}
                  link="roles.index"
                  icon={<UserCog size={20} />}
                />
              </li>
            }
            {can("users.index") &&
              <li>
                <MainMenuItem
                  text={trans('hancms.users.admin.name')}
                  link="users.index"
                  icon={<Users size={20} />}
                />
              </li>
            }
          </ul>
        </BsFace>
      }
      <BsFace title='Test' id={'menu-2'} icon={<CircleGauge size={20} />}>

      </BsFace>
    </div>
  );
}
