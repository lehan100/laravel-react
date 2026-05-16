export default function HeaderMenuMobile() {
  return (
    <>
		<div className="header-menu-mobile" data-step-index="0">
			<div className="header-title-close flex items-center justify-between h-[50px] border-b border-neutral-100 gradient-primary">
				<div className="title text-white text-2xl uppercase pl-[15px]">Danh mục</div>
				<div className="close cursor-pointer h-[50px] w-[50px] flex-center bg-Primary-#06 text-white text-4xl "><i className="fa-light fa-chevron-left"></i></div>
			</div>
		</div>
    </>
  );
}
