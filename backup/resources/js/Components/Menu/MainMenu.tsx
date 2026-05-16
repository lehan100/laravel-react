import { CircleGauge, Users, UserCog, Cog, Languages, FileText, Library, LayoutTemplate, Image, LayoutDashboard, Store, FolderTree, Package, BadgePercent, Tags, TicketPercent, Boxes, ShoppingCart, CreditCard, FolderKanban, BarChart3, PackageSearch, Warehouse, Gift, Truck, MapPinned, Mail } from 'lucide-react';
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
    catalog: ['category', 'product', 'attribute', 'post'],
    content: ['page-schemas', 'page-values'],
    media: ['media-position', 'media-banner'],
    reports: ['report-revenue', 'report-product', 'report-inventory', 'report-promotion'],
    sales: ['warehouse', 'orders', 'payment-methods', 'shipping-methods'],
    promotion: ['promotion-campaign', 'saleoffer', 'coupon', 'buytogift'],
    settings: ['languages', 'labels', 'hancms-translations', 'locations', 'layout', 'mail-templates'],
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

      {(can('category.index') || can('product.index')  || can('post.index')) && (
        <BsFace
          mobile={mobile}
          title={trans('hancms.catalog.menu_name')}
          id="menu-5"
          index={routers.catalog.indexOf(routeIndex)}
          icon={<FolderKanban size={20} />}
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
            {can('attribute.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.catalog.attribute.name')}
                  link="attribute.index"
                  icon={<Tags size={20} />}
                />
              </li>
            )}
            {can('post.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.catalog.post.name')}
                  link="post.index"
                  icon={<FileText size={20} />}
                />
              </li>
            )}
          </ul>
        </BsFace>
      )}
      {(can('field-groups.index') || can('pages.index')) && (
        <BsFace
          mobile={mobile}
          title={trans('hancms.page.menu_name')}
          id="menu-8"
          index={routers.content.indexOf(routeIndex)}
          icon={<LayoutTemplate size={20} />}
        >
          <ul className={classNames(mobile ? 'ps-2' : 'ps-3')}>
            <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.content.field_design')}
                  link="page-schemas.index"
                  icon={<FolderKanban size={20} />}
                />
              </li>
            <li>
              <MainMenuItem
                mobile={mobile}
                onNavigate={onNavigate}
                text={trans('hancms.content.field_values')}
                link="page-values.index"
                icon={<FileText size={20} />}
              />
            </li>
          </ul>
        </BsFace>
      )}
      {(can('saleoffer.index') || can('coupon.index') || can('buytogift.index') || can('promotion-campaign.index')) && (
        <BsFace
          mobile={mobile}
          title={trans('hancms.promotion.name')}
          id="menu-4"
          index={routers.promotion.indexOf(routeIndex)}
          icon={<BadgePercent size={20} />}
        >
          <ul className={classNames(mobile ? 'ps-2' : 'ps-3')}>
            {can('promotion-campaign.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.promotion.campaign.name')}
                  link="promotion-campaign.index"
                  icon={<FolderKanban size={20} />}
                />
              </li>
            )}
            {can('saleoffer.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.promotion.saleoffer.name')}
                  link="saleoffer.index"
                  icon={<Tags size={20} />}
                />
              </li>
            )}
            {can('coupon.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.promotion.coupon.name')}
                  link="coupon.index"
                  icon={<TicketPercent size={20} />}
                />
              </li>
            )}
            {can('buytogift.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.promotion.buytogift.name')}
                  link="buytogift.index"
                  icon={<Gift size={20} />}
                />
              </li>
            )}
          </ul>
        </BsFace>
      )}
      {(can('warehouse.index') || can('orders.index') || can('payment-methods.index') || can('shipping-methods.index')) && (
        <BsFace
          mobile={mobile}
          title={trans('hancms.sales.name')}
          id="menu-6"
          index={routers.sales.indexOf(routeIndex)}
          icon={<ShoppingCart size={20} />}
        >
          <ul className={classNames(mobile ? 'ps-2' : 'ps-3')}>
            {can('warehouse.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.sales.warehouse.name')}
                  link="warehouse.index"
                  icon={<Boxes size={20} />}
                />
              </li>
            )}
            {can('orders.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.sales.orders.name')}
                  link="orders.index"
                  icon={<ShoppingCart size={20} />}
                />
              </li>
            )}
            {can('payment-methods.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.sales.payment_methods.name')}
                  link="payment-methods.index"
                  icon={<CreditCard size={20} />}
                />
              </li>
            )}
            {can('shipping-methods.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.sales.shipping_methods.name')}
                  link="shipping-methods.index"
                  icon={<Truck size={20} />}
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
      {(can('report-revenue.index') || can('report-product.index') || can('report-inventory.index') || can('report-promotion.index')) && (
        <BsFace
          mobile={mobile}
          title={trans('hancms.report.name')}
          id="menu-7"
          index={routers.reports.indexOf(routeIndex)}
          icon={<BarChart3 size={20} />}
        >
          <ul className={classNames(mobile ? 'ps-2' : 'ps-3')}>
            {can('report-revenue.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.report.revenue.name')}
                  link="report-revenue.index"
                  icon={<BarChart3 size={20} />}
                />
              </li>
            )}
            {can('report-product.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.report.product.name')}
                  link="report-product.index"
                  icon={<PackageSearch size={20} />}
                />
              </li>
            )}
            {can('report-inventory.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.report.inventory.name')}
                  link="report-inventory.index"
                  icon={<Warehouse size={20} />}
                />
              </li>
            )}
            {can('report-promotion.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.report.promotion.name')}
                  link="report-promotion.index"
                  icon={<BadgePercent size={20} />}
                />
              </li>
            )}
          </ul>
        </BsFace>
      )}

      {(can('languages.index') || can('labels.index') || can('hancms-translations.index') || can('locations.index') || can('layout.index' ) || can('mail-templates.index')) && (
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
            {can('hancms-translations.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.translation.name')}
                  link="hancms-translations.index"
                  icon={<FileText size={20} />}
                />
              </li>
            )}
            {can('locations.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.settings.locations.name')}
                  link="locations.index"
                  icon={<MapPinned size={20} />}
                />
              </li>
            )}
            {can('layout.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.settings.layout.admin.name')}
                  link="layout.index"
                  icon={<LayoutDashboard size={20} />}
                />
              </li>
            )}
            {can('mail-templates.index') && (
              <li>
                <MainMenuItem
                  mobile={mobile}
                  onNavigate={onNavigate}
                  text={trans('hancms.settings.mail_template.name')}
                  link="mail-templates.index"
                  icon={<Mail size={20} />}
                />
              </li>
            )}
          </ul>
        </BsFace>
      )}
    </div>
  );
}
