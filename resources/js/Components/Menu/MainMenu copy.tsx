import MainMenuItem from '@/Components/Menu/MainMenuItem';
import { Link } from '@inertiajs/react';
import { Building, CircleGauge, Printer, Users, UserCog } from 'lucide-react';
import classNames from 'classnames';
interface MainMenuProps {
  className?: string;
}

export default function MainMenu({ className }: MainMenuProps) {
  const iconClasses = classNames(
    'text-white'
  );
  const textClasses = classNames(
    'text-white'
  );
  return (
    <div className={className}>
      <ul className='menu-nav'>
        <li>
          <MainMenuItem
            text="Dashboard"
            link="dashboard"
            icon={<CircleGauge size={20} />}
          />
        </li>
        <li>
          <Link
            href=""
            className="flex items-center group py-3 space-x-3"
          >
            <div className={iconClasses}>{<Users size={20} />}</div>
            <div className={textClasses}>Users</div>
          </Link>
          <ul>
            <li>
              <MainMenuItem
                text="Roles"
                link="roles.index"
                icon={<UserCog size={20} />}
              />
            </li>
          </ul>
        </li>
      </ul>


      <MainMenuItem
        text="Organizations"
        link="organizations"
        icon={<Building size={20} />}
      />
      <MainMenuItem
        text="Contacts"
        link="contacts"
        icon={<Users size={20} />}
      />
      <MainMenuItem
        text="Reports"
        link="reports"
        icon={<Printer size={20} />}
      />
    </div>
  );
}
